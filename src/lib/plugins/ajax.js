import Vue from 'vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import moment from 'moment';
import { mapActions } from 'vuex';
import QS from 'qs';
import Y from '@triotech/vue-core/src/lib/plugins/y';

Vue.use(VueAxios, Axios);

Axios.defaults.timeout = 10000;

const Ajax = new Vue({
  computed: {
    httpGet: () => 'GET',
    httpPost: () => 'POST',
    httpPut: () => 'PUT',
    httpPatch: () => 'PATCH',
    httpDelete: () => 'DELETE',
    httpHead: () => 'HEAD',
    oauthTokenEndpoint: () => 'oauth/v2/token',
    oauthTokenType: () => 'Bearer',
    oauthStore() { return this.$store.getters.oauth || {}; },
    oauthConfig() { return this.$config.get('oauth') || {}; },
  },
  methods: {
    getUploadsUri(location) {
      return this.url(this.build(location), true);
    },
    url(config, withoutEndpoint = false) {
      let url = config && config.url;
      const endPoint = withoutEndpoint ? '/' : (this.$config.endpoint || '');
      if (url && url.indexOf('://') === -1) {
        url = `${this.$config.host}${endPoint}${url}`;
      }
      return url;
    },
    encode(input) {
      const format = (stack, key) => (stack ? `${stack}[${key}]` : key);
      return Y(next => (form, data, stack = null) => {
        if (this._.isObject(data)) {
          this._.forOwn(data, (value, key) => {
            if (this._.isObject(value)) {
              if (this._.isBlob(value)) {
                form.append(format(stack, key), value);
              } else if (this._.isArray(value)) {
                value.forEach(subValue => form.append(`${format(stack, key)}[]`, subValue));
              } else {
                next(form, value, format(stack, key));
              }
            } else {
              form.append(format(stack, key), value);
            }
          });
        }
        return form;
      })(new FormData(), this._.isString(input) ? QS.parse(input) : input);
    },
    sync() {
      this.wait = true;
      return this;
    },
    build(url, method, data = {}, config = {}) {
      return this._.extend(config, { url, method, data });
    },
    publicRequest(url = '/', method = this.httpGet, data = {}, config = {}) {
      const conf = this._.merge({
        method,
        url,
        data,
      }, config);
      conf.url = this.url(conf);
      return this.$http.request(conf).then(response => response.data);
    },
    get(url, data, config) {
      return this.request(this.build(url, this.httpGet, data, config));
    },
    post(url, data, config) {
      return this.request(this.build(url, this.httpPost, data, config));
    },
    put(url, data, config) {
      return this.request(this.build(url, this.httpPut, data, config));
    },
    patch(url, data, config) {
      return this.request(this.build(url, this.httpPatch, data, config));
    },
    delete(url, data, config) {
      return this.request(this.build(url, this.httpDelete, data, config));
    },
    head(url, data, config) {
      return this.request(this.build(url, this.httpHead, data, config));
    },
    redirect(uri = '/') {
      location.href = uri;
    },
    login(data) {
      return this.oauth(this._.extend({
        grant_type: 'password',
      }, data), !!data.rememberMe);
    },
    refresh() {
      return this.oauth({
        grant_type: 'refresh_token',
        refresh_token: this.oauthStore.refresh_token,
      });
    },
    oauth(data, commit = true) {
      return this.request(this.build(this.oauthTokenEndpoint, this.httpPost, this._.extend({
        client_id: this.oauthConfig.client_id,
        client_secret: this.oauthConfig.client_secret,
      }, data), { commit })).then((value) => {
        value.expires_at = (value.expires_in * 1000) + moment();
        value.refresh_token_expires_at = (value.refresh_token_lifetime * 1000) + moment();
        if (commit) {
          this.set({ oauth: value });
        } else {
          this.$store.state.oauth = value;
        }
        this.setKeyValueAction({ key: 'oauth', value, commit });
        return value;
      });
    },
    request(config = {}) {
      const promise = this.wait ? this.syncRequest(config) : this.asyncRequest(config);
      this.wait = null;
      return promise;
    },
    async syncRequest(config) {
      const result = await this.asyncRequest(config);
      return result;
    },
    asyncRequest(config) {
      config.url = this.url(config);
      config.headers = [];

      if (!this._.isEmpty(this.oauthStore)) {
        if (!config.commit && this._.expired(this.oauthStore.expires_at)) {
          if (this._.expired(this.oauthStore.refresh_token_expires_at)) {
            this.unset('oauth');
            this.setKeyValueAction({ key: 'oauth', value: null });
            return this.redirect();
          }
          return this.refresh().then(this.asyncRequest.bind(this, config));
        }

        if (config.url.indexOf(this.oauthTokenEndpoint) === -1) {
          config.headers = this._.extend({
            Authorization: `${this.oauthTokenType} ${this.oauthStore.access_token}`,
          }, config.headers);
        }
      }

      if (config.stringify) {
        config.data = QS.stringify(config.data);
      }

      const multiPart = this._.some(config.data, value => value instanceof File);
      if (multiPart) {
        config.data = this.encode(config.data);
        config.headers['X-Http-Method-Override'] = config.method;
        config.method = this.httpPost;
      }

      return this.$http.request(config)
        .then((res) => {
          let { data } = res;
          // eslint-disable-next-line no-underscore-dangle
          if (data._embedded && data._embedded.items) {
            // eslint-disable-next-line no-underscore-dangle
            data = data._embedded.items;
          }
          this.$store.data = data;
          this.$store[config.url] = data;
          return data;
        })
        .catch((error) => {
          const data = (error.response && error.response.data) || {};
          if (data.error === 'invalid_grant') {
            const description = data.error_description;
            if (description.match(/expired/i) && error.response.status === 401) {
              delete config.headers;
              return this.refresh().then(this.asyncRequest.bind(this, config));
            } else if (!description.match(/password/i) && description.match(/invalid|expired/i) && error.response.status === 400) {
              this.unset('oauth');
              this.setKeyValueAction({ key: 'oauth', value: null });
              return this.redirect();
            }
          } else {
            // eslint-disable-next-line no-console
            console.error({
              response: error.response,
              request: error.request,
              message: error.message,
              config: error.config,
            });
          }
          throw error;
        });
    },
    ...mapActions(['setKeyValueAction']),
  },
});

Vue.set(Vue.prototype, '$ajax', Ajax);

export default Ajax;
