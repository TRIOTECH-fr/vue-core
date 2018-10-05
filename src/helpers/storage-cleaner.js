import Vue from 'vue';

const navigationTypes = ['Empty', 'Refresh', 'Back'];

const StorageClearer = new Vue({
  beforeCreate() {
    const perf = window.performance;
    const type = perf && navigationTypes[perf.navigation.type];
    if (perf && type !== 'Refresh') {
      console.warn(`Cleared Storage (${type})`); // eslint-disable-line no-console
      localStorage.clear();
    }
  },
});

export default StorageClearer;
