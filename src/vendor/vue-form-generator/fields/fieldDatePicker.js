import Vue from 'vue';
import DatePicker from 'vuejs-datepicker';
import Mixins from './mixins';

Vue.component('fieldDatePicker', {
  components: {
    DatePicker,
  },
  mixins: Mixins,
  props: {
    language: {
      type: String,
      default: 'fr',
    },
  },
  data() {
    return {
      datePickerModel: '',
    };
  },
  computed: {
    value() {
      return this.format(this.datePickerModel);
    },
  },
  watch: {
    model(newValue) {
      if (Object.keys(newValue).length < 1) {
        this.datePickerModel = '';
      }
    },
    datePickerModel(newValue, oldValue) {
      if (newValue !== '') {
        const formatted = this.format(newValue);
        if (formatted !== this.format(oldValue)) {
          this.setModelValueByPath(this.schema.model, formatted);
        }
      }
    },
  },
  mounted() {
    const initialValue = this.modelNameToProperty(this.schema.model, this.model);
    if (this.schema.required) {
      this.$el.children[0].children[0].removeAttribute('readonly');
    }
    if (!_.isNull(initialValue)) {
      this.datePickerModel = this.format(initialValue);
    }
  },
  methods: {
    format(date) {
      return this.$moment(date).format('YYYY-MM-DD');
    },
  },
  template: `
    <date-picker
      :placeholder="schema.placeholder"
      :required="schema.required"
      :language="$i18n.locale"
      v-model="datePickerModel"
      input-class="form-control"
    />
  `,
});
