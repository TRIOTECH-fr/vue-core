import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';
import VuexCache from 'vuex-cache';
import VuexSharedMutations from 'vuex-shared-mutations';
/* eslint-disable no-unused-vars */
import { sync } from 'vuex-router-sync';
import Router from '@triotech/vue-core/src/lib/core/router';

Vue.use(Vuex);

// TODO multiselect prevents unselecting if state was reloaded
localStorage.removeItem('vuex');

const Store = new Vuex.Store({
  state: {
    filters: {},
  },
  mutations: {
    updateFilter(state, filter) {
      const name = filter && filter.name;
      if (name) {
        if (filter.value) {
          state.filters[name].value = filter;
        } else {
          state.filters[name] = {};
        }
      }
    },
    shareState() {
      // TODO
    },
  },
  actions: {
    updateFilterAction({ commit }, filter) {
      commit('updateFilter', filter);
    },
  },
  plugins: [
    VuexPersistedState(),
    VuexCache,
    VuexSharedMutations({ predicate: ['shareState'] }),
  ],
});

/* eslint-disable no-unused-vars */
// const unsync = sync(Store, Router);

export default Store;
