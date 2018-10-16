<template>
  <input
    v-model="value"
    v-attributes="'input'"
    :id="getFieldID(schema)"
    :autocomplete="schema.autocomplete"
    :disabled="disabled"
    :name="schema.inputName"
    :class="schema.fieldClasses"
    :required="schema.required"
    type="checkbox"
  />
</template>

<script>
  import VueFormGenerator from 'vue-form-generator';

  export default {
    ...VueFormGenerator.component.components.formGroup.components.fieldCheckbox,
  };
</script>
