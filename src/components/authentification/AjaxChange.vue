<template>
    <form @submit.prevent="submit">
      <vue-form-generator :schema="schema" :model="model" :options="{ validationAfterLoad: true, validationAfterChanged: true }" />
      <b-button v-if="this.schema.fields.length > 0" type="submit" variant="primary" block>{{ $t('actions.send') }}</b-button>
      <div class="text-center" v-else>
        <i class="ti ti-2x ti-spin ti-refresh"></i>
      </div>
    </form>
</template>

<script>
  import VueFormGenerator from '@triotech/vue-core/src/vendor/vue-form-generator';

  export default {
    name: 'LoginChangePage',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    data() {
      return {
        model: {},
        schema: {
          fields: [],
        },
      };
    },
    props: {
      token: {
        type: String,
        default: '',
      },
      uri: {
        type: String,
        default: 'public/resetting/reset',
      },
      refModal: {
        type: String,
        default: null,
      },
      closeModal: {
        type: Boolean,
        default: false,
      },
      loadOnMount: {
        type: Boolean,
        default: true,
      },
      success_route: {
        type: [String, Object, Function],
        default: null,
      },
    },
    mounted() {
      if (this.loadOnMount) {
        this.load();
      }

      if (!this.loadOnMount && this.refModal !== null) {
        this.$bus.$on(`t-event.t-modal.${this.refModal}.opened`, this.load);
      }
    },
    methods: {
      async load() {
        await this.$ajax.publicRequest(`${this.uri}/${this.token}`)
          .then((data) => {
            this.$set(this.schema, 'fields', _.form(this.$t, data));
          })
        ;
      },
      successRoute() {
        if (typeof this.success_route === 'function') {
          return this.success_route();
        }
        return this.success_route;
      },
      async submit() {
        await this.$ajax.publicRequest(`${this.uri}/${this.token}`, 'POST', this.model)
          .then(() => {
            this.$notify({
              title: this.$t('flashes.request.title'),
              text: this.$t('flashes.request.success'),
              type: 'success',
            });
            this.forward();
          })
          .catch((err) => {
            if (err.response) {
              this.$notify({
                title: this.$t('flashes.request.title'),
                text: this.$t(`flashes.request.${err.response.data.error}`),
                type: 'error',
              });
            }
          })
        ;
      },
      forward() {
        if (this.closeModal) {
          this.$bus.$emit(`t-event.t-modal.${this.refModal}.close`);
        }
        this.$bus.$emit('t-event.new-submit.request.success');
        this.$router.push(this.successRoute());
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
