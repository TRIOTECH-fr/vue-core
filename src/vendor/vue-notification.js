import Vue from 'vue';
import VueNotifications from 'vue-notification';
import VelocityAnimate from 'velocity-animate';

Vue.use(VueNotifications, { velocity: VelocityAnimate });

export default VueNotifications;
