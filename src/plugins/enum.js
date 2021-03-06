import Vue from 'vue';
import I18n from '../plugins/i18n';

// TODO remove if providing unbound enum choices values in triotech/api-bundle

const Enum = new Vue({
  data() {
    return {
      enums: [],
    };
  },
  created() {
    if (this.$config.get('enum', false)) {
      this.$ajax.get('public/enum/').then((data) => {
        this.enums = data;
        this.$bus.$emit('enums', data);
      });
    }
  },
  methods: {
    trans(choice, className, domain = 'enums') {
      const key = this.key(choice, className);
      return key ? I18n.t(`${domain}.${key}`) : '';
    },
    key(choice, className) {
      const classObj = this._.find(this.enums, (item) => {
        const classNames = [item.class_name, item.fqcn];
        return classNames.indexOf(className) !== -1;
      });
      return classObj && classObj.choices[choice];
    },
  },
});

Vue.set(Vue.prototype, '$enum', Enum);

export default Enum;
