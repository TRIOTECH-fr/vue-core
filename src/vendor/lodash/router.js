import _ from 'lodash';

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
      const prop = props[_.camelCase(key)];
      if (prop && !this.isArray(prop.type) && !(param instanceof prop.type)) {
        carry[key] = prop.type(param);
      }
      return carry;
    }, params);
  },
};
