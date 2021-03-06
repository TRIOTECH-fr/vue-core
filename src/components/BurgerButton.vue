<template>
  <button
    :class="[isActive, animation]"
    class="hamburger"
    type="button"
    @click="onToggleMenuClick"
  >
    <span class="hamburger-box">
      <span class="hamburger-inner" />
    </span>
  </button>
</template>

<script>
  export default {
    name: 'BurgerButtonComponent',
    props: {
      animation: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isActive: '',
      };
    },
    methods: {
      onToggleMenuClick() {
        this.isActive = this.isActive ? '' : 'is-active';
        this.$bus.$emit(`t-event.burger-button.${this.isActive ? 'close' : 'open'}-menu`);
        return this.isActive;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @charset "UTF-8";

  /*!
   * Hamburgers
   * @description Tasty CSS-animated hamburgers
   * @author Jonathan Suh @jonsuh
   * @site https://jonsuh.com/hamburgers
   * @link https://github.com/jonsuh/hamburgers
   */

  // Settings
  // ==================================================
  $hamburger-padding-x: 0 !default;
  $hamburger-padding-y: 0 !default;
  $hamburger-layer-width: 40px !default;
  $hamburger-layer-height: 4px !default;
  $hamburger-layer-spacing: 6px !default;
  $hamburger-layer-color: #000 !default;
  $hamburger-layer-border-radius: 4px !default;
  $hamburger-hover-opacity: 0.7 !default;
  $hamburger-hover-transition-duration: 0.15s !default;
  $hamburger-hover-transition-timing-function: linear !default;
  $hamburger-hover-use-filter: false !default;
  $hamburger-hover-filter: opacity(50%) !default;

  $hamburger-types: (
    collapse,
    slider,
    spin,
    squeeze,
  ) !default;

  .hamburger {
    padding: $hamburger-padding-y $hamburger-padding-x;
    display: inline-block;
    cursor: pointer;

    transition-property: opacity, filter;
    transition-duration: $hamburger-hover-transition-duration;
    transition-timing-function: $hamburger-hover-transition-timing-function;

    // Normalize (<button>)
    font: inherit;
    color: inherit;
    text-transform: none;
    background-color: transparent;
    border: 0;
    margin: 0;
    overflow: visible;

    &:hover {
      @if $hamburger-hover-use-filter == true {
        filter: $hamburger-hover-filter;
      } @else {
        opacity: $hamburger-hover-opacity;
      }
    }
  }

  .hamburger-box {
    width: $hamburger-layer-width;
    height: $hamburger-layer-height * 3 + $hamburger-layer-spacing * 2;
    display: inline-block;
    position: relative;
  }

  .hamburger-inner {
    display: block;
    top: 50%;
    margin-top: $hamburger-layer-height / -2;

    &,
    &::before,
    &::after {
      width: $hamburger-layer-width;
      height: $hamburger-layer-height;
      background-color: $hamburger-layer-color;
      border-radius: $hamburger-layer-border-radius;
      position: absolute;
      transition-property: transform;
      transition-duration: 0.15s;
      transition-timing-function: ease;
    }

    &::before,
    &::after {
      content: "";
      display: block;
    }

    &::before {
      top: ($hamburger-layer-spacing + $hamburger-layer-height) * -1;
    }

    &::after {
      bottom: ($hamburger-layer-spacing + $hamburger-layer-height) * -1;
    }
  }

  @if index($hamburger-types, squeeze) {
    .hamburger--squeeze {
      .hamburger-inner {
        transition-duration: 0.075s;
        transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);

        &::before {
          transition: top 0.075s 0.12s ease,
          opacity 0.075s ease;
        }

        &::after {
          transition: bottom 0.075s 0.12s ease,
          transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
      }

      &.is-active {
        .hamburger-inner {
          transform: rotate(45deg);
          transition-delay: 0.12s;
          transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);

          &::before {
            top: 0;
            opacity: 0;
            transition: top 0.075s ease,
            opacity 0.075s 0.12s ease;
          }

          &::after {
            bottom: 0;
            transform: rotate(-90deg);
            transition: bottom 0.075s ease,
            transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
          }
        }
      }
    }
  }

  @if index($hamburger-types, collapse) {
    .hamburger--collapse {
      .hamburger-inner {
        top: auto;
        bottom: 0;
        transition-duration: 0.13s;
        transition-delay: 0.13s;
        transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);

        &::after {
          top: ($hamburger-layer-spacing * 2 + $hamburger-layer-height * 2) * -1;
          transition: top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1),
          opacity 0.1s linear;
        }

        &::before {
          transition: top 0.12s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1),
          transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
      }

      &.is-active {
        .hamburger-inner {
          transform: translate3d(0, ($hamburger-layer-spacing + $hamburger-layer-height) * -1, 0) rotate(-45deg);
          transition-delay: 0.22s;
          transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);

          &::after {
            top: 0;
            opacity: 0;
            transition: top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
            opacity 0.1s 0.22s linear;
          }

          &::before {
            top: 0;
            transform: rotate(-90deg);
            transition: top 0.1s 0.16s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
            transform 0.13s 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
          }
        }
      }
    }
  }

  @if index($hamburger-types, slider) {
    .hamburger--slider {
      .hamburger-inner {
        top: $hamburger-layer-height / 2;

        &::before {
          top: $hamburger-layer-height + $hamburger-layer-spacing;
          transition-property: transform, opacity;
          transition-timing-function: ease;
          transition-duration: 0.15s;
        }

        &::after {
          top: ($hamburger-layer-height * 2) + ($hamburger-layer-spacing * 2);
        }
      }

      &.is-active {
        .hamburger-inner {
          $y-offset: $hamburger-layer-spacing + $hamburger-layer-height;

          transform: translate3d(0, $y-offset, 0) rotate(45deg);

          &::before {
            transform: rotate(-45deg) translate3d($hamburger-layer-width / -7, $hamburger-layer-spacing * -1, 0);
            opacity: 0;
          }

          &::after {
            transform: translate3d(0, $y-offset * -2, 0) rotate(-90deg);
          }
        }
      }
    }
  }

  @if index($hamburger-types, spin) {
    .hamburger--spin {
      .hamburger-inner {
        transition-duration: 0.22s;
        transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);

        &::before {
          transition: top 0.1s 0.25s ease-in,
          opacity 0.1s ease-in;
        }

        &::after {
          transition: bottom 0.1s 0.25s ease-in,
          transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
      }

      &.is-active {
        .hamburger-inner {
          transform: rotate(225deg);
          transition-delay: 0.12s;
          transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);

          &::before {
            top: 0;
            opacity: 0;
            transition: top 0.1s ease-out,
            opacity 0.1s 0.12s ease-out;
          }

          &::after {
            bottom: 0;
            transform: rotate(-90deg);
            transition: bottom 0.1s ease-out,
            transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
          }
        }
      }
    }
  }
</style>
