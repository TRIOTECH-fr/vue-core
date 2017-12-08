import Vue from 'vue';

const StorageClearer = new Vue({
  beforeCreate() {
    const perf = window.performance;
    if (perf && ['Empty', 'Refresh', 'Back'].indexOf(perf.navigation.type) !== 1) {
      localStorage.clear();
    }
  },
});

export default StorageClearer;
