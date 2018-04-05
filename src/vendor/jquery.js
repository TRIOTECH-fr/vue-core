import Vue from 'vue';
import jQuery from 'jquery';

Vue.set(Vue.prototype, '$', jQuery);

export default window.$ = jQuery;
