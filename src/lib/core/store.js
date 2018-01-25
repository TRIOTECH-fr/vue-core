import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';
import VuexCache from 'vuex-cache';
import VuexSharedMutations from 'vuex-shared-mutations';
/* eslint-disable no-unused-vars */
import { sync } from 'vuex-router-sync';
import Router from '@triotech/vue-core/src/lib/core/router';
import Config from '@triotech/vue-core/src/lib/core/config';

Vue.use(Vuex);

const Store = new Vuex.Store({
  state: {
    filters: {},
  },
  getters: {
    oauth: state => state.oauth,
  },
  mutations: {
    setKeyValue(state, data) {
      state[data.key] = data.value;
    },
    addKeyValue(state, data) {
      state[data.key].push(data.value);
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
        console.warn('setKeyValueAction needs a data object as argument');
      } else if (!_.isString(data.key)) {
        console.warn('setKeyValueAction data object needs a string key named "key"');
      } else if (_.isUndefined(data.value)) {
        console.warn('setKeyValueAction data object needs a defined key named "value"');
      } else if (data.commit === false) {
        this._mutations.setKeyValue[0](data);
      } else {
        commit('setKeyValue', data);
      }
    },
    addKeyValueAction({ commit }, data) {
      if (!_.isObject(data)) {
        console.warn('addKeyValueAction needs a data object as argument');
      } else if (!_.isString(data.key)) {
        console.warn('addKeyValueAction data object needs a string key named "key"');
      } else if (_.isUndefined(data.value)) {
        console.warn('addKeyValueAction data object needs a defined key named "value"');
      } else if (data.commit === false) {
        this._mutations.addKeyValue[0](data);
      } else {
        commit('addKeyValue', data);
      }
    },
    updateFilterAction({ commit }, filter) {
      if (!_.isObject(filter)) {
        console.warn('updateFilterAction needs a filter object as argument');
      } else if (!_.isString(filter.name)) {
        console.warn('updateFilterAction filter object needs a string key named "name"');
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
