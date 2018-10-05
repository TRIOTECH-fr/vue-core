import Vue from 'vue';
import {
  mapActions,
  mapGetters
} from 'vuex';
// eslint-disable-next-line
import App from '@/App';
import _ from '../plugins/_';
import I18n from '../plugins/i18n';
import Router from '../plugins/router';
import Store from '../plugins/store';
import Autoload from '../helpers/autoload';

Vue.config.performance = true;
Vue.config.productionTip = false;

Vue.mixin({
  metaInfo() {
    const {
      name
    } = this.$options;
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
    log: window.console.log,
  },
});

Autoload(require.context('../plugins', false, /\.js$/));

export default {
  el: '#app',
  i18n: I18n,
  router: Router,
  store: Store,
  render: h => h(App),
  mounted() {
    if (this._.get(window, 'app.constructor.name') === 'HTMLDivElement' && (this.$env.dev || window.cordova)) {
      window.app = this;
    }
  },
};
