import Vue from 'vue';
import VueRouter from 'vue-router';
import Config from '@triotech/vue-core/src/lib/core/config';
import routes from '@/../config/routing';
import _ from '@triotech/vue-core/src/vendor/lodash';

// TODO Fix import loader for : https://forum.vuejs.org/t/router-vue-props-type-number-didnt-cast/25774

Vue.use(VueRouter);

const vueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, a, b) {
  if (this.app.$f7) {
    const route = this.match(_.clone(location), this.history.current);
    if (route.path) {
      return this.app.$f7.router.navigate(route.fullPath, route);
    }
  }
  return vueRouterPush.call(this, location, a, b);
};

const Router = new VueRouter({
  mode: window.cordova ? 'hash' : 'history',
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

