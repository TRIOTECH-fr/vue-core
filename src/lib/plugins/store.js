import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';
import VuexCache from 'vuex-cache';
import VuexSharedMutations from 'vuex-shared-mutations';
// eslint-disable-next-line no-unused-vars
import { sync } from 'vuex-router-sync';
import Router from './router';

Vue.use(Vuex);

const Store = new Vuex.Store({
  state: {
    filters: {},
  },
  getters: {
    get: state => state,
    oauth: state => state.oauth,
    user: state => state.oauth && state.oauth.user,
    usurpator: state => state.oauthUsurpator && state.oauthUsurpator.user,
  },
  mutations: {
    set(state, data) {
      this._.each(data, (value, key) => {
        Vue.set(state, key, _.isObject(value) && !this._.isArray(value) ? Object.assign({}, value) : value);
      });
    },
    add(state, data) {
      this._.each(data, (value, key) => {
        const index = state[key].length - 1;
        state[key].splice(index, 1, value);
      });
    },
    unset(state, data) {
      this._.each(this._.isArray(data) ? data : [data], this._.Y(next => (carry, key) => {
        if (key.indexOf('.') !== -1) {
          const chunks = key.split('.');
          const index = chunks[0];
          if (carry[index]) {
            next(carry[index], chunks.slice(1).join('.'));
          }
        } else {
          Vue.delete(carry, key);
        }
      }).bind(this, state));
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
      commit('unset', this._.keys(this.state));
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

// eslint-disable-next-line no-unused-vars
const unsync = sync(Store, Router);

Vue.set(Vue.prototype, '$store', Store);

export default Store;
