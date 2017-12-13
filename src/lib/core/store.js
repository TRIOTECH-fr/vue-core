import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';
import VuexCache from 'vuex-cache';
import VuexSharedMutations from 'vuex-shared-mutations';
/* eslint-disable no-unused-vars */
import { sync } from 'vuex-router-sync';
import Router from '@triotech/vue-core/src/lib/core/router';
import Config from '@triotech/vue-core/src/lib/helper/config';

Vue.use(Vuex);

const Store = new Vuex.Store({
  state: {
    filters: {},
  },
  mutations: {
    setKeyValue(state, data) {
      state[data.key] = data.value;
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
    setKeyValueAction({ commit }, data) {
      if (!_.isObject(data)) {
        return console.warn('setKeyValueAction needs a data object as argument');
      } else if (!data.key) {
        return console.warn('setKeyValueAction data object needs a key named "key"');
      } else if (!data.value) {
        return console.warn('setKeyValueAction data object needs a key named "value"');
      } else {
        commit('setKeyValue', data);
      }
    },
    updateFilterAction({ commit }, filter) {
      if (!_.isObject(filter)) {
        return console.warn('updateFilterAction needs a filter object as argument');
      } else if (!filter.name) {
        return console.warn('updateFilterAction filter object needs a key named "name"');
      } else {
        commit('updateFilter', filter);
      }
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
