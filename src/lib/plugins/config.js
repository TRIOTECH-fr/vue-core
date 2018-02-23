import Vue from 'vue';
// eslint-disable-next-line import/no-webpack-loader-syntax
import parameters from 'json-loader!yaml-loader!@/../config/parameters.yml';

// TODO generate computed fns from parameters keys

const Config = new Vue({
  computed: {
    host: () => (localStorage.getItem('host') || parameters.host).replace(/\/$/, ''),
    endpoint: () => ((localStorage.getItem('endpoint') || parameters.endpoint) || '').replace(/\/$/, '').concat('/'),
  },
  methods: {
    all: () => parameters,
    // TODO handle dot notation for get/set
    get: (key, fallback) => parameters[key] || fallback,
    set: (key, value) => {
      parameters[key] = value;
    },
  },
});

Vue.set(Vue.prototype, '$config', Config);

export default Config;
