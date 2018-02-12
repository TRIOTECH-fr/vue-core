import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import App from '../core/app';
import Config from '../plugins/config';

Raven.addPlugin(RavenVue, Vue).install();

const Watchdog = () => {};

Watchdog.watch = (config) => {
  Raven.config(Config.get('sentry'));
  Raven.context(_.bind(App.run, App, config));
};

export default Watchdog;
