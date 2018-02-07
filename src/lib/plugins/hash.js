import Vue from 'vue';
import ObjectHash from 'object-hash';

Vue.set(Vue.prototype, '$hash', ObjectHash);

export default ObjectHash;
