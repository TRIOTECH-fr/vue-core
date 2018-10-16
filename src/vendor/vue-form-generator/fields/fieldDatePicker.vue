<template>
  <date-picker
    v-model="datePickerModel"
    v-attributes="'input'"
    :placeholder="schema.placeholder"
    :required="schema.required"
    :language="languages[language]"
    :disabled-dates="schema.disabledDates"
    :highlighted="schema.highlighted"
    input-class="form-control"
  />
</template>

<script>
  import DatePicker from 'vuejs-datepicker';
  import * as languages from "vuejs-datepicker/src/locale";
  import abstractField from './abstractField';

  export default {
    components: {
      DatePicker,
    },
    mixins: [
      abstractField,
    ],
    props: {
      language: {
        type: String,
        default: 'fr',
      },
      disabledDates: {
        type: Object,
        default: () => ({
          // to: null, /* Disable all dates up to specific date */
          // from: null, /* Disable all dates after specific date */
          // days: [], /* Disable an array of days */
          // daysOfMonth: [], /* Disable an array of daysOfMonth */
          // dates: [], /* Disable an array of dates */
          // ranges: [{ /* Disable dates in exclusive given ranges */
          //  from: null,
          //  to: null
          // }],
          // customPredictor: (date) => {}, /* Custom function that returns if date is disabled */
        }),
      },
      highlighted: {
        type: Object,
        default: () => ({
          // to: null, /* Highlight all dates up to specific date */
          // from: null, /* Highlight all dates after specific date */
          // days: [], /* Highlight an array of days */
          // daysOfMonth: [], /* Highlight an array of daysOfMonth */
          // dates: [], /* Highlight an array of dates */
          // customPredictor: (date) => {}, /* Custom function that returns if date is highlighted */
          // includeDisabled: false /* Highlight disabled dates */
        }),
      },
    },
    data() {
      return {
        languages,
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
        const formatted = this.format(newValue);
        if (formatted !== this.format(oldValue)) {
          this.setModelValueByPath(this.schema.model, formatted);
        }
      },
    },
    mounted() {
      const initialValue = this.modelNameToProperty(this.schema.model, this.model);
      if (this.schema.required) {
        this.$el.children[0].children[0].removeAttribute('readonly');
      }
      if (!this._.isNull(initialValue)) {
        this.datePickerModel = this.format(initialValue);
      }
    },
    methods: {
      format(date) {
        return this.$moment(date).format('YYYY-MM-DD');
      },
    },
  };
</script>
