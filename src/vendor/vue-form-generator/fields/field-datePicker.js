import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldDatePicker', {
  template: '<datepicker :placeholder="schema.placeholder" v-model="datePicker_model"></datepicker>',
  components: {
    Datepicker,
  },
  data() {
    return {
      datePicker_model: '',
    };
  },
  mixins: [VueFormGenerator.abstractField],
  mounted() {
    this.datePicker_model = this.modelNameToProperty(this.schema.model);
  },
  methods: {
    modelNameToProperty(modelName) {
      return modelName
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\./, '')
        .split('.')
        .map(x => _.snakeCase(x))
        .reduce((a, b) => (a && a.hasOwnProperty(b) ? a[b] : null), this.model);
    },
    format(date) {
      return this.$moment(date).format('DD-MM-YY');
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
