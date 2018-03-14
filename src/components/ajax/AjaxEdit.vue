<template>
  <div v-if="loading" class="text-center mb-3">
    <slot name="loader">
      <i class="ti ti-2x ti-spin ti-refresh"/>
    </slot>
  </div>
  <form v-else @submit.prevent="submit">
    <template v-if="schema.fields.length > 0">
      <vue-form-generator
        :schema="schema"
        :model="model"
        :options="{ validationAfterLoad: true, validationAfterChanged: true }"
        :class="formClass"
      />
      <b-row>
        <b-col>
          <b-button block type="submit" variant="primary">{{ $t('actions.save') }}</b-button>
        </b-col>
      </b-row>
    </template>
    <div v-else class="text-center">
      <i class="ti ti-2x ti-spin ti-refresh"/>
    </div>
  </form>
</template>

<script>
  import VueFormGenerator from '@triotech/vue-core/src/vendor/vue-form-generator';

  export default {
    name: 'AjaxEditComponent',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    props: {
      additionnalRoute: {
        type: String,
        default: null,
      },
      closeModal: {
        type: Boolean,
        default: false,
      },
      defaultModelValues: {
        type: Object,
        default: null,
      },
      fieldsFilterList: {
        type: Array,
        default: () => [],
      },
      fieldsFilerInverse: {
        type: Boolean,
        default: false,
      },
      formClass: {
        type: String,
        default: '',
      },
      id: {
        type: [Number, String],
        default: null,
      },
      loadOnMount: {
        type: Boolean,
        default: true,
      },
      name: {
        type: String,
        default: null,
      },
      refAjaxIndex: {
        type: String,
        default: null,
      },
      refModal: {
        type: String,
        default: null,
      },
      refreshAjaxIndex: {
        type: Boolean,
        default: false,
      },
      uri: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        loading: true,
        previousModel: {},
        model: {},
        schema: {
          fields: [],
        },
        fallbackId: null,
        editRoute: '',
      };
    },
    computed: {
      getUri() {
        return this.uri !== null ? this.uri : this.name;
      },
      getId() {
        return this.id || this.fallbackId;
      },
    },
    watch: {
      defaultModelValues: {
        deep: true,
        handler(newValue) {
          _.merge(this.model, newValue);
        },
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
        this.$off(`t-event.t-modal.${this.refModal}.open`);
      }
    },
    methods: {
      applyFilterOnSchema() {
        // todo appli with inverse option
        if (_.size(this.fieldsFilterList) > 0) {
          _.forEach(this.fieldsFilterList, (fieldFiltered) => {
            _.remove(this.schema.fields, s => s.model === fieldFiltered);
          });
        }
      },
      editRouteFunc() {
        this.editRoute = `${this.getUri}/${this.getId}/edit`;
        if (this.additionnalRoute) {
          this.editRoute = `${this.getUri}/${this.getId}/edit/${this.additionnalRoute}`;
        }

        return this.editRoute;
      },
      async load(dataEvent = null) {
        this.loading = true;
        if (_.isNull(this.id) && _.isNull(dataEvent)) {
          throw new Error('Entity identifier is unknown');
        }

        if (!_.isNull(dataEvent)) {
          if (_.isNaN(parseInt(dataEvent, 10))) {
            this.fallbackId = dataEvent.id;
          } else {
            this.fallbackId = dataEvent;
          }
        }
        this.$bus.$emit(`t-event.t-ajax-edit.${this.name}.loaded`);
        this.$set(this, 'model', {});

        await this.$ajax.get(this.editRouteFunc())
          .then((data) => {
            this.schema.fields = _.form(this.$t, data.form);
            this.applyFilterOnSchema();
            const modelTemp = this.defaultModelValues !== null ? this.defaultModelValues : {};
            this.$set(this, 'model', _.clearModelForForm(data.entity, data.form, modelTemp));
            this.updatePreviousModel();
            this.loading = false;
          });
      },
      updatePreviousModel() {
        this.previousModel = JSON.parse(JSON.stringify(this.model));
      },
      async submit() {
        const submitData = _.differenceObj(this.model, this.previousModel);
        if (!_.isEmpty(submitData)) {
          await this.$ajax.patch(this.editRouteFunc(), submitData)
            .then((data) => {
              if (data.status) {
                this.updatePreviousModel();
                this.$notify({
                  title: this.$t(`flashes.${this.name}.edit_title`),
                  text: this.$t(`flashes.${this.name}.edit`),
                  type: 'success',
                });
                if (this.closeModal) {
                  this.$bus.$emit(`t-event.t-modal.${this.refModal}.close`);
                }
                this.$bus.$emit(`t-event.edit-submit.${this.name}.success`);
              } else {
                this.$notify({
                  title: this.$t(`flashes.${this.name}.edit_title`),
                  text: this.$t(`flashes.${this.name}.not_edit`),
                  type: 'error',
                });
              }

              if (this.refreshAjaxIndex) {
                this.$bus.$emit(`t-event.ajax-index.${this.refAjaxIndex}.refresh`);
              }
            }, (data) => {
              if (data.response.data.code === 400) {
                const errors = _.reduce(data.response.data.errors.children, (carry, value, key) => {
                  if (value.errors) {
                    carry[key] = value.errors;
                  }
                  return carry;
                }, {});

                let flashTitle = '';
                let flashText = '';

                _.each(errors, (errorFields, field) => {
                  flashTitle = this.$t(`flashes.${this.name}.error.${field}`);

                  _.each(errorFields, (error) => {
                    flashText = `${error} <br /> ${flashText}`;
                  });
                });

                this.$notify({
                  title: flashTitle,
                  text: flashText,
                  type: 'warning',
                });
              }
            });
        }
        return false;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>

