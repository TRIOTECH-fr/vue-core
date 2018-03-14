<template>
  <div class="navigation">
    <router-link :to="index" class="btn btn-back">
      <i class="ti ti-2x ti-dashboard" />
      <span>{{ $t('actions.list') }}</span>
    </router-link>
    <router-link v-if="previous && previous.exist" :to="previous.link" class="btn btn-nav btn-prev">
      <i class="ti ti-2x ti-arrow-left" />
      <span>{{ $t('actions.prev') }}</span>
    </router-link>
    <router-link v-if="next && next.exist" :to="next.link" class="btn btn-nav btn-next">
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
      previous: {
        type: Object,
        default: () => ({}),
      },
      next: {
        type: Object,
        default: () => ({}),
      },
    },
    build(links, route, param = 'id') {
      const identifier = _.reduce(['previous', 'next'], (carry, link) => {
        const data = links[link];
        const href = data && data.href && (data.href.match(/[\d]+$/) || data.href.match(/[\w-]+$/));
        carry[link] = href && href.length > 0 ? href[0] : href;
        return carry;
      }, {});

      const navigation = {
        previous: {
          exist: identifier.previous !== undefined,
          link: {
            name: route,
            params: { },
          },
        },
        next: {
          exist: identifier.next !== undefined,
          link: {
            name: route,
            params: {
              id: identifier.next,
            },
          },
        },
      };

      navigation.previous.link.params[param] = identifier.previous;
      navigation.next.link.params[param] = identifier.next;

      return navigation;
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/scss/vars';
  @import '~@triotech/vue-core/src/scss/media';
  @import '~@triotech/vue-core/src/scss/compass';
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

  @include editable-max-width(768px) {
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
