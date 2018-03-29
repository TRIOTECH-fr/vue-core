<template>
  <textarea
    v-model="textAreaModel"
    :placeholder="schema.placeholder"
    :required="schema.required"
    :rows="schema.rows"
    :hint="schema.hint"
    :max="schema.max"
    class="form-control"
  />
</template>

<script>
  import abstractField from './abstractField';

  export default {
    mixins: [
      abstractField,
    ],
    data() {
      return {
        textAreaModel: '',
      };
    },
    computed: {
      value() {
        return this.textAreaModel;
      },
    },
    watch: {
      model(newValue) {
        if (Object.keys(newValue).length < 1) {
          this.textAreaModel = null;
        }
      },
      textAreaModel(newValue) {
        this.textAreaModel = this._.isNull(newValue) ? '' : newValue;
        this.setModelValueByPath(this.schema.model, newValue);
      },
    },
    mounted() {
      this.textAreaModel = this.modelNameToProperty(this.schema.model, this.model);
    },
  };
</script>
