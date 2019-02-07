<template>
  <div :class="schema.listClasses" :disabled="disabled" class="radio-list">
    <label v-for="(item, idx) in items" :key="idx" :class="{'is-checked': isItemChecked(item)}">
      <input
        v-attributes="'input'"
        :id="getFieldID(schema)"
        :disabled="isItemDisabled(item)"
        :name="id"
        :value="getItemValue(item)"
        :checked="isItemChecked(item)"
        :class="schema.fieldClasses"
        :required="schema.required"
        type="radio"
        @click="onSelection(item)"
      >
      <span>{{ getItemName(item) }}</span>
    </label>
  </div>
</template>

<script>
  import VueFormGenerator from 'vue-form-generator';

  export default {
    ...VueFormGenerator.component.components.formGroup.components.fieldRadios,
  };
</script>
