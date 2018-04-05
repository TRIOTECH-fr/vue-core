<template>
  <notifications
    :duration="duration"
    :width="500"
    :speed="500"
    position="top right"
    class="my-notification-style"
    animation-type="velocity"
  >
    <template slot="body" slot-scope="props">
      <div :class="props.item.type" class="custom-template">
        <div class="custom-template-icon">
          <i v-if="props.item.type === 'success'" class="ti ti-fw ti-check-circle"/>
          <i v-else-if="props.item.type === 'error'" class="ti ti-fw ti-close-circle"/>
          <i v-else-if="props.item.type === 'warning'" class="ti ti-fw ti-warning"/>
          <i v-else class="ti ti-fw ti-info-circle"/>
        </div>
        <div class="custom-template-content">
          <div class="custom-template-title">
            {{ props.item.title }}
          </div>
          <div class="custom-template-text" v-html="props.item.text"/>
        </div>
        <div class="custom-template-close" @click="props.close">
          <i class="ti ti-fw ti-close"/>
        </div>
      </div>
    </template>
  </notifications>
</template>

<script>
  export default {
    name: 'CustomNotificationComponent',
    props: {
      duration: {
        type: Number,
        default: -1,
      },
    },
  };
</script>

<style lang="scss">
  @import '~@/scss/vars';
  @import '~@/scss/media';

  .my-notification-style {
    margin: 10px;
    z-index: 1000000 !important;

    .custom-template {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      text-align: left;
      font-size: 13px;
      margin: 5px 5px 0;
      align-items: center;
      justify-content: center;
      background: $extra-light-grey;
      border: 1px solid $light-grey;
      padding: 10px;
      border-radius: 5px;

      &,
      & > div {
        box-sizing: border-box;
      }

      &.success {
        background-color: $green;
        border-color: $dark-green;


        .custom-template-icon,
        .custom-template-content {
          color: $white;
        }

        .custom-template-close {
          color: $dark-green;
          opacity: 1;
        }
      }

      &.error {
        background-color: $red;
        border-color: $dark-red;

        .custom-template-icon,
        .custom-template-content {
          color: $white;
        }

        .custom-template-close {
          color: $dark-red;
          opacity: 1;
        }
      }

      &.warning {
        background-color: $orange;
        border-color: $dark-orange;

        .custom-template-icon,
        .custom-template-content {
          color: $white;
        }

        .custom-template-close {
          color: $dark-orange;
          opacity: 1;
        }
      }

      .custom-template-icon {
        color: $light-grey;
        font-size: 32px;
        padding: 0 10px;
      }

      .custom-template-close {
        align-self: baseline;
        font-size: 16px;
        opacity: 0.2;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }
      .custom-template-content {
        padding: 10px;
        flex: 1 0;

        .custom-template-title {
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 10px;
          font-weight: 600;
        }
      }
    }
  }

  @include editable-max-width(575px) {
    .my-notification-style {
      margin: 0;
      width: 100% !important;
    }
  }
</style>
