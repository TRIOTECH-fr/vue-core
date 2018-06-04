<template>
  <date-picker
    v-model="datePickerModel"
    :placeholder="schema.placeholder"
    :required="schema.required"
    :language="languages[language]"
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
