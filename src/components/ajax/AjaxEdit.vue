<template>
  <div v-if="loading" class="text-center mb-3">
    <slot name="loader">
      <i class="ti ti-2x ti-spin ti-refresh"/>
    </slot>
  </div>
  <form v-else :id="`form-edit-${name}`" @submit.prevent="submit">
    <template v-if="schema.fields.length > 0">
      <vue-form-generator
        :schema="schema"
        :model="model"
        :options="{ validationAfterLoad: true, validationAfterChanged: true }"
        :class="formClass"
        :key="formUniqueId"
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
      config: {
        type: Object,
        default: () => ({}),
      },
      auth: {
        type: [Boolean, String],
        default: true,
      },
      authHeader: {
        type: String,
        default: 'Authorization',
      },
      authPrefix: {
        type: String,
        default: 'Bearer',
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
        uriOption: null,
        editRoute: '',
      };
    },
    computed: {
      getUri() {
        // if uriOption have some option , construc the uri with it!
        let uri = this.uri || this.name;
        if (this.uriOption) {
          if (this.uriOption.suffix) {
            uri = uri + this.uriOption.suffix;
          }
        }

        return uri;
      },
      getId() {
        return this.id || this.uriOption.id;
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
      this.formUniqueId = `${this.$moment().valueOf()}-edit`;

      if (this.loadOnMount) {
        this.load();
      }

      if (!this.loadOnMount && this.refModal !== null) {
        this.$bus.$on(`t-event.t-modal.${this.refModal}.open`, this.load);
      }
    },
    created() {
      const auth = _.isBoolean(this.auth) ? 'oauth.access_token' : this.auth;
      if (auth) {
        const header = {};
        header[this.authHeader] = [this.authPrefix, _.get(this.get(), auth)].join(' ').trim();
        this.config.headers = _.extend(header, this.config.headers);
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
        // if data is passed with event, store data in uriOption
        if (dataEvent) {
          this.$set(this, 'uriOption', dataEvent);
        }

        this.loading = true;
        if (_.isNull(this.id) && _.isNull(event) && _.isNull(event.id)) {
          throw new Error('Entity identifier is unknown');
        }

        this.$bus.$emit(`t-event.ajax-edit.${this.name}.loading`);
        this.$set(this, 'model', this.defaultModelValues || {});

        const data = await this.$ajax.get(this.editRouteFunc(), {}, this.config);
        this.schema.fields = _.form(this.$t, data.form);
        this.applyFilterOnSchema();

        // TODO find how to handle file properties
        if (data.entity && data.entity.file_name) {
          data.entity.file = data.entity.file_name;
        }

        this.$set(this, 'model', _.clearModelForForm(data.entity, data.form, this.defaultModelValues || {}));
        this.updatePreviousModel();
        this.loading = false;

        this.$nextTick(() => {
          this.$bus.$emit(`t-event.ajax-edit.${this.name}.loaded`);
        });
      },
      updatePreviousModel() {
        this.previousModel = JSON.parse(JSON.stringify(this.model));
      },
      async submit(extraModel) {
        const submitData = _.differenceObj(this.model, this.previousModel);
        if (!(extraModel instanceof Event)) {
          _.extend(submitData, extraModel);
        }
        if (!_.isEmpty(submitData)) {
          await this.$ajax.patch(this.editRouteFunc(), submitData, this.config)
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
