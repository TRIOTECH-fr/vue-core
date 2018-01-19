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
    data() {
      return {
        fallback_id: null,
      };
    },
    props: {
      id: {
        type: Number,
        default: null,
      },
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
        type: String,
        default: null,
      },
      closeModal: {
        type: Boolean,
        default: false,
      },
      refModal: {
        type: String,
        default: null,
      },
    },
    async mounted() {
      if (this.loadOnMount) {
        this.load();
      }

      if (!this.loadOnMount && this.refModal !== null) {
        this.$bus.$on(`t-event-t-modal-${this.refModal}-open`, this.load);
      }
    },
    beforeDestroy() {
      if (!this.loadOnMount && this.refModal !== null) {
        this.$off(`t-event-t-modal-${this.refModal}-open`);
      }
    },
    computed: {
      getUri() {
        return this.uri || this.name;
      },
      getId() {
        return this.id || this.fallback_id;
      },
    },
    methods: {
      async load(dataEvent) {
        if (_.isNull(this.id) && _.isNull(dataEvent)) {
          throw String('No entity.id know');
        }

        if (!_.isNull(dataEvent)) {
          this.fallback_id = dataEvent.id;
        }
        await Ajax.get(`${this.getUri}/${this.getId}/delete`)
          .then((data) => {
            console.log(data);
            // this.schema.fields = this.schema.fields.concat(_.form(this.$t, data));
          });
      },
      async submit() {
        await Ajax.delete(`${this.getUri}/${this.getId}/delete`, this.getId)
          .then((data) => {
            if (data.status) {
              this.$notify({
                title: this.$t(`flashes.${this.name}.delete_title`),
                text: this.$t(`flashes.${this.name}.delete`),
                type: 'success',
              });
            } else {
              this.$notify({
                title: this.$t(`flashes.${this.name}.delete_title`),
                text: this.$t(`flashes.${this.name}.not_delete`),
                type: 'error',
              });
            }
            if (this.refreshAjaxIndex) {
              this.$bus.$emit(`t-event-ajax-index-${this.refAjaxIndex}-refresh`);
            }
          }, (errors) => {
            if (errors.response.status === 400) {
              this.$notify({
                title: this.$t(`flashes.${this.name}.request_error_title`),
                text: errors.response.data.errors.errors[0],
                type: 'warning',
              });
            }
          })
        ;
        if (this.closeModal) {
          this.$bus.$emit(`t-event-t-modal-${this.refModal}-close`);
        }
        return false;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>

