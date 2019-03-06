import Vue from 'vue';
import VueGtm from 'vue-gtm';
import Router from '../plugins/router';
import Config from '../plugins/config';
import Env from '../plugins/env';

const dnt = ['1', 'yes'].indexOf(navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack) !== -1;

Vue.use(VueGtm, {
  id: Config.get('gtm.id'),
  enabled: Config.get('gtm.enabled', localStorage.getItem('cookie:accepted') === 'true' && !dnt),
  debug: Env.dev,
  vueRouter: Router,
});

Vue.prototype.$gtm.dnt = dnt;

export default VueGtm;
