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
    this.datePicker_model = this.schema.default;
  },
  watch: {
    datePicker_model(newValue, OldValue) {
      if (this.format(newValue) !== this.format(OldValue)) {
        this.setModelValueByPath(this.schema.model, this.format(newValue));
      }
    },
  },
  methods: {
    format(date) {
      return this.$moment(date).format('DD-MM-YY');
    },
  },
  computed: {
    value: {
      get() {
        return this.format(this.datePicker_model);
      },
      set(newValue) {
        // TODO converte and set value ! this.datePucker_model = newValue;
        throw new function (value) {
          this.name = 'Todo value set';
          this.message = `TODO : ${value}`;
        }(newValue);
      },
    },
  },
});
