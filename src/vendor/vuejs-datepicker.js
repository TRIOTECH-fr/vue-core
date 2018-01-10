import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';
import VueFormGenerator from 'vue-form-generator';

delete Datepicker.props.value;

Vue.component('fieldDatePicker', {
  ...Datepicker,
  mixins: [VueFormGenerator.abstractField],
  mounted() {
    this.$on('input', (date) => {
      this.value = this.$moment(date).format('DD-MM-YYYY');
    });
  },
});
