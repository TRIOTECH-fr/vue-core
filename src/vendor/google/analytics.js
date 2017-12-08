import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Router from '../../lib/core/router';
import Config from '../../lib/helper/config';

Vue.use(VueAnalytics, { id: Config.parameter('google_analytics'), Router });

export default VueAnalytics;
