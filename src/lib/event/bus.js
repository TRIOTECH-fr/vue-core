import Vue from 'vue';

const EventBus = new Vue();

Vue.set(Vue.prototype, '$bus', EventBus);

export default EventBus;

