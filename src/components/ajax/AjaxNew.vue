<template>
  <div>
    <form @submit.prevent="submit">
      <template v-if="this.schema.fields.length > 0">
        <vue-form-generator :schema="schema" :model="model" :options="{ validationAfterLoad: true, validationAfterChanged: true }" />
        <b-row>
          <b-col>
            <b-button :to="{ name: 'parameter.index' }" block>{{ $t('actions.go_back') }}</b-button>
          </b-col>
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
      },
      uri: {
        type: String,
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
    async mounted() {
      await Ajax.get(`${this.uri}/new`)
        .then((data) => {
          this.schema.fields = this.schema.fields.concat(_.form(this.$t, data));
        })
      ;
    },
    methods: {
      async submit() {
        await Ajax.post(`${this.uri}/new`, this.model)
          .then((data) => {
            if (data.status) {
              this.$notify({
                title: this.$t(`flashes.${this.name}.create_title`),
                text: this.$t(`flashes.${this.name}.create`),
                type: 'success',
              });
              if (this.$parent.$refs.content.className === 'sweet-content') {
                this.$parent.close();
              }
            } else {
              this.$notify({
                title: this.$t(`flashes.${this.name}.create_title`),
                text: this.$t(`flashes.${this.name}.not_create`),
                type: 'error',
              });
            }
          }, () => {
            this.$notify({
              title: this.$t(`flashes.${this.name}.server_error_title`),
              text: this.$t(`flashes.${this.name}.server_error`),
              type: 'warning',
            });
          })
        ;
        return false;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>

