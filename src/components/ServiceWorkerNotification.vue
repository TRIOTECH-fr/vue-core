<template>
  <div v-if="serviceWorkerHeader" :class="['service-worker-updated', 'text-center', { 'is-absolute' : isAbsolute }]">
    <u @click="onReloadClick">
      {{ text }}
    </u>
    <span class="close-notification" @click="serviceWorkerHeader = false">✕</span>
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
      isAbsolute: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        serviceWorker: null,
        serviceWorkerHeader: false,
      };
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
    async created() {
      if (this.isNotificationDefault) {
        await this.notification.requestPermission();
      }

      window.serviceWorkerUpdated = async () => {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
          this.serviceWorker = registration.active;
        }

        if (this.isNotificationGranted) {
          const options = {
            body: this.text,
            tag: 'update',
            icon: '/static/img/icons/android-chrome-512x512.png',
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
      },
    },
  };
</script>

<style lang="scss">
  @import '~@/scss/vars';
  @import 'compass/css3/box-shadow';

  .service-worker-updated {
    line-height: 50px;

    &.is-absolute {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10000;
      background: $extra-light-grey;
      min-width: 450px;
      border: 1px solid $extra-light-grey;
      text-align: left !important;
      padding: 10px 20px;

      @include box-shadow(-1px 1px 6px $light-grey);
    }

    .close-notification {
      position: absolute;
      right: 20px;
      top: 0;
    }

    * {
      cursor: pointer;
    }

  }
</style>
