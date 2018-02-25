import Vue from 'vue';
import VueCordova from 'vue-cordova';

Vue.use(VueCordova);

window.onerror = (errorMsg, url, lineNumber) => {
  window.alert(`Error: ${errorMsg} Script: ${url} Line: ${lineNumber}`);
};
