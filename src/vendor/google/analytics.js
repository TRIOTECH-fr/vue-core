import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Router from '../../lib/plugins/router';
import Config from '../../lib/plugins/config';

Vue.use(VueAnalytics, {
  id: Config.get('google_analytics'),
  router: Router,
});

export default VueAnalytics;
