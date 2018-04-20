<template>
  <form @submit.prevent="onSubmit">
    <vue-form-generator :schema="schema" :model="model" :options="{ validationAfterLoad: true, validationAfterChanged: true }" />
    <template v-if="schema.fields.length > 0">
      <b-button type="submit" variant="primary" block>
        {{ $t('actions.send') }}
      </b-button>
      <b-button block @click="$router.push({ name: 'home' })">
        {{ $t('actions.go_back') }}
      </b-button>
    </template>
    <div v-else class="text-center">
      <i class="ti ti-2x ti-spin ti-refresh"/>
    </div>
  </form>
</template>

<script>
  import VueFormGenerator from 'vue-form-generator';

  export default {
    name: 'AjaxRequestComponent',
    components: {
      'vue-form-generator': VueFormGenerator.component,
    },
    props: {
      uri: {
        type: String,
        default: 'public/resetting/request',
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
        await this.$ajax.publicRequest(this.uri)
          .then((data) => {
            this.$set(this.schema, 'fields', _.form(this.$t, data));
          });
      },
      successRoute() {
        if (typeof this.success_route === 'function') {
          return this.success_route();
        }
        return this.success_route;
      },
      async onSubmit() {
        await this.$ajax.publicRequest(this.uri, 'POST', this.model).then((response) => {
          const type = response.status === true ? 'sucess' : 'error';
          this.$notify({
            title: this.$t('flashes.request.title'),
            text: this.$t(`flashes.request.${type}`),
            type,
          });
          this.forward();
        }).catch((err) => {
          if (err.response) {
            this.$notify({
              title: this.$t('flashes.request.title'),
              text: this.$t(`flashes.request.${err.response.data.error}`),
              type: 'error',
            });
          }
        });
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
