import Vue from 'vue';
import VueAxios from 'vue-axios';
import Axios from 'axios';
import AjaxMixin from '../../mixins/plugins/ajax';

Vue.use(VueAxios, Axios);
Axios.defaults.timeout = 10000;

const Ajax = new Vue({
  mixins: [
    AjaxMixin,
  ],
});

Vue.set(Vue.prototype, '$ajax', Ajax);

export default Ajax;
