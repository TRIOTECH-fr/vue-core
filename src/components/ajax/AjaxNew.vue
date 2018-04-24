<template>
  <div>
    <form :id="`form-new-${name}`" @submit.prevent="submit">
      <template v-if="schema.fields.length > 0">
        <vue-form-generator
          :schema="schema"
          :model="model"
          :options="{ validationAfterLoad: true, validationAfterChanged: true }"
          :key="formUniqueId"
        />
        <slot name="beforeSubmit" />
        <b-row>
          <b-col>
            <slot name="submitButton">
              <b-button
                :disabled="isDisabled"
                block
                type="submit"
                variant="success"
              >
                {{ $t('actions.create') }}
              </b-button>
            </slot>
          </b-col>
        </b-row>
      </template>
      <div v-else class="text-center">
        <i class="ti ti-2x ti-spin ti-refresh"/>
      </div>
    </form>
  </div>
</template>

<script>
  import VueFormGenerator from '@triotech/vue-core/src/vendor/vue-form-generator';
  import { Identity } from 'lodash';

  export default {
    name: 'AjaxNewComponent',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    props: {
      isDisabled: {
        type: Boolean,
        default: false,
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
      action: {
        type: String,
        default: 'new',
      },
      serializer: {
        type: Function,
        default: Identity,
      },
    },
    data() {
      return {
        model: () => ({}),
        schema: {
          fields: [],
        },
        uriOption: null,
        formUniqueId: null,
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
    },
    watch: {
      defaultModelValues: {
        deep: true,
        handler(newValue) {
          _.merge(this.model, newValue);
        },
      },
    },
    mounted() {
      this.formUniqueId = `${this.$moment().valueOf()}-new`;

      if (this.loadOnMount) {
        this.load();
      }

      if (!this.loadOnMount && this.refModal !== null) {
        this.$bus.$on(`t-event.t-modal.${this.refModal}.opened`, this.load);
      }

      this.$bus.$on(`t-event.ajax-new.${this.name}.submit`, this.submit);
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
        this.$off(`t-event.t-modal.${this.refModal}.opened`);
      }

      this.$bus.$off(`t-event.ajax-new.${this.name}.submit`);
    },
    methods: {
      applyFilterOnSchema() {
        // TODO apply with inverse option
        if (_.size(this.fieldsFilterList) > 0) {
          _.forEach(this.fieldsFilterList, (fieldFiltered) => {
            _.remove(this.schema.fields, s => s.model === fieldFiltered);
          });
        }
      },
      async load(dataEvent = null) {
        // if data is passed with event, store data in uriOption
        if (dataEvent) {
          this.$set(this, 'uriOption', dataEvent);
        }

        this.$bus.$emit(`t-event.ajax-new.${this.name}.loading`);
        this.$set(this, 'model', this.defaultModelValues || {});

        const data = await this.$ajax.get(`${this.getUri}/${this.action}`, {}, this.config);
        this.$set(this.schema, 'fields', _.form(this.$t, data));
        this.applyFilterOnSchema();

        this.$nextTick(() => {
          this.$bus.$emit(`t-event.ajax-new.${this.name}.loaded`);
        });
      },
      async submit(extraModel) {
        if (!(extraModel instanceof Event)) {
          _.extend(this.model, extraModel);
        }
        // TODO https://monterail.github.io/vuelidate/

        await this.$ajax.post(`${this.getUri}/${this.action}`, this.serializer(this.model), this.config)
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
              if (this._.isArray(this.refAjaxIndex)) {
                this._.each(this.refAjaxIndex, (refAjaxIndex) => {
                  this.$bus.$emit(`t-event.ajax-index.${refAjaxIndex}.refresh`);
                });
              } else {
                this.$bus.$emit(`t-event.ajax-index.${this.refAjaxIndex}.refresh`);
              }
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
