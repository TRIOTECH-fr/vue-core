<template>
  <div class="logout">
    <a :class="klass" href="#" @click="onClickLogout">
      <i v-if="icon" :class="`${icon} ti ti-lg`"/>
      <span v-html="text"/>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'LogoutComponent',
    props: {
      text: {
        type: String,
        default() {
          return this.$t('actions.logout');
        },
      },
      icon: {
        type: String,
        default: '',
      },
      klass: {
        type: String,
        default: '',
      },
      route: {
        type: String,
        default: 'home',
      },
      sessionKey: {
        type: String,
        default: 'oauth',
      },
    },
    methods: {
      onClickLogout() {
        this.unset(this.sessionKey);
        this.$router.push({ name: this.route });
      },
    },
  };
</script>
