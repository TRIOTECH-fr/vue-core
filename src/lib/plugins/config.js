import Vue from 'vue';
import config from '%/config.yml';
import parameters from '%/parameters.yml';

const Config = new Vue({
  data() {
    return {
      data: this._.extend(config, parameters),
    };
  },
  computed: {
    host() {
      return (this.local('host') || this.data.host || '').replace(/\/$/, '');
    },
    endpoint() {
      return (this.local('endpoint') || this.data.endpoint || '').replace(/\/$/, '').concat('/');
    },
  },
  methods: {
    all() {
      return this.data;
    },
    get(key, fallback) {
      return this._.get(this.data, key, fallback);
    },
    set(key, value) {
      return this._.set(this.data, key, value);
    },
    local(key) {
      return localStorage.getItem(key);
    },
  },
});

Vue.set(Vue.prototype, '$config', Config);

export default Config;
