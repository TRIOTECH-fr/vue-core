<template>
  <div>
    <form @submit.prevent="submit">
      <template v-if="this.schema.fields.length > 0">
        <vue-form-generator :schema="schema" :model="model" :options="{ validationAfterLoad: true, validationAfterChanged: true }" />
        <b-row>
          <b-col>
            <b-button block type="submit" variant="primary">{{ $t('actions.edit') }}</b-button>
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
    name: 'AjaxEditComponent',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    data() {
      return {
        model_back: {},
        model: {},
        schema: {
          fields: [],
        },
      };
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
        await Ajax.get(`${this.getUri}/${this.id}/edit`)
          .then((data) => {
            this.schema.fields = this.schema.fields.concat(_.form(this.$t, data.form));
            this.model = data.entity;
            this.model_back = JSON.parse(JSON.stringify(this.model));
          })
        ;
      },
      async submit() {
        const submitData = Ajax.difference(this.model, this.model_back);
        if (!_.isEmpty(submitData)) {
          await Ajax.patch(`${this.getUri}/${this.id}/edit`, submitData)
            .then((data) => {
              if (data.status) {
                this.$notify({
                  title: this.$t(`flashes.${name}.edit_title`),
                  text: this.$t(`flashes.${name}.edit`),
                  type: 'success',
                });
              } else {
                this.$notify({
                  title: this.$t(`flashes.${name}.edit_title`),
                  text: this.$t(`flashes.${name}.not_edit`),
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
        }
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

