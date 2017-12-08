import Vue from 'vue';
/* eslint-disable import/no-webpack-loader-syntax */
import parameters from 'json-loader!yaml-loader!@/../config/parameters.yml';

// TODO generate computed fns from parameters keys

const Config = new Vue({
  computed: {
    parameters: () => parameters,
    host: () => (localStorage.getItem('host') || parameters.host).replace(/\/$/, '').concat('/'),
  },
  methods: {
    parameter: key => '' || parameters[key],
  },
});

export default Config;
