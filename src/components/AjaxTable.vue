<template>
  <b-col cols="12">
    <div v-if="loader && isLoading" class="text-center">
      <slot name="loader">
        <i class="ti ti-2x ti-spin ti-refresh"></i>
      </slot>
    </div>
    <table class="table" v-else>
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
      <slot name="footer"></slot>
    </table>
  </b-col>
</template>

<script>
  import Ajax from '@triotech/vue-core/src/lib/http/ajax';

  export default {
    name: 'AjaxTable',
    props: {
      uri: { type: String, required: true },
      method: { type: String, default: 'get' },
      data: { type: Object },
      config: { type: Object, default: () => ({}) },
      auth: { type: [String, Boolean] },
      authHeader: { type: String, default: 'Authorization' },
      authPrefix: { type: String, default: 'Bearer' },
      loader: { type: Boolean, default: true },
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
      this.isLoading = true;
      const fn = Ajax[this.method];

      await fn(this.uri, this.data, this.config).then((items) => {
        this.items = items;
        this.isLoading = false;
      });
    },
  };
</script>
