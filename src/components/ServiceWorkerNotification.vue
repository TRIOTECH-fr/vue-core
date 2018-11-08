<template>
  <div v-if="serviceWorkerHeader" class="service-worker-updated text-center">
    <u @click="onReloadClick">
      {{ text }}
    </u>
    <span class="position-absolute" @click="serviceWorkerHeader = false">✕</span>
  </div>
</template>

<script>
  export default {
    name: 'ServiceWorkerNotificationComponent',
    props: {
      title: {
        type: String,
        default() {
          return this.$t('title');
        },
      },
      text: {
        type: String,
        default() {
          return this.$t('service_worker_updated');
        },
      },
      updateInterval: {
        type: Number,
        default: 3600,
      },
      autoReload: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      notification: () => window.Notification,
      hasNotification() {
        return !!this.notification;
      },
      isNotificationDefault() {
        return this.hasNotification && this.notification.permission === 'default';
      },
      isNotificationGranted() {
        return this.hasNotification && this.notification.permission === 'granted';
      },
      isNotificationDenied() {
        return this.hasNotification && this.notification.permission === 'denied';
      },
    },
    data() {
      return {
        serviceWorker: null,
        serviceWorkerHeader: false,
      };
    },
    async created() {
      if (this.isNotificationDefault) {
        await this.notification.requestPermission();
      }

      window.serviceWorkerUpdated = async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        this.serviceWorker = registration.active;

        if (this.isNotificationGranted) {
          const options = {
            body: this.text,
            tag: 'update',
            icon: `/static/img/icons/android-chrome-512x512.png`,
          };

          if ('actions' in this.notification.prototype) {
            options.actions = [{
              action: 'reload',
              title: this.$t('actions.reload'),
            }];
          }

          registration.showNotification(this.title, options);
        } else {
          this.serviceWorkerHeader = true;
        }
      };

      if (this.updateInterval > 0) {
        window.serviceWorkerUpdateInterval = 1000 * this.updateInterval;
      }

      if (this.autoReload) {
        window.serviceWorkerAutoReload = true;
      }
    },
    methods: {
      onReloadClick() {
        window.location.reload();
      }
    }
  };
</script>

<style lang="scss">
  @import '~@/scss/vars';

  .service-worker-updated {
    line-height: 50px;

    * {
      cursor: pointer;
    }

    .position-absolute {
      right: 0;
      padding: 0 15px;
    }
  }
</style>
