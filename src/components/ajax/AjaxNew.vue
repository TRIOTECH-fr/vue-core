<template>
  <div>
    <form @submit.prevent="submit">
      <template v-if="this.schema.fields.length > 0">
        <vue-form-generator :schema="schema" :model="model" :options="{ validationAfterLoad: true, validationAfterChanged: true }" />
        <b-row>
          <b-col>
            <b-button block type="submit" variant="success">{{ $t('actions.create') }}</b-button>
          </b-col>
        </b-row>
      </template>
      <div class="text-center" v-else>
        <i class="ti ti-2x ti-spin ti-refresh"></i>
      </div>
    </form>
  </div>
</template>

<script>
  import Ajax from '@triotech/vue-core/src/lib/http/ajax';
  import VueFormGenerator from '@triotech/vue-core/src/bind/vue-form-generator';

  export default {
    name: 'AjaxNewComponent',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    props: {
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
    data() {
      return {
        model: {},
        schema: {
          fields: [],
        },
      };
    },
    mounted() {
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
    },
    methods: {
      async load() {
        await Ajax.get(`${this.getUri}/new`)
          .then((data) => {
            this.schema.fields = _.form(this.$t, data);
            this.model = {};
          });
      },
      async submit() {
        await Ajax.post(`${this.getUri}/new`, this.model)
          .then((data) => {
            if (data.status) {
              this.$notify({
                title: this.$t(`flashes.${this.name}.create_title`),
                text: this.$t(`flashes.${this.name}.create`),
                type: 'success',
              });
            } else {
              this.$notify({
                title: this.$t(`flashes.${this.name}.create_title`),
                text: this.$t(`flashes.${this.name}.not_create`),
                type: 'error',
              });
            }
            if (this.refreshAjaxIndex) {
              this.$bus.$emit(`t-event-ajax-index-${this.refAjaxIndex}-refresh`);
            }
          }, () => {
            this.$notify({
              title: this.$t(`flashes.${this.name}.server_error_title`),
              text: this.$t(`flashes.${this.name}.server_error`),
              type: 'warning',
            });
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

