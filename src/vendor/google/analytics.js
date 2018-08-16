import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Router from '../../lib/plugins/router';
import Config from '../../lib/plugins/config';
import Env from '../../lib/plugins/env';

Vue.use(VueAnalytics, {
  id: Config.get('google_analytics'),
  router: Router,
  debug: {
    sendHitTask: Env.prod
  },
});

export default VueAnalytics;
