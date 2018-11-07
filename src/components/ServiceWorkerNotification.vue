<template>
  <div v-if="serviceWorkerUpdated" class="service-worker-updated text-center">
    <u @click="reload">
      {{ text }}
    </u>
    <span class="position-absolute" @click="serviceWorkerUpdated = false">✕</span>
  </div>
</template>

<script>
  export default {
    name: 'ServiceWorkerNotificationComponent',
    props: {
      text: {
        type: String,
        default() {
          return this.$t('service_worker_updated');
        },
      },
    },
    data() {
      return {
        serviceWorkerUpdated: false,
      };
    },
    created() {
      window.serviceWorkerUpdated = () => {
        this.serviceWorkerUpdated = true;
      };
    },
    methods: {
      reload() {
        window.location.reload();
      }
    }
  };
</script>

<style lang="scss">
  @import '~@/scss/vars';

  .service-worker-updated {
    line-height: 50px;

    .position-absolute {
      right: 0;
      padding: 0 15px;
    }
  }
</style>