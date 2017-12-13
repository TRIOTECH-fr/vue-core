import Vue from 'vue';

const navigationMap = {
  0: 'Empty',
  1: 'Refresh',
  2: 'Back',
};

const NAVIGATION_EMPTY = 0;
const NAVIGATION_REFRESH = 1;
const NAVIGATION_BACK = 2;

const StorageClearer = new Vue({
  beforeCreate() {
    const perf = window.performance;
    if (perf && navigationMap[perf.navigation.type] !== 'Refresh') {
      console.warn(`Cleared Storage (${navigationMap[perf.navigation.type]})`);
      localStorage.clear();
    }
  },
});

export default StorageClearer;
