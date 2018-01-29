<template>
    <div v-if="loading" class="text-center mb-3">
      <slot name="loader">
        <i class="ti ti-2x ti-spin ti-refresh"></i>
      </slot>
    </div>
    <form v-else @submit.prevent="submit">
      <template v-if="this.schema.fields.length > 0">
        <vue-form-generator :schema="schema" :model="model" :options="{ validationAfterLoad: true, validationAfterChanged: true }" :class="formClass"/>
        <b-row>
          <b-col>
            <b-button block type="submit" variant="primary">{{ $t('actions.save') }}</b-button>
          </b-col>
        </b-row>
      </template>
      <div class="text-center" v-else>
        <i class="ti ti-2x ti-spin ti-refresh"></i>
      </div>
    </form>
</template>

<script>
  import VueFormGenerator from '@triotech/vue-core/src/bind/vue-form-generator';

  export default {
    name: 'AjaxEditComponent',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    data() {
      return {
        loading: true,
        model_back: {},
        model: {},
        schema: {
          fields: [],
        },
        fallback_id: null,
        editRoute: '',
      };
    },
    props: {
      id: {
        type: Number,
        default: null,
      },
      formClass: {
        type: String,
      },
      name: {
        type: String,
        default: null,
      },
      uri: {
        type: String,
        default: null,
      },
      additionnal_route: {
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
    computed: {
      getUri() {
        return this.uri !== null ? this.uri : this.name;
      },
      getId() {
        return this.id || this.fallback_id;
      },
    },
    methods: {
      editRouteFunc() {
        this.editRoute = `${this.getUri}/${this.getId}/edit`;
        if (this.additionnal_route) {
          this.editRoute = `${this.getUri}/${this.getId}/edit/${this.additionnal_route}`;
        }

        return this.editRoute;
      },
      async load(dataEvent = null) {
        this.loading = true;
        if (_.isNull(this.id) && _.isNull(dataEvent)) {
          throw String('No entity.id know');
        }

        if (!_.isNull(dataEvent)) {
          if (_.isNaN(parseInt(dataEvent, 10))) {
            this.fallback_id = dataEvent.id;
          } else {
            this.fallback_id = dataEvent;
          }
        }
        this.$set(this, 'model', {});

        await this.$ajax.get(this.editRouteFunc())
          .then((data) => {
            this.schema.fields = _.form(this.$t, data.form);
            const modelTemp = this.defaultModelValues !== null ? this.defaultModelValues : {};
            this.$set(this, 'model', _.defaultsDeepObj(data.entity, modelTemp));
            this.model_back = JSON.parse(JSON.stringify(data.entity));
            this.loading = false;
          })
        ;
      },
      async submit() {
        const submitData = _.differenceObj(this.model, this.model_back);
        if (!_.isEmpty(submitData)) {
          await this.$ajax.patch(this.editRouteFunc(), submitData)
            .then((data) => {
              if (data.status) {
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
            })
          ;
        }
        return false;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>

