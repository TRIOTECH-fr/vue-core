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
    },
    methods: {
      logout() {
        this.$store.replaceState({});
        this.$router.push({ name: this.route });
      },
    },
  };
</script>
