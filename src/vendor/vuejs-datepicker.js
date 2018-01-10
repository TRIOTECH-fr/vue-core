import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldDatePicker', {
  template: '<datepicker :placeholder="schema.placeholder" v-model="datePicker_model"></datepicker>',
  components: {
    Datepicker,
  },
  data: function() {
    return {
      datePicker_model: '',
    };
  },
  mixins: [VueFormGenerator.abstractField],
  mounted() {
    this.datePicker_model = this.schema.default;
  },
  computed: {
    value: {
      get: function() {
        return this.$moment(this.datePicker_model).format('DD-MM-YY')
      },
      set: function(newValue) {
        // TODO converte and set value ! this.datePucker_model = newValue;
      },
    },
  },
});
