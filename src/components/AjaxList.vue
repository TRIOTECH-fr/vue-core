<template>
  <b-col cols="12">
    <div v-if="loader && isLoading" class="text-center">
      <slot name="loader">
        <i class="ti ti-2x ti-spin ti-refresh"></i>
      </slot>
    </div>
    <b-list-group v-else>
      <slot name="item" v-for="(item, index) in items" :item="item" :index="index">
        <b-list-group-item>{{ item }} - {{ index }}</b-list-group-item>
      </slot>
    </b-list-group>
  </b-col>
</template>

<script>
  import Ajax from '@triotech/vue-core/src/lib/http/ajax';

  export default {
    name: 'AjaxList',
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
    methods: {
      authValue(path) {
        return path.split('.').reduce((carry, part) => carry && carry[part], this.$store.state);
      },
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
        header[this.authHeader] = [this.authPrefix, this.authValue(auth)].join(' ').trim();
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
