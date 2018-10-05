import Vue from 'vue';
import VueI18n from 'vue-i18n';
import _ from 'lodash';
import Env from './env';
import Autoload from '../helpers/autoload';

Vue.use(VueI18n);

const I18n = new VueI18n({
  locale: 'fr',
  messages: _.merge(
    Autoload(require.context('json-loader!yaml-loader!../translations', false, /\.yml$/)),
    Autoload(require.context('json-loader!yaml-loader!@/translations', false, /\.yml$/)),
  ),
  silentTranslationWarn: Env.prod,
});

// TODO remove translation doesn't exist alert
// https://github.com/kazupon/vue-i18n/issues/96

// TODO replace vue-i18n with vuex-i18n (https://github.com/dkfbasel/vuex-i18n)
// import VueI18n from 'vuex-i18n';
// import Store from './store';
// Vue.use(VueXI18n.plugin, Store, {
//   onTranslationNotFound: (locale, key) => {
//     console.warn(`i18nx :: Key '${key}' not found for locale '${locale}'`);
//   },
// });
// Vue.i18n.add('fr', fr_FR)

export default I18n;
