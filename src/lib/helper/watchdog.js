import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import Config from '../plugins/config';
import Package from '@/../package.json';

Raven.addPlugin(RavenVue, Vue).install();

const Watchdog = new Vue({
  computed: {
    mattermostURL() {
      return this.$config.get('watchdog.mattermost.url');
    },
    mattermostToken() {
      return this.$config.get('watchdog.mattermost.token');
    },
    mattermostChannel() {
      return this.$config.get('watchdog.mattermost.channel');
    },
  },
  methods: {
    watch(config, app) {
      Raven.config(Config.get('sentry'));
      Raven.context(this._.bind(app.run, app, config));
    },
    mattermost(config = {}) {
      if (this.$env.prod) {
        const matchAuthor = author => `@${this._.get(author.match(/^(\w+) <([^@]+@\w+\.[^>]+)>$/), '[1]', '')}`;
        const packageContributors = this._.get(Package, 'contributors', []).map(matchAuthor).join(', ');
        const packageAuthor = matchAuthor(this._.get(Package, 'author', ''));
        const mentions = '@' || packageContributors || packageAuthor;
        const text = `${Package.name} (${mentions})`;

        Vue.config.errorHandler = this._.bind((err, vm, info) => {
          const url = this.mattermostURL || config.url;
          if (url && String(err).indexOf('vuex') === -1) {
            const token = this.mattermostToken || config.token;
            const channel = this.mattermostChannel || config.channel || 'monolog';
            const attachments = [{
              title_link: window.location.href,
              fields: [{
                title: 'Message',
                value: `${err.message} : ${info}`,
              }, {
                title: 'URL',
                value: window.location.href,
                short: true,
              }, {
                title: 'Trace',
                value: err.stack,
              }],
            }];
            const payload = {
              username: 'VueCore',
              icon_url: 'https://vuejs.org/images/logo.png',
              channel,
              text,
              attachments,
            };
            this.$ajax.post(`${url}/hooks/${token}`, `payload=${JSON.stringify(payload)}`);
          }
        }, this);
      }
    },
  },
});

Vue.set(Vue.prototype, '$watchdog', Watchdog);

export default Watchdog;
