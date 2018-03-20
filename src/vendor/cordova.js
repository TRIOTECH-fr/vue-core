import Vue from 'vue';
import VueCordova from 'vue-cordova';

Vue.use(VueCordova);

window.onerror = (errorMsg, url, lineNumber) => {
// eslint-disable-next-line no-alert
  window.alert(`Error: ${errorMsg} Script: ${url} Line: ${lineNumber}`);
};
