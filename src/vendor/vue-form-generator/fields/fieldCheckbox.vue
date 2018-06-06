<template>
  <input
    :id="getFieldID(schema)"
    type="checkbox"
    v-model="value"
    :autocomplete="schema.autocomplete"
    :disabled="disabled"
    :name="schema.inputName"
    :class="schema.fieldClasses"
    :required="schema.required"
  />
</template>

<script>
  import VueFormGenerator from 'vue-form-generator';

  export default {
    ...VueFormGenerator.component.components.fieldCheckbox,
  };
</script>
