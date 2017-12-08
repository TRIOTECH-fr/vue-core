import Vue from 'vue';
import Ajax from '@triotech/vue-core/src/lib/http/ajax';

// TODO inheritance : api extends ajax
// const Api = Ajax;

const prefix = (uri = '') => `api/${uri.replace(/^\//, '')}`;

const Api = new Vue({
  components: { Ajax },
  methods: {
    sync(...args) {
      Ajax.sync(...args);
      return this;
    },
    // request: (...args) => Ajax.request(prefix(...args)),
    get: (uri, ...args) => Ajax.get(prefix(uri), ...args),
    post: (uri, ...args) => Ajax.post(prefix(uri), ...args),
    put: (uri, ...args) => Ajax.put(prefix(uri), ...args),
    patch: (uri, ...args) => Ajax.patch(prefix(uri), ...args),
    delete: (uri, ...args) => Ajax.delete(prefix(uri), ...args),
    head: (uri, ...args) => Ajax.head(prefix(uri), ...args),
  },
});

export default Api;
