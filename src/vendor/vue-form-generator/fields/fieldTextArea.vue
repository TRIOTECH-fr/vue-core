<template>
  <textarea
    class="form-control"
    v-model="value"
    :id="getFieldID(schema)"
    :class="schema.fieldClasses"
    :disabled="disabled"
    :maxlength="schema.max"
    :minlength="schema.min"
    :placeholder="schema.placeholder"
    :readonly="schema.readonly"
    :rows="schema.rows || 2"
    :name="schema.inputName"
    :required="schema.required"
    :hint="schema.hint"
    :max="schema.max"
  />
</template>

<script>
  import VueFormGenerator from 'vue-form-generator';

  export default {
    ...VueFormGenerator.component.components.fieldTextArea,
  };
</script>
