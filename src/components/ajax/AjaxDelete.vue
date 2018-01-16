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
        default: null,
      },
      uri: {
        type: String,
        default: null,
      },
      loadOnMount: {
        type: Boolean,
        default: true,
      },
      refreshAjaxIndex: {
        type: Boolean,
        default: false,
      },
      refAjaxIndex: {
        type: Object,
        default: null,
      },
      closeModal: {
        type: Boolean,
        default: false,
      },
      refModal: {
        type: Object,
        default: null,
      },
    },
    async mounted() {
      if (this.loadOnMount) {
        this.load();
      }
    },
    computed: {
      getUri() {
        return this.uri || this.name;
      },
    },
    methods: {
      async load() {
        await Ajax.get(`${this.getUri}/${this.id}/delete`)
          .then((data) => {
            console.log(data);
            // this.schema.fields = this.schema.fields.concat(_.form(this.$t, data));
          });
      },
      async submit() {
        await Ajax.delete(`${this.getUri}/${this.id}/delete`, this.id)
          .then((data) => {
            if (data.status) {
              this.$notify({
                title: this.$t(`flashes.${name}.delete_title`),
                text: this.$t(`flashes.${name}.delete`),
                type: 'success',
              });
            } else {
              this.$notify({
                title: this.$t(`flashes.${name}.delete_title`),
                text: this.$t(`flashes.${name}.not_delete`),
                type: 'error',
              });
            }
            if (this.refreshAjaxIndex) {
              this.refAjaxIndex.refresh();
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
        if (this.closeModal) {
          this.refModal.close();
        }
        return false;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>

