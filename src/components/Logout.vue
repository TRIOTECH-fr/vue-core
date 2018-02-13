<template>
  <div class="logout">
    <a @click="logout" href="#" :class="klass">
      <i class="ti ti-lg" :class="icon" v-if="icon"></i>
      <span v-html="text"></span>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'LogoutPage',
    props: {
      text: { type: String, default() { return this.$t('actions.logout'); } },
      icon: { type: String, default: '' },
      klass: { type: String, default: '' },
      route: { type: String, default: 'home' },
      sessionKey: { type: String, default: 'oauth' },
    },
    methods: {
      logout() {
        this.unset(this.sessionKey);
        this.setKeyValueAction({ key: 'oauth', value: null });
        this.$router.push({ name: this.route });
      },
    },
  };
</script>
