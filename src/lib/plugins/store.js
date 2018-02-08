import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';
import VuexCache from 'vuex-cache';
import VuexSharedMutations from 'vuex-shared-mutations';
// eslint-disable-next-line no-unused-vars
import { sync } from 'vuex-router-sync';

Vue.use(Vuex);

const Store = new Vuex.Store({
  state: {
    filters: {},
  },
  getters: {
    get: state => state,
    oauth: state => state.oauth,
    user: state => state.oauth && state.oauth.user,
  },
  mutations: {
    set(state, data) {
      _.each(data, (value, key) => {
        if (state[key]) {
          state[key] = Object.assign({}, value);
        } else {
          Vue.set(state, key, value);
        }
      });
    },
    add(state, data) {
      _.each(data, (value, key) => {
        const index = state[key].length - 1;
        state[key].splice(index, 1, value);
      });
    },
    unset(state, data) {
      _.each(_.isArray(data) ? data : [data], key => delete state[key]);
    },
    setKeyValue(state, data) {
      Vue.set(state, data.key, data.value);
    },
    addKeyValue(state, data) {
      const array = state[data.key];
      Vue.set(array, array.length - 1, data.value);
    },
    updateFilter(state, filter) {
      const name = filter && filter.name;
      if (filter.value) {
        state.filters[name].value = filter;
      } else {
        state.filters[name] = {};
      }
    },
    shareState() {
      // TODO
    },
  },
  actions: {
    set({ commit }, data) {
      commit('set', data);
    },
    add({ commit }, data) {
      commit('add', data);
    },
    unset({ commit }, data) {
      commit('unset', data);
    },
    reset({ commit }) {
      commit('unset', _.keys(this.state));
    },
    setKeyValueAction({ commit }, data) {
      // eslint-disable-next-line no-console
      console.warn('deprecated: use this.set(data) instead');
      commit('setKeyValue', data);
    },
    addKeyValueAction({ commit }, data) {
      // eslint-disable-next-line no-console
      console.warn('deprecated: use this.add(data) instead');
      commit('addKeyValue', data);
    },
    updateFilterAction({ commit }, filter) {
      commit('updateFilter', filter);
    },
  },
  plugins: [
    VuexPersistedState(),
    VuexCache,
    VuexSharedMutations({ predicate: ['shareState'] }),
    // (() => {
    //  this.unsync = sync(this._vm.$store, this._vm.$router);
    // })(),
  ],
});

Vue.set(Vue.prototype, '$store', Store);

export default Store;
