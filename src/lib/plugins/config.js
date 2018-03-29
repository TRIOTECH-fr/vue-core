import Vue from 'vue';
import config from '%/config.yml';
import parameters from '%/parameters.yml';

// TODO generate computed fns from parameters keys
// TODO handle dot notation for get/set

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
      return this._.has(this.data, key) ? this.data[key] : fallback;
    },
    set(key, value) {
      this.$set(this.data, key, value);
    },
    local(key) {
      return localStorage.getItem(key);
    },
  },
});

Vue.set(Vue.prototype, '$config', Config);

export default Config;
