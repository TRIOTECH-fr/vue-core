<template>
  <div>
    <form :id="formId" @submit.prevent="submit">
      <b-row>
        <b-col>
          <b-button block type="submit" variant="danger">{{ $t('actions.delete') }}</b-button>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
  import AbstractForm from '../../mixins/AbstractForm';

  export default {
    name: 'AjaxDeleteComponent',
    mixins: [
      AbstractForm,
    ],
    props: {
      method: {
        type: String,
        default: 'delete',
      },
      path: {
        type: String,
        default: '/{:id}/delete',
      },
    },
    methods: {
      async load() {
        this.emit('loading');
        const fields = await this.form();
        this.schema.fields = this.handleFields(fields);
        this.$nextTick(this.emit.bind('loaded'));
      },
      async submit() {
        this.emit('submitting');
        await this.ajax();
        this.$nextTick(this.emit.bind('submitted'));
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>

