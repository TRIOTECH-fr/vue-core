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
      browserNotification: {
        type: Boolean,
        default: false,
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
      browserNotificationEnabled() {
        return this.browserNotification && !!this.notification;
      },
      browserNotificationDefault() {
        return this.browserNotificationEnabled && this.notification.permission === 'default';
      },
      browserNotificationGranted() {
        return this.browserNotificationEnabled && this.notification.permission === 'granted';
      },
      browserNotificationDenied() {
        return this.browserNotificationEnabled && this.notification.permission === 'denied';
      },
    },
    data() {
      return {
        serviceWorker: null,
        serviceWorkerHeader: false,
      };
    },
    async created() {
      if (this.browserNotificationDefault) {
        await Notification.requestPermission();
      }

      window.serviceWorkerUpdated = async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        this.serviceWorker = registration.active;

        if (this.browserNotificationGranted) {
          const options = {
            body: this.text,
            tag: 'update',
            icon: `/static/img/icons/android-chrome-512x512.png`,
            // data: window.location.href,
          };

          if ('actions' in Notification.prototype) {
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
