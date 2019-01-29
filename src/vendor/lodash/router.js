export default {
  queryPropsValidator(...args) {
    return this.propsValidator(...args, true);
  },
  propsValidator(component, route, addRouteQueryInParams = false) {
    let params = { ...route.params };
    if (addRouteQueryInParams) {
      params = this.merge(params, route.query);
    }

    return this.transform(params, (carry, param, key) => {
      const props = this.reduce(component.mixins, (mixins, mixin) => Object.assign(mixins, mixin.props), component.props || {});
      const propKey = this.camelCase(key);
      const prop = props[propKey];
      const propType = prop.type;

      if (prop) {
        carry[propKey] = propType === Boolean ? /^(true|1)$/i.test(param) : propType(param);
      }
      return carry;
    });
  },
};
