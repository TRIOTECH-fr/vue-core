export default {
  queryPropsValidator(...args) {
    return this.propsValidator(...args, true);
  },
  propsValidator(component, route, addRouteQueryInParams = false) {
    let params = { ...route.params };
    if (addRouteQueryInParams) {
      params = this.merge(params, route.query);
    }

    return this.transform(params, (carry, prop, key) => {
      const props = this.reduce(component.mixins, (mixins, mixin) => Object.assign(mixins, mixin.props), component.props || {});
      if (!this.isArray(props[key].type) && !(prop instanceof props[key].type)) {
        carry[key] = props[key].type(prop);
      }
      return carry;
    }, params);
  },
};
