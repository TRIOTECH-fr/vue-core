<template>
  <div v-if="isLoading" class="text-center mb-3">
    <slot name="loader">
      <i class="ti ti-2x ti-spin ti-refresh"/>
    </slot>
  </div>
  <form v-else :id="formId" @submit.prevent="$emit('submit')">
    <template v-if="schema.fields.length > 0">
      <vue-form-generator
        :schema="schema"
        :model="model"
        :options="{ validationAfterLoad: true, validationAfterChanged: true }"
        :class="formClass"
        :key="formKey"
      />
      <slot name="submit-button-start" />
      <b-row>
        <b-col>
          <slot name="submit-button">
            <b-button
              block
              type="submit"
              variant="success"
            >
              {{ $t('actions.submit') }}
            </b-button>
          </slot>
        </b-col>
      </b-row>
      <slot name="submit-button-end" />
    </template>
    <div v-else class="text-center">
      <i class="ti ti-2x ti-spin ti-refresh"/>
    </div>
  </form>
</template>

<script>
  import VueFormGenerator from 'vue-form-generator';

  export default {
    name: 'AjaxUpsertComponent',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false,
      },
      schema: {
        type: Object,
        default: () => ({}),
      },
      model: {
        type: Object,
        default: () => ({}),
      },
      formClass: {
        type: String,
        default: '',
      },
      formId: {
        type: String,
        default: '',
      },
      formKey: {
        type: String,
        default: '',
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/scss/vars';
</style>
