import Vue from 'vue';
import VuexPersistedState from 'vuex-persistedstate';
import VuexCache from 'vuex-cache';
import { sync } from 'vuex-router-sync';
import Router from '../../lib/plugins/router';

export default {
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
      const vm = this._vm; // eslint-disable-line no-underscore-dangle
      vm._.each(data, (value, key) => {
        Vue.set(state, key, vm._.isObject(value) && !vm._.isArray(value) ? Object.assign({}, value) : value);
      });
    },
    add(state, data) {
      const vm = this._vm; // eslint-disable-line no-underscore-dangle
      vm._.each(data, (value, key) => {
        const index = state[key].length - 1;
        state[key].splice(index, 1, value);
      });
    },
    unset(state, data) {
      const vm = this._vm; // eslint-disable-line no-underscore-dangle
      let keys = data;
      if (vm._.isUndefined(keys)) {
        keys = vm._.keys(this.state);
      } else if (!vm._.isArray(keys)) {
        keys = [keys];
      }
      vm._.each(keys, vm._.Y(next => (carry, key) => {
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
      commit('unset');
    },
  },
  plugins: [
    VuexPersistedState(),
    VuexCache,
    // VuexSharedMutations({ sharingKey: 'vuex', predicate: ['shareState'] }),
    (router => (store) => {
      store.unsync = sync(store, router);
    })(Router),
  ],
  strict: process.env.NODE_ENV !== 'production',
};
