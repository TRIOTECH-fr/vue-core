import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Router from '@triotech/vue-core/src/lib/plugins/router';
import Config from '@triotech/vue-core/src/lib/plugins/config';

Vue.use(VueAnalytics, { id: Config.get('google_analytics'), Router });

export default VueAnalytics;
