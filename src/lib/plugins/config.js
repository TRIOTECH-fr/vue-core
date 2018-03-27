import Vue from 'vue';
import config from '%/config.yml';
import parameters from '%/parameters.yml';

// TODO generate computed fns from parameters keys
// TODO handle dot notation for get/set

const Config = new Vue({
  data() {
    return {
      config: _.extend(config, parameters),
    };
  },
  computed: {
    host() {
      return (this.local('host') || this.config.host || '').replace(/\/$/, '');
    },
    endpoint() {
      return (this.local('endpoint') || this.config.endpoint || '').replace(/\/$/, '').concat('/');
    },
  },
  methods: {
    all() {
      return this.config;
    },
    get(key, fallback) {
      return this.config[key] || fallback;
    },
    set(key, value) {
      this.$set(this.config, key, value);
    },
    local(key) {
      return localStorage.getItem(key);
    },
  },
});

Vue.set(Vue.prototype, '$config', Config);

export default Config;
