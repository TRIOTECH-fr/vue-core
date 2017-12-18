import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import Config from '@triotech/vue-core/src/lib/core/config';

Vue.use(VueGoogleMaps, {
  load: (window.google && window.google.maps) || {
    key: Config.get('google_maps').api_key,
  },
});

export default VueGoogleMaps;
