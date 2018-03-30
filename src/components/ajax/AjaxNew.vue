<template>
  <ajax-upsert
    :is-loading="isLoading"
    :schema="schema"
    :model="model"
    :form-class="formClass"
    :form-id="formId"
    :form-key="formKey"
    @submit="submit"
  >
    <b-button
      slot="submit-button"
      :disabled="isSubmitButtonDisabled"
      block
      type="submit"
      variant="success"
    >
      {{ $t('actions.create') }}
    </b-button>
  </ajax-upsert>
</template>

<script>
  import AbstractForm from '../mixins/AbstractForm';
  import AjaxUpsert from './AjaxUpsert';

  export default {
    name: 'AjaxNewComponent',
    components: {
      AjaxUpsert,
    },
    mixins: [
      AbstractForm,
    ],
    props: {
      method: {
        type: String,
        default: 'post',
      },
      path: {
        type: String,
        default: '/new',
      },
    },
    methods: {
      async load() {
        this.emit('loading');
        const fields = await this.form();
        this.schema.fields = this.handleFields(fields);
        this.$nextTick(this.emit.bind(this, 'loaded'));
      },
      async submit(model) {
        if (!this._.isEvent(model)) {
          this._.extend(this.model, model);
        }

        // TODO https://monterail.github.io/vuelidate/
        this.emit('submitting');
        await this.ajax();
        this.$nextTick(this.emit.bind(this, 'submitted'));
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
