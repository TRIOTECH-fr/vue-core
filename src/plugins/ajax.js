import Vue from 'vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import AjaxMixin from '../mixins/plugins/ajax';

Vue.use(VueAxios, Axios);

const Ajax = new Vue({
  mixins: [
    AjaxMixin,
  ],
  created() {
    if (this.$env.prod) {
      this.$http.defaults.timeout = 10000;
    }
  },
});

Vue.set(Vue.prototype, '$ajax', Ajax);

export default Ajax;
