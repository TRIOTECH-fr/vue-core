import Vue from '@triotech/vue-core/src/vendor/vue';

// https://github.com/guipn/sinful.js/blob/master/sinful.js
const Sinful = new Vue({
  computed: {
    radix: () => 10,
  },
  methods: {
    add(...args) {
      const cf = this.cf(args);
      return this._.reduce(args, (carry, value) => carry + value * cf, 0) / cf;
    },
    sub(...args) {
      const cf = this.cf(args);
      const first = args.shift();
      return this._.reduce(args, (carry, value) => carry - value * cf, first * cf) / cf;
    },
    mul(...args) {
      return this._.reduce(args, (carry, value) => {
        const cf = this.cf(carry, value);
        return (carry * cf) * (value * cf) / (cf * cf);
      }, 1);
    },
    div(...args) {
      return this._.reduce(args, (carry, value) => {
        const cf = this.cf(carry, value);
        return (carry * cf) / (value * cf);
      });
    },
    cf(...args) {
      return this._.reduce(args, (prev, next) => {
        const mp = this.m(prev);
        const mn = this.m(next);
        return mp > mn ? mp : mn;
      }, -Infinity);
    },
    m(number) {
      const chunks = String(number).split('.');
      return chunks.length <= 1 ? 1 : 10 ** chunks[1].length;
    },
  },
});

Vue.set(Vue.prototype, '$sinful', Sinful);

export default Sinful;
