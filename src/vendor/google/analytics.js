import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Router from '../../plugins/router';
import Config from '../../plugins/config';
import Env from '../../plugins/env';

Vue.use(VueAnalytics, {
  id: Config.get('google_analytics'),
  router: Router,
  debug: {
    sendHitTask: Env.prod
  },
});

export default VueAnalytics;
