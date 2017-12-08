import Vue from 'vue';
import Api from '@triotech/vue-core/src/lib/http/api';
import I18n from '@triotech/vue-core/src/lib/core/i18n';

// TODO remove if providing unbound enum choices values in triotech/api-bundle

const Enum = new Vue({
  data() {
    return {
      enums: [],
    };
  },
  created() {
    Api
      .get('public/enum/').then((data) => {
        this.enums = data;
      })
    ;
  },
  methods: {
    trans(choice, className, domain = 'enums') {
      const key = this.key(choice, className);
      return key ? I18n.t(`${domain}.${key}`) : '';
    },
    key(choice, className) {
      const classObj = _.find(this.enums, (item) => {
        const classNames = [item.class_name, item.fqcn];
        return classNames.indexOf(className) !== -1;
      });
      return classObj && classObj.choices[choice];
    },
  },
});

export default Enum;
