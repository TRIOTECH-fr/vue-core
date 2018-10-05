import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import Config from '../plugins/config';

Vue.use(VueSocketio, Config.get('socket_io_url'));
