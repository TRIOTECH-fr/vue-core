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
          <i v-else-if="props.item.type === 'loading'" class="ti ti-fw ti-spin ti-refresh"/>
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
  @import '../scss/bootstrap';

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

      &.loading {
        background-color: $blue;
        border-color: $dark-blue;
      }

      &.success {
        background-color: $green;
        border-color: $dark-green;
      }

      &.error {
        background-color: $red;
        border-color: $dark-red;
      }

      &.warning {
        background-color: $orange;
        border-color: $dark-orange;
      }

      &.default {
        color: $grey;

        .custom-template-icon,
        .custom-template-close {
          color: $grey;
        }
      }

      .custom-template-icon {
        color: $white;
        font-size: 32px;
        padding: 0 10px;
      }

      .custom-template-close {
        color: $white;
        opacity: 1;
        align-self: baseline;
        font-size: 16px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }

      .custom-template-content {
        color: $white;
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

  @include media-breakpoint-down(xs) {
    .my-notification-style {
      margin: 0;
      width: 100% !important;
    }
  }
</style>
