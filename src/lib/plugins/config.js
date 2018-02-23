import Vue from 'vue';
// eslint-disable-next-line import/no-webpack-loader-syntax
import parameters from 'json-loader!yaml-loader!@/../config/parameters.yml';

// TODO generate computed fns from parameters keys
// TODO handle dot notation for get/set

const Config = new Vue({
  computed: {
    parameters: () => parameters,
    host() {
      return (this.local('host') || this.parameters.host || '').replace(/\/$/, '');
    },
    endpoint() {
      return (this.local('endpoint') || this.parameters.endpoint || '').replace(/\/$/, '').concat('/');
    },
  },
  methods: {
    all() {
      return this.parameters;
    },
    get(key, fallback) {
      return this.parameters[key] || fallback;
    },
    set(key, value) {
      this.$set(this.parameters, key, value);
    },
    local(key) {
      return localStorage.getItem(key);
    },
  },
});

Vue.set(Vue.prototype, '$config', Config);

export default Config;
