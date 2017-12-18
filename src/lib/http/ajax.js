import Vue from 'vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import Config from '@triotech/vue-core/src/lib/core/config';
import Store from '@triotech/vue-core/src/lib/core/store';
import _ from '@triotech/vue-core/src/vendor/lodash';

Vue.use(VueAxios, Axios);

const Ajax = new Vue({
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
    login(model) {
      const oauth = Config.get('oauth');
      return this.request(this.build('oauth/v2/token', 'POST', _.extend({
        client_id: oauth.client_id,
        client_secret: oauth.client_secret,
        grant_type: 'password',
      }, model)));
    },
    request(config = {}) {
      const promise = this.wait ? this.sync_request(config) : this.async_request(config);
      this.wait = null;
      return promise;
    },
    async sync_request(config) {
      const response = await this.async_request(config);
      return response;
    },
    async_request(config) {
      config.url = this.url(config);
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
  },
});

export default Ajax;
