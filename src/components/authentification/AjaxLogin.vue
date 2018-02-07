<template>
    <form @submit.prevent="submit">
      <vue-form-generator :schema="schema" :model="model" :options="{ validationAfterLoad: true, validationAfterChanged: true }" />
      <b-button v-if="this.schema.fields.length > 0" type="submit" variant="primary" block>{{ $t('actions.login') }}</b-button>
      <div class="text-center" v-else>
        <i class="ti ti-2x ti-spin ti-refresh"></i>
      </div>
    </form>
</template>

<script>
  import VueFormGenerator from '$/vendor/vue-form-generator';

  export default {
    name: 'LoginPage',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    data() {
      return {
        model: {
          rememberMe: true,
        },
        schema: {
          fields: [],
        },
      };
    },
    props: {
      uri: {
        type: String,
        default: 'public/login/',
      },
      success_route: {
        type: [Object, Function],
        default() {
          return { name: 'dashboard' };
        },
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
      defaultModelValues: {
        type: Object,
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
        const modelTemp = this.defaultModelValues !== null
          ? this.defaultModelValues
          : this.model
        ;
        this.$set(this, 'model', modelTemp);

        if (this.$store.state.oauth) {
          this.forward();
        } else {
          await this.$ajax.get(this.uri)
            .then((data) => {
              this.$set(this.schema, 'fields', _.form(this.$t, data));
              this.$bus.$emit('t-event.load-form.login.success')
            })
          ;
        }
      },
      successRoute() {
        if (typeof this.success_route === 'function') {
          return this.success_route();
        }
        return this.success_route;
      },
      async submit() {
        await this.$ajax.login(this.model)
          .then(() => {
            this.$notify({
              title: this.$t('flashes.login.title'),
              text: this.$t('flashes.login.success'),
              type: 'success',
            });
            this.forward();
          })
          .catch((err) => {
            if (err.response) {
              this.$notify({
                title: this.$t('flashes.login.title'),
                text: this.$t(`flashes.login.${err.response.data.error}`),
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
        //TODO remove new-submit event.
        this.$bus.$emit('t-event.new-submit.login.success');
        this.$bus.$emit('t-event.login.success');
        this.$router.push(this.successRoute());
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
