import Vue from 'vue';
import VueI18n from 'vue-i18n';
import _ from 'lodash';
import env from './env';
import autoload from '../core/autoload';

Vue.use(VueI18n);

const I18n = new VueI18n({
  locale: 'fr',
  messages: _.merge(
    autoload(require.context('json-loader!yaml-loader!../../translations', false, /\.yml$/)),
    autoload(require.context('json-loader!yaml-loader!@/translations', false, /\.yml$/)),
  ),
  silentTranslationWarn: env.prod,
});

// TODO remove translation doesn't exist alert
// https://github.com/kazupon/vue-i18n/issues/96

// TODO replace vue-i18n with vuex-i18n (https://github.com/dkfbasel/vuex-i18n)
// import VueI18n from 'vuex-i18n';
// import Store from '@/lib/core/Store';
// Vue.use(VueXI18n.plugin, Store, {
//   onTranslationNotFound: (locale, key) => {
//     console.warn(`i18nx :: Key '${key}' not found for locale '${locale}'`);
//   },
// });
// Vue.i18n.add('fr', fr_FR)

export default I18n;
