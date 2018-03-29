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
      variant="primary"
    >
      {{ $t('actions.save') }}
    </b-button>
  </ajax-upsert>
</template>

<script>
  import AbstractAjax from './AbstractAjax';
  import AbstractForm from './AbstractForm';
  import AjaxUpsert from './AjaxUpsert';

  export default {
    name: 'AjaxEditComponent',
    components: {
      AjaxUpsert,
    },
    mixins: [
      AbstractAjax,
      AbstractForm,
    ],
    props: {
      method: {
        type: String,
        default: 'patch',
      },
      path: {
        type: String,
        default: '/{:id}/edit',
      },
    },
    data() {
      return {
        previousModel: {},
      };
    },
    methods: {
      async load() {
        this.emit('loading');
        const data = await this.form();
        this.schema.fields = this.handleFields(data.form);
        this.updateModel(data);
        this.$nextTick(this.emit.bind(this, 'loaded'));
      },
      async submit(model) {
        if (!this._.isEvent(model)) {
          this._.extend(this.model, model);
        }

        this.emit('submitting');
        await this.ajax(this.differenceObj(this.model, this.previousModel));
        this.$nextTick(this.emit.bind(this, 'submitted'));
      },
      updateModel(data) {
        // TODO remove hack
        if (data.entity && data.entity.file_name) {
          data.entity.file = data.entity.file_name;
        }

        this.$set(this, 'model', this.clearModelForForm(data.entity, data.form));

        this.previousModel = JSON.parse(JSON.stringify(this.model));
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
