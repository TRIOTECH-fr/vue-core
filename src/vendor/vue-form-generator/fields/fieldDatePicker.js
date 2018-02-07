import Vue from 'vue';
import DatePicker from 'vuejs-datepicker';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldDatePicker', {
  template: '<date-picker :placeholder="schema.placeholder" :required="schema.required" :language="language" v-model="datePickerModel" input-class="form-control"></date-picker>',
  components: {
    DatePicker,
  },
  data() {
    return {
      datePickerModel: '',
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
    if (this.schema.required) {
      this.$el.children[0].children[0].removeAttribute('readonly');
    }
    if (!_.isNull(initialValue)) {
      this.datePickerModel = this.$moment(initialValue).format('YYYY-MM-DD');
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
    model(newValue) {
      if (Object.keys(newValue).length < 1) {
        this.datePickerModel = '';
      }
    },
    datePickerModel(newValue, oldValue) {
      const formatted = this.format(newValue);
      if (formatted !== this.format(oldValue)) {
        this.setModelValueByPath(this.schema.model, formatted);
      }
    },
  },
  computed: {
    value() {
      return this.format(this.datePickerModel);
    },
  },
});
