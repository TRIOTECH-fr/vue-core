import Vue from 'vue';
import Hash from 'object-hash';

Vue.set(Vue.prototype, '$hash', Hash);

export default Hash;
