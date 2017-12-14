import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import App from '@triotech/vue-core/src/lib/core/app';
import Config from '@triotech/vue-core/src/lib/helper/config';

Raven.addPlugin(RavenVue, Vue).install();

const Watchdog = () => {};

Watchdog.watch = (config) => {
  Raven.config(Config.get('sentry'));
  Raven.context(_.bind(App.run, App, config));
};

export default Watchdog;
