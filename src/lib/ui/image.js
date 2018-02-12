import Vue from 'vue';
import Config from '../plugins/config';

// TODO convert imgurl vue mixin into vue instance url/filter methods
Vue.mixin({
  methods: {
    imgurl(uri = '', filter = '') {
      if (uri && filter) {
        // eslint-disable-next-line no-param-reassign
        uri = `media/cache/resolve/${filter}/${uri.replace('uploads/', '').replace('/app_dev.php/', '')}`;
      }
      return uri ? Config.host.replace('/api', '').concat(uri) : '#';
    },
  },
});

const Image = new Vue({
  methods: {
    url() {

    },
    filter() {

    },
  },
});

export default Image;
