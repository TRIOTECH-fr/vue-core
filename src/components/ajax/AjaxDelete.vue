<template>
  <div>
    <form :id="`form-delete-${name}`" @submit.prevent="submit">
      <b-row>
        <b-col>
          <b-button block type="submit" variant="danger">{{ $t('actions.delete') }}</b-button>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
  import VueFormGenerator from '@triotech/vue-core/src/vendor/vue-form-generator';

  export default {
    name: 'AjaxDeleteComponent',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    props: {
      id: {
        type: [Number, String],
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
        type: [String, Array],
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
      action: {
        type: String,
        default: 'delete',
      },
    },
    data() {
      return {
        uriOption: null,
      };
    },
    computed: {
      getUri() {
        // if uriOption have some option , construct the uri with it!
        let uri = this.uri || this.name;
        if (this.uriOption) {
          if (this.uriOption.suffix) {
            uri += this.uriOption.suffix;
          }
        }
        return uri;
      },
      getId() {
        return this.id || this.uriOption.id;
      },
    },
    async mounted() {
      if (this.loadOnMount) {
        this.load();
      }

      if (!this.loadOnMount && this.refModal !== null) {
        this.$bus.$on(`t-event.t-modal.${this.refModal}.open`, this.load);
      }
    },
    beforeDestroy() {
      if (!this.loadOnMount && this.refModal !== null) {
        this.$bus.$off(`t-event.t-modal.${this.refModal}.open`);
      }
    },
    methods: {
      async load(dataEvent = null) {
        // if data is passed with event, store data in uriOption
        if (dataEvent) {
          this.$set(this, 'uriOption', dataEvent);
        }

        if (_.isNull(this.id) && _.isNull(dataEvent) && _.isNull(dataEvent.id)) {
          throw new Error('Entity identifier is unknown');
        }

        this.$bus.$emit(`t-event.ajax-delete.${this.name}.loading`);

        // eslint-disable-next-line no-unused-vars
        const data = await this.$ajax.get(`${this.getUri}/${this.getId}/${this.action}`);
        // TODO handle isDeletable
        // this.schema.fields = this.schema.fields.concat(_.form(this.$t, data));

        this.$nextTick(() => {
          this.$bus.$emit(`t-event.ajax-delete.${this.name}.loaded`);
        });
      },
      async submit() {
        await this.$ajax.delete(`${this.getUri}/${this.getId}/${this.action}`, this.getId)
          .then((data) => {
            if (data.status) {
              this.$notify({
                title: this.$t(`flashes.${this.name}.delete_title`),
                text: this.$t(`flashes.${this.name}.delete`),
                type: 'success',
              });
              this.$bus.$emit(`t-event.ajax-delete.${this.name}.success`);
            } else {
              this.$notify({
                title: this.$t(`flashes.${this.name}.delete_title`),
                text: this.$t(`flashes.${this.name}.not_delete`),
                type: 'error',
              });
              this.$bus.$emit(`t-event.ajax-delete.${this.name}.error`);
            }

            if (this.refreshAjaxIndex) {
              if (this._.isArray(this.refAjaxIndex)) {
                this._.each(this.refAjaxIndex, (refAjaxIndex) => {
                  this.$bus.$emit(`t-event.ajax-index.${refAjaxIndex}.refresh`);
                });
              } else {
                this.$bus.$emit(`t-event.ajax-index.${this.refAjaxIndex}.refresh`);
              }
            }
          }, (errors) => {
            if (errors.response.status === 400) {
              this.$notify({
                title: this.$t(`flashes.${this.name}.request_error_title`),
                text: errors.response.data.errors.errors[0],
                type: 'warning',
              });
            }
          });
        if (this.closeModal) {
          this.$bus.$emit(`t-event.t-modal.${this.refModal}.close`);
        }
        return false;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>

