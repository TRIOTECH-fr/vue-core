<template>
  <div class="navigation">
    <router-link :to="index" class="btn btn-back">
      <i class="ti ti-2x ti-fw ti-dashboard" />
      <div class="text">{{ $t('actions.list') }}</div>
    </router-link>
    <router-link v-if="previous" :to="previous" class="btn btn-nav btn-prev">
      <i class="ti ti-2x ti-fw ti-arrow-left" />
      <div class="text">{{ $t('actions.prev') }}</div>
    </router-link>
    <router-link v-if="next" :to="next" class="btn btn-nav btn-next">
      <div class="text">{{ $t('actions.next') }}</div>
      <i class="ti ti-2x ti-fw ti-arrow-right" />
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'NavigationComponent',
    props: {
      index: {
        type: Object,
        default: () => ({}),
      },
      links: {
        type: Object,
        default: () => ({}),
      },
      route: {
        type: String,
        default: '',
      },
      param: {
        type: String,
        default: 'id',
      },
    },
    data() {
      return {
        previous: null,
        next: null,
      };
    },
    mounted() {
      this.previous = this.build('previous');
      this.next = this.build('next');
    },
    methods: {
      build(link) {
        const data = this.links[link];
        const href = data && data.href;
        const matches = href && (href.match(/\/([\d]+)$/) || href.match(/\/([\w-]+)$/));
        const param = matches && matches.length > 1 && matches[1];

        return !!href && {
          name: this.route,
          params: {
            [this.param]: param,
          },
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/scss/vars';
  @import '../scss/bootstrap';
  @import 'compass/css3/transition';

  .navigation {
    .btn {
      position: fixed;
      background-color: $orange;
      width: auto;
      color: $white;
      border-radius: 0;
      padding: 20px;
      z-index: 10;
      overflow: hidden;

      &.btn-back {
        top: calc(50vh - 95px);
      }

      &.btn-nav {
        top: calc(50vh - 14px);

        &.btn-next {
          right: 0;
        }
      }

      &:hover {
        div.text {
          margin: 0 20px;
          font-size: 15px;
        }
      }

      div.text {
        font-size: 0;
        display: inline-block;

        @include transition(font-size .2s, opacity .2s);
      }
    }
  }

  @include media-breakpoint-down(sm) {
    .navigation {
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      z-index: 1;

      .btn {
        position: static;
        width: calc(100% / 3);
        border-color: $white;
        padding: 10px;

        &:hover {
          span {
            display: none;
          }
        }
      }
    }
  }
</style>
