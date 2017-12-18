import Vue from 'vue';
import VueRouter from 'vue-router';
import Config from '@triotech/vue-core/src/lib/core/config';
import routes from '@/../config/routing';
import _ from '@triotech/vue-core/src/vendor/lodash';

Vue.use(VueRouter);

const Router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    let scroll = { x: 0, y: 0 };
    if (to.hash) {
      scroll = { selector: to.hash };
    } else if (savedPosition) {
      scroll = savedPosition;
    }
    return scroll;
  },
});

// https://router.vuejs.org/en/advanced/navigation-guards.html

Router.beforeEach((to, from, next) => {
  const vm = this.a.app;
  _.each(Config.get('firewall'), (data, path) => {
    const state = _.isObject(data) ? data.state : data;
    const redirect = _.isObject(data) ? data.redirect : '/';
    if (to.path.match(path) && !vm.$store.state[state]) {
      vm.$router.push(redirect);
    }
  });
  next();
});

Router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next('/404');
  } else {
    next();
  }
});

export default Router;
