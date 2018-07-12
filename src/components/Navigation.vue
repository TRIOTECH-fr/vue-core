<template>
  <div class="navigation">
    <router-link :to="index" class="btn btn-back">
      <i class="ti ti-2x ti-dashboard" />
      <span>{{ $t('actions.list') }}</span>
    </router-link>
    <router-link v-if="previous" :to="previous" class="btn btn-nav btn-prev">
      <i class="ti ti-2x ti-arrow-left" />
      <span>{{ $t('actions.prev') }}</span>
    </router-link>
    <router-link v-if="next" :to="next" class="btn btn-nav btn-next">
      <span>{{ $t('actions.next') }}</span>
      <i class="ti ti-2x ti-arrow-right" />
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
  @import '../scss/compass';
  @import 'compass/css3/transition';

  .navigation {
    .btn {
      position: fixed;
      background-color: $orange;
      width: 60px;
      color: $white;
      border-radius: 0;
      padding: 20px 10px;
      z-index: 10;
      overflow: hidden;

      @include transition(width .2s, background-color .2s);

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
        width: 150px;
        background-color: $orange;

        span {
          display: inline-block;
        }
      }

      span {
        display: none;

        @include transition(opacity .2s);
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
