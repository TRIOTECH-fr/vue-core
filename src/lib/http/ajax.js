import Vue from 'vue';
import { mapActions } from 'vuex';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import Config from '@triotech/vue-core/src/lib/core/config';
import Store from '@triotech/vue-core/src/lib/core/store';
import _ from '@triotech/vue-core/src/vendor/lodash';

Vue.use(VueAxios, Axios);

Axios.defaults.timeout = 10000;

const Ajax = new Vue({
  store: Store,
  computed: {
    oauth: () => 'a',
  },
  methods: {
    url(config) {
      let url = config && config.url;
      if (url && url.indexOf('://') === -1) {
        url = `${Config.host}${url}`;
      }
      return url;
    },
    sync() {
      this.wait = true;
      return this;
    },
    build(url, method, data = {}, config = {}) {
      return _.extend(config, { url, method, data });
    },
    get(url, data, config) {
      return this.request(this.build(url, 'GET', data, config));
    },
    post(url, data, config) {
      return this.request(this.build(url, 'POST', data, config));
    },
    put(url, data, config) {
      return this.request(this.build(url, 'PUT', data, config));
    },
    patch(url, data, config) {
      return this.request(this.build(url, 'PATCH', data, config));
    },
    delete(url, data, config) {
      return this.request(this.build(url, 'DELETE', data, config));
    },
    head(url, data, config) {
      return this.request(this.build(url, 'HEAD', data, config));
    },
    login(data) {
      return this.oauth(_.extend({
        grant_type: 'password',
      }, data), !!data.rememberMe);
    },
    refresh() {
      const oauth = Store.state.oauth;
      return this.oauth({
        grant_type: 'refresh_token',
        refresh_token: oauth && oauth.refresh_token,
      });
    },
    oauth(data, commit = true) {
      const oauth = Config.get('oauth');
      return this.request(this.build('oauth/v2/token', 'POST', _.extend({
        client_id: oauth.client_id,
        client_secret: oauth.client_secret,
      }, data), { commit })).then((value) => {
        value.expires_at = (value.expires_in * 1000) + Number(new Date());
        this.setKeyValueAction({ key: 'oauth', value, commit });
        return value;
      });
    },
    request(config = {}) {
      /* eslint-disable no-underscore-dangle */
      const promise = this.wait ? this._request(config) : this.__request(config);
      this.wait = null;
      return promise;
    },
    async _request(config) {
      /* eslint-disable no-underscore-dangle */
      const response = await this.__request(config);
      return response;
    },
    __request(config) {
      config.url = this.url(config);

      const oauth = Store.state.oauth;
      if (oauth) {
        if (!config.commit && (Number(new Date()) - oauth.expires_at) / 1000 > 0) {
          return this.refresh().then(this.__request.bind(this, config));
        }
        config.headers = _.extend(config.headers, {
          Authorization: `Bearer ${oauth.access_token}`,
        });
      }

      return this.$http.request(config)
        .then((res) => {
          let data = res.data;
          /* eslint-disable no-underscore-dangle */
          if (data._embedded && data._embedded.items) {
            data = data._embedded.items;
          }
          Store.data = data;
          Store[config.url] = data;
          return data;
        })
        .catch((error) => {
          const data = error.response.data;
          if (data.error === 'invalid_grant') {
            if (data.error_description.indexOf('refresh') !== -1) {
              this.setKeyValueAction({ key: 'oauth', value: null });
              // TODO redirect to /login
            } else if (data.error_description.indexOf('expired') !== -1) {
              return this.refresh().then(this.__request.bind(this, config));
            }
          }
          /* eslint-disable no-console */
          console.error({
            response: error.response,
            request: error.request,
            message: error.message,
            config: error.config,
          });
          throw error;
        })
      ;
    },
    ...mapActions(['setKeyValueAction']),
  },
});

export default Ajax;
