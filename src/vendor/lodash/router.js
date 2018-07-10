export default {
  queryPropsValidator(...args) {
    return this.propsValidator(...args, true);
  },
  propsValidator(component, route, addRouteQueryInParams = false) {
    let params = { ...route.params };
    if (addRouteQueryInParams) {
      params = _.merge(params, route.query);
    }

    return _.transform(params, (carry, prop, key) => {
      const props = _.reduce(component.mixins, (carry, mixin) => Object.assign(carry, mixin.props), component.props);
      if (!_.isArray(props[key].type) && !(prop instanceof props[key].type)) {
        carry[key] = props[key].type(prop);
      }
      return carry;
    }, params);
  },
};
