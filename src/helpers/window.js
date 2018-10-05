import Vue from 'vue';

const Window = new Vue({
  created() {
    window.addEventListener('message', this.onMessage);
    window.addEventListener('load', this.onLoad);
    window.addEventListener('unload', this.onUnload);
  },
  methods: {
    scrollY: () => window.pageYOffset || (document.documentElement || document.body).scrollTop,
    maxScrollY: () => document.body.scrollHeight - window.innerHeight,
    onMessage(event) {
      if (this._.isString(event.data) && event.data.indexOf('webpackHotUpdate') === 0) {
        // eslint-disable-next-line no-console
        console.clear();
      }
    },
    onLoad(/* event */) {

    },
    onUnload(/* event */) {

    },
  },
});

export default Window;
