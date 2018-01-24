import Vue from 'vue';
import DatePicker from 'vuejs-datepicker';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldDatePicker', {
  template: '<date-picker :placeholder="schema.placeholder" :language="language" v-model="datePicker_model" input-class="form-control"></date-picker>',
  components: {
    DatePicker,
  },
  data() {
    return {
      datePicker_model: '',
    };
  },
  props: {
    language: {
      type: String,
      default: 'fr',
    },
  },
  mixins: [VueFormGenerator.abstractField],
  mounted() {
    const initialValue = this.modelNameToProperty(this.schema.model);
    if (!_.isNull(initialValue)) {
      this.datePicker_model = this.$moment(initialValue).format('YYYY-MM-DD');
    }
  },
  methods: {
    modelNameToProperty(modelName) {
      return modelName
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\./, '')
        .split('.')
        .map(x => _.snakeCase(x))
        .reduce((a, b) => (a && {}.hasOwnProperty.call(a, b) ? a[b] : null), this.model);
    },
    format(date) {
      return this.$moment(date).format('YYYY-MM-DD');
    },
  },
  watch: {
    datePicker_model(newValue, OldValue) {
      if (this.format(newValue) !== this.format(OldValue)) {
        this.setModelValueByPath(this.schema.model, this.format(newValue));
      }
    },
  },
  computed: {
    value: {
      get() {
        return this.format(this.datePicker_model);
      },
    },
  },
});
