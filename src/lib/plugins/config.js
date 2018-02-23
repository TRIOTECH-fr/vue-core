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
    // TODO handle dot notation
    get: (key, fallback) => parameters[key] || fallback,
    all: () => parameters,
  },
});

Vue.set(Vue.prototype, '$config', Config);

export default Config;
