<template>
  <div>
    <form @submit.prevent="submit">
      <template v-if="this.schema.fields.length > 0">
        <vue-form-generator :schema="schema" :model="model" :options="{ validationAfterLoad: true, validationAfterChanged: true }" />
        <slot name="beforeSubmit" />
        <b-row>
          <b-col>
            <b-button block type="submit" variant="success">{{ $t('actions.create') }}</b-button>
          </b-col>
        </b-row>
      </template>
      <div class="text-center" v-else>
        <i class="ti ti-2x ti-spin ti-refresh"/>
      </div>
    </form>
  </div>
</template>

<script>
  import VueFormGenerator from '@triotech/vue-core/src/vendor/vue-form-generator';

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
      notificationSuccessText: {
        type: String,
        default() {
          return this.$t(`flashes.${this.name}.create`);
        },
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
        this.$bus.$on(`t-event.t-modal.${this.refModal}.opened`, this.load);
      }
    },
    beforeDestroy() {
      if (!this.loadOnMount && this.refModal !== null) {
        this.$off(`t-event.t-modal.${this.refModal}.opened`);
      }
    },
    computed: {
      getUri() {
        return this.uri || this.name;
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
    methods: {
      applyFilterOnSchema() {
        // todo appli with inverse option
        if (_.size(this.fieldsFilterList) > 0) {
          _.forEach(this.fieldsFilterList, (fieldFiltered) => {
            _.remove(this.schema.fields, s => s.model === fieldFiltered);
          });
        }
      },
      async load() {
        const modelTemp = this.defaultModelValues !== null
          ? this.defaultModelValues
          : {};
        this.$set(this, 'model', modelTemp);
        await this.$ajax.get(`${this.getUri}/new`)
          .then((data) => {
            this.$set(this.schema, 'fields', _.form(this.$t, data));
            this.applyFilterOnSchema();
          });
      },
      async submit() {
        // TODO SEE HOW TODO THAT CORRECTLY
        // _.each(this.schema.fields, (field) => {
        //   let modelField = this.model[field.model];

        //   if (field.model.split('[').length > 1) {
        //     const fieldModel = field.model.split('[');
        //     const f1 = fieldModel[0];
        //     const f2 = fieldModel[1].replace(']', '');

        //     modelField = this.model[f1][f2];
        //   }

        //   if (field.required && !modelField) {
        //     this.$notify({
        //       title: this.$t(`flashes.${this.name}.error`),
        //       text: this.$t(`flashes.${this.name}.${field.model}.empty`),
        //       type: 'error',
        //     });
        //     canSubmit = false;
        //   } else {
        //     canSubmit = true;
        //   }
        // });

        await this.$ajax.post(`${this.getUri}/new`, this.model)
          .then((data) => {
            if (data.status) {
              this.$notify({
                title: this.$t(`flashes.${this.name}.create_title`),
                text: this.notificationSuccessText,
                type: 'success',
              });
              if (this.closeModal) {
                this.$bus.$emit(`t-event.t-modal.${this.refModal}.close`);
              }
              this.$bus.$emit(`t-event.new-submit.${this.name}.success`, this.model);
            } else {
              this.$notify({
                title: this.$t(`flashes.${this.name}.create_title`),
                text: this.$t(`flashes.${this.name}.not_create`),
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
            } else if (data.response.data.error.code === 500) {
              this.$notify({
                title: this.$t(`flashes.${this.name}.error_500_title`),
                text: this.$t(`flashes.${this.name}.error_500`),
                type: 'error',
              });
            }
          });
        return false;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>

