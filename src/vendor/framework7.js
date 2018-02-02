import Vue from 'vue';
import Framework7 from 'framework7/dist/framework7.esm.bundle';
import Framework7Vue from 'framework7-vue/dist/framework7-vue.esm.bundle';

import 'framework7/dist/css/framework7.min.css';
import 'framework7-icons/css/framework7-icons.css';

Vue.use(Framework7Vue, Framework7);

const Framework7RouterFindMatchingRoute = Framework7.Router.prototype.findMatchingRoute;
Framework7.Router.prototype.findMatchingRoute = function findMatchingRoute(url, ...args) {
  const strippedUrl = window.cordova && url.indexOf('#') === 0 ? url.replace('#', '') : url;
  return Framework7RouterFindMatchingRoute.call(this, strippedUrl, ...args);
};

export default Framework7;
