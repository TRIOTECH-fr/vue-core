import Vue from 'vue';

const EventBus = new Vue({
  name: 'EventBus',
});

Vue.set(Vue.prototype, '$bus', EventBus);

export default EventBus;
