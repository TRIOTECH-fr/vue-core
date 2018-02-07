import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import Config from '@triotech/vue-core/src/lib/plugins/config';

Vue.use(VueSocketio, Config.get('socket_io_url'));
