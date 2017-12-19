<template>
  <div class="logout">
    <a @click="logout" href="#" class="float-right" v-html="text"></a>
  </div>
</template>

<script>
  export default {
    name: 'LogoutPage',
    props: {
      text: { type: String, default() { return this.$t('actions.logout'); } },
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
