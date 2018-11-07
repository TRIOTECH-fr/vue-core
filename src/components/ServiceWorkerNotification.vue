<template>
  <div v-if="serviceWorkerUpdated" class="service-worker-updated text-center">
    <u @click="reload">
      {{ $t('service_worker_updated') }}
    </u>
    <span class="position-absolute" @click="serviceWorkerUpdated = false">✕</span>
  </div>
</template>

<script>
  export default {
    name: 'ServiceWorkerNotificationComponent',
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