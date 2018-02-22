import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import App from '@/App';
import I18n from '../plugins/i18n';
import Router from '../plugins/router';
import Store from '../plugins/store';
import autoload from './autoload';

Vue.config.performance = true;
Vue.config.productionTip = false;

Vue.mixin({
  // https://github.com/declandewet/vue-meta
  metaInfo() {
    const { name } = this.$options;
    let metaInfo = {};
    const regex = new RegExp(/(index|show|edit|delete)?page$/i);
    if (name && name.match(regex)) {
      const page = this.$voca(name.replace(regex, '')).snakeCase().lowerCase().value();
      metaInfo = {
        title: this.$t(`pages.${page}.meta.title`),
        meta: [{
          name: 'description',
          content: this.$t(`pages.${page}.meta.description`),
        }],
      };
    }
    return metaInfo;
  },
  methods: {
    ...mapActions(['set', 'add', 'unset', 'reset']),
    ...mapGetters(['get', 'oauth', 'user']),
    // TODO remove
    ...mapActions(['setKeyValueAction', 'addKeyValueAction']),
    log: window.console.log,
  },
});

autoload(require.context('@triotech/vue-core/src/lib/plugins', false, /\.js$/));

export default new Vue({
  methods: {
    run(options = {}) {
      const app = new Vue({
        el: '#app',
        i18n: I18n,
        router: Router,
        store: Store,
        render: h => h(App),
        ...options,
      });
      window.app = app;
      return app;
    },
  },
});
