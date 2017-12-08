import Vue from 'vue';

const env = process.env.NODE_ENV;

const Env = new Vue({
  computed: {
    dev: () => env === 'development',
    prod: () => env === 'production',
  },
});

export default Env;
