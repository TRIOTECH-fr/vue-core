<template>
  <b-col cols="12">
    <div v-if="loader && isLoading" class="text-center mb-3">
      <slot name="loader">
        <i class="ti ti-2x ti-spin ti-refresh"></i>
      </slot>
    </div>
    <template v-else>
      <template v-if="items.length > 0">
        <table class="table">
          <slot name="header">
            <tr>
              <th>{{ $t('table.item') }}</th>
              <th>{{ $t('table.index') }}</th>
            </tr>
          </slot>
          <slot name="item" v-for="(item, index) in items" :item="item" :index="index">
            <tr>
              <td>{{ item }}</td>
              <td>{{ index }}</td>
            </tr>
          </slot>
        </table>
      </template>
      <b-alert v-else show>{{ $t(entityName + '.empty_set') }}</b-alert>
      <slot name="footer"></slot>
    </template>
  </b-col>
</template>

<script>
  import Ajax from '@triotech/vue-core/src/lib/http/ajax';

  export default {
    name: 'AjaxTable',
    props: {
      entityName: { type: String, default: 'item' },
      uri: { type: String, required: true },
      method: { type: String, default: 'get' },
      data: { type: Object },
      config: { type: Object, default: () => ({}) },
      auth: { type: [String, Boolean] },
      authHeader: { type: String, default: 'Authorization' },
      authPrefix: { type: String, default: 'Bearer' },
      loader: { type: Boolean, default: true },
      initLoad: { type: Boolean, default: true },
    },
    data() {
      return {
        isLoading: false,
        items: {},
      };
    },
    created() {
      const auth = _.isBoolean(this.auth) ? 'access_token' : this.auth;
      if (auth) {
        const header = {};
        header[this.authHeader] = [this.authPrefix, _.get(this.$store.state, auth)].join(' ').trim();
        this.config.headers = _.extend(header, this.config.headers);
      }
    },
    async mounted() {
      if (this.initLoad) {
        await this.load();
      }
    },
    methods: {
      async load() {
        this.isLoading = true;
        const fn = Ajax[this.method];
        await fn(this.uri, this.data, this.config).then((items) => {
          this.items = items;
          this.isLoading = false;
        });
      },
    },
  };
</script>
