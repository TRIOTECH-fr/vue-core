import Vue from 'vue';
import I18n from '@triotech/vue-core/src/lib/plugins/i18n';
import Router from '@triotech/vue-core/src/lib/plugins/router';
import Store from '@triotech/vue-core/src/lib/plugins/store';
import autoload from './autoload';
import App from '@/App';
import { mapActions } from 'vuex';

autoload(require.context('@triotech/vue-core/src/lib/plugins', false, /\.js$/));

Vue.config.performance = true;
Vue.config.productionTip = false;

Vue.mixin({
  // https://github.com/declandewet/vue-meta
  metaInfo() {
    const name = this.$options.name;
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
    ...mapActions(['setKeyValueAction', 'addKeyValueAction']),
  },
});

export default new Vue({
  methods: {
    run(options = {}) {
      return window.app = new Vue({
        el: '#app',
        i18n: I18n,
        router: Router,
        store: Store,
        render: h => h(App),
        ...options,
      });
    },
    get(key) {

    },
    set(key, value) {

    },
    add(array, value) {

    },
  },
});
