<template>
  <div>
    <form @submit.prevent="submit">
      <b-row>
        <b-col>
          <b-button block type="submit" variant="danger">{{ $t('actions.delete') }}</b-button>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
  import Ajax from '@triotech/vue-core/src/lib/http/ajax';
  import VueFormGenerator from '@triotech/vue-core/src/bind/vue-form-generator';

  export default {
    name: 'AjaxDeleteComponent',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    props: {
      id: null,
      name: {
        type: String,
      },
      uri: {
        type: String,
      },
      ajaxTableRef: {
        type: Object,
        default: null,
      },
      refreshAjaxTable: {
        type: Boolean,
        default: false,
      },
    },
    async mounted() {
      await Ajax.get(`${this.uri}/${this.id}/delete`)
        .then((data) => {
          console.log(data);
          // this.schema.fields = this.schema.fields.concat(_.form(this.$t, data));
        })
      ;
    },
    methods: {
      async submit() {
        await Ajax.delete(`${this.uri}/${this.id}/delete`, this.id)
          .then((data) => {
            if (data.status) {
              this.$notify({
                title: this.$t(`flashes.${name}.delete_title`),
                text: this.$t(`flashes.${name}.delete`),
                type: 'success',
              });
              if (this.$parent.$refs.content.className === 'sweet-content') {
                this.$parent.close();
              }
            } else {
              this.$notify({
                title: this.$t(`flashes.${name}.delete_title`),
                text: this.$t(`flashes.${name}.not_delete`),
                type: 'error',
              });
            }

            if (this.refreshAjaxTable) {
              this.ajaxTableRef.refresh();
            }
          }, (errors) => {
            if (errors.response.status === 400) {
              this.$notify({
                title: this.$t(`flashes.${name}.request_error_title`),
                text: errors.response.data.errors.errors[0],
                type: 'warning',
              });
            }
          })
        ;
        // todo close modal ? or do something !
        return false;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>

