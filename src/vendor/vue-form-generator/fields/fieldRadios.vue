<template>
  <div class="radio-list" :class="schema.listClasses" :disabled="disabled">
    <label v-for="item in items" :class="{'is-checked': isItemChecked(item)}">
      <input :id="getFieldID(schema)" type="radio" :disabled="disabled" :name="id" @click="onSelection(item)" :value="getItemValue(item)" :checked="isItemChecked(item)" :class="schema.fieldClasses" :required="schema.required" />
      <span>{{ getItemName(item) }}</span>
    </label>
  </div>
</template>

<script>
  import VueFormGenerator from 'vue-form-generator';

  export default {
    ...VueFormGenerator.component.components.fieldRadios,
  };
</script>
