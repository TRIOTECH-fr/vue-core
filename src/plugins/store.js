import Vue from 'vue';
import Vuex from 'vuex';
import StoreMixin from '../mixins/plugins/store';

Vue.use(Vuex);

const Store = new Vuex.Store({
  ...StoreMixin,
});

Vue.set(Vue.prototype, '$store', Store);

export default Store;
