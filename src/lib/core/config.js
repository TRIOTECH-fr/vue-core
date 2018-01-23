import Vue from 'vue';
/* eslint-disable import/no-webpack-loader-syntax */
import parameters from 'json-loader!yaml-loader!@/../config/parameters.yml';

// TODO generate computed fns from parameters keys

const Config = new Vue({
  computed: {
    host: () => (localStorage.getItem('host') || parameters.host).replace(/\/$/, '').concat('/'),
  },
  methods: {
    // TODO handle dot notation
    get: key => '' || parameters[key],
    all: () => parameters,
  },
});

Vue.set(Vue.prototype, '$config', Config);

export default Config;
