import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import Config from '../lib/plugins/config';

Vue.use(VueSocketio, Config.get('socket_io_url'));
