import Vue from 'vue';

const Env = new Vue({
  computed: {
    dev: () => process.env.NODE_ENV === 'development',
    prod: () => process.env.NODE_ENV === 'production',
  },
});

Vue.set(Vue.prototype, '$env', Env);

export default Env;
