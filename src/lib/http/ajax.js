import Vue from 'vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import Config from '@triotech/vue-core/src/lib/helper/config';
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
    extend(url, data, method) {
      return _.extend({ url, data, method });
    },
    get(url, data, config) {
      return this.request(this.extend(url, data, 'GET'), config);
    },
    post(url, data, config) {
      return this.request(this.extend(url, data, 'POST'), config);
    },
    put(url, data, config) {
      return this.request(this.extend(url, data, 'PUT'), config);
    },
    patch(url, data, config) {
      return this.request(this.extend(url, data, 'PATCH'), config);
    },
    delete(url, data, config) {
      return this.request(this.extend(url, data, 'DELETE'), config);
    },
    head(url, data, config) {
      return this.request(this.extend(url, data, 'HEAD'), config);
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
        .catch((err) => {
          /* eslint-disable no-console */
          console.error(err);
          return err;
        })
      ;
    },
  },
});

export default Ajax;
