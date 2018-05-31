<template>
  <div :class="{ 'form-container': true, 'last-step': isLastStep }">
    <div class="header">
      <b-container>
        <b-row align-v="center">
          <b-col>
            <h2>{{ $t(text.title) }}</h2>
          </b-col>
          <template v-if="hasCounter">
            <b-col cols="4">
              <div class="counter">
                <template v-if="isLastStep">
                  {{ parts.length + 1 }}
                </template>
                <template v-else>
                  <template v-for="(part, idx) in parts">
                    <span :key="idx" :class="{ active: part.isActive }">
                      {{ idx + 1 }}
                    </span>
                  </template>
                </template>
                / {{ parts.length + 1 }}
              </div>
            </b-col>
          </template>
        </b-row>
        <template v-if="hasIntro">
          <b-row>
            <b-col class="intro">
              <template v-if="isLastStep">
                {{ $t(text.recap) }}
              </template>
              <template v-else>
                <div v-html="$t(text.intro)" />
              </template>
            </b-col>
          </b-row>
        </template>
      </b-container>
    </div>
    <b-container>
      <form>
        <div class="group-container">
          <template v-for="(part, idx) in parts">
            <div :key="idx" :class="{ 'form-group': true, active: part.isActive, 'is-inline': isLastStep, simplified: isSimplified }">
              <label :for="part.name">
                {{ $t(part.label) }} {{ part.required ? '*' : '' }}:
              </label>
              <template v-if="part.formType === 'input'">
                <input
                  :id="part.name"
                  :type="part.type"
                  :placeholder="$t(part.placeholder)"
                  :required="part.required"
                  :pattern="part.pattern"
                  :autocomplete="part.name"
                  v-model="contact[part.name]"
                >
                <span v-if="part.text">{{ $t(part.text) }}</span>
              </template>
              <template v-if="part.formType === 'textearea'">
                <!-- TODO fix eslint alert / use attribute placeholder instead ? -->
                <textarea v-autosize="true" v-model="contact[part.name]">
                  {{ $t(part.placeholder) }}
                </textarea>
              </template>
              <template v-if="part.formType === 'select'">
                <vue-multiselect
                  :id="part.name"
                  :options="part.options"
                  :placeholder="$t(`placeholders.${part.name}.${part.multiple ? 'multiple' : 'single'}`)"
                  :multiple="part.multiple"
                  :close-on-select="true"
                  :hide-selected="false"
                  :clear-on-select="true"
                  v-model="contact[part.name]"
                  label="label"
                  track-by="value"
                />
              </template>
            </div>
          </template>
          <div ref="error" :class="{ errors: true, display : hasError }" />
        </div>
        <b-row>
          <template v-if="isSimplified">
            <div class="text-left">
              <b-button type="submit" class="round-btn" @click="onNextFormClick">
                <span class="d-none d-sm-block float-left">{{ $t('actions.send') }}</span>
                <!-- <i class="fa fa-paper-plane"></i> -->
                <icon name="paper-plane"/>
              </b-button>
            </div>
          </template>
          <template v-else>
            <b-col v-if="!isFirstStep" :cols="6">
              <div class="text-left">
                <b-button type="button" class="round-btn" @click="onPrevFormClick">
                  <i class="ti ti-lg ti-arrow-left"/>
                  <span class="d-none d-sm-block float-right">{{ $t('actions.prev') }}</span>
                </b-button>
              </div>
            </b-col>
            <b-col>
              <div class="text-right">
                <b-button type="submit" class="round-btn" @click="onNextFormClick">
                  <span class="d-none d-sm-block float-left">{{ $t(button.next.text) }}</span>
                  <i class="ti ti-lg ti-arrow-right"/>
                </b-button>
              </div>
            </b-col>
          </template>
        </b-row>
      </form>
    </b-container>
  </div>
</template>

<script>
  import VueMultiselect from 'vue-multiselect';
  import 'vue-awesome/icons/paper-plane';

  export default {
    name: 'FormTypeComponent',
    components: {
      VueMultiselect,
    },
    model: {
      prop: 'button',
      event: 'change',
    },
    props: {
      hasCounter: {
        type: Boolean,
        default: false,
      },
      hasIntro: {
        type: Boolean,
        default: false,
      },
      text: {
        type: Object,
        default: () => ({}),
      },
      isSimplified: {
        type: Boolean,
        default: true,
      },
      parts: {
        type: Array,
        default: () => [],
      },
      button: {
        type: Object,
        default: () => ({}),
      },
      contact: {
        type: Object,
        default: () => ({}),
      },
      postUri: {
        type: String,
        default: 'public/contact/',
      },
    },
    data() {
      return {
        hasError: false,
        active: 0,
        internalButton: {},
      };
    },
    computed: {
      isFirstStep() {
        return this.active === 0;
      },
      isLastStep() {
        return this.active === this.parts.length;
      },
    },
    watch: {
      button: {
        deep: true,
        immediate: true,
        handler(nv, ov) {
          this.$set(this, 'internalButton', nv);
        },
      },
      internalButton(nv) {
        this.$emit('change', nv);
      },
    },
    methods: {
      send() {
        this.$ajax.post(this.postUri, {
          contact: this._.clone(this.contact),
        }).then((data) => {
          if (data.status) {
            this.$notify({ title: this.$t('flashes.contact.sent_title'), text: this.$t('flashes.contact.sent'), type: 'success' });
          } else {
            this.$notify({ title: this.$t('flashes.contact.not_sent_title'), text: this.$t('flashes.contact.not_sent'), type: 'error' });
          }
        }, () => {
          this.$notify({ title: this.$t('flashes.contact.server_error_title'), text: this.$t('flashes.contact.server_error'), type: 'error' });
        });
      },
      onPrevFormClick() {
        const { active, parts } = this;
        const current = parts[active];
        const index = active - 1;

        current.isActive = false;
        parts[index].isActive = true;
        this.hasError = false;

        this.active = index;
      },
      onNextFormClick() {
        const { active, parts } = this;
        const current = parts[active];
        let index = active + 1;

        if (current) {
          // TODO iterates of all active parts instead of the current for isSimplified
          if (current.required && this.contact[current.name] === '') {
            this.$refs.error.innerHTML = this.$t('errors.form');
            this.hasError = true;
            return;
          }

          if (current.pattern && (current.pattern).test(this.contact[current.name]) === false) {
            this.$refs.error.innerHTML = this.$t('errors.wrong_email');
            this.hasError = true;
            return;
          }

          this.hasError = false;
          current.isActive = false;
        }

        if (index === parts.length) {
          this._.each(parts, (part) => {
            part.isActive = true;
          });

          // Not update props ...
          // this.$set(this.button.next, 'text', 'actions.send');
          this.$set(this.internalButton, 'next.text', 'actions.send');
        } else if (index > parts.length || this.isSimplified) {
          this.send();
          this.$parent.$parent.close();
          this._.each(this.contact, (value, key) => this.$set(this.contact, key, ''));
          // Not update props ...
          // if (this.button) {
          //   this.$set(this.button.next, 'text', 'actions.next');
          // }

          if (this.internalButton) {
            this.$set(this.internalButton, 'next.text', 'action.next');
          }

          index = 0;
          this._.each(parts, (part, idx) => {
            part.isActive = idx === 0;
          });
        }

        if (parts[index]) {
          parts[index].isActive = true;
        }

        this.active = index;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/scss/vars';
  @import '../scss/media';
  @import '../scss/compass';
  @import 'compass/css3/transform';
  @import 'compass/css3/transition';
  @import 'compass/css3/user-interface';

  .hidden {
    display: none;
  }

  .form-container {
    color: $white;
    text-align: left;

    &.last-step {
      h2,
      .counter {
        font-size: 1.8rem;
      }

      .header {
        .row {
          margin-bottom: $margin-bottom - 4;
        }
      }

      .group-container .form-group {
        &.is-inline {
          margin: 0 1% 1rem 1%;
        }

        label {
          font-size: 1rem;
          margin-bottom: 1rem;
        }
      }

      button.round-btn {
        margin-top: 0;
      }
    }

    .header {
      .row {
        margin-bottom: $margin-bottom - 2;
      }
    }

    h2 {
      text-align: left;
      text-transform: uppercase;
      margin: 0;
      font-size: 2.5rem;
    }

    .errors {
      display: none;
      color: red;

      &.display {
        display: block;
      }
    }

    button.round-btn {
      border-radius: 30px;
      background-color: $white;
      color: $grey;
      border-color: $orange;
      padding: 10px 50px;
      text-transform: uppercase;
      margin-top: 3rem;
      cursor: pointer;

      i.ti-arrow-left {
        margin-right: 20px;
        margin-left: -20px;
      }

      i.ti-arrow-right {
        margin-left: 20px;
        margin-right: -20px;
      }
    }

    .counter {
      color: $white;
      font-size: 2.5rem;
      position: relative;
      text-align: right;

      span {
        position: absolute;
        right: 50px;
        visibility: hidden;
        opacity: 0;

        @include transform(translateY(-100%));
        @include transition(transform .3s);

        &.active {
          visibility: visible;
          opacity: 1;

          @include transform(translateY(0%));
        }
      }
    }

    .intro {
      font-size: 1.5rem;
    }

    .group-container {
      min-height: 200px;
      position: relative;


      .form-group {
        min-height: 100px;
        margin-top: 2rem;
        margin-bottom: 3rem;
        position: absolute;
        visibility: hidden;
        opacity: 0;
        width: 100%;
        top: 0;
        left: 100%;

        &.is-inline {
          position: static;
          width: 48%;
          display: inline-block;
          margin: 2rem 1% 3rem 1%;
        }

        &.active {
          visibility: visible;
          opacity: 1;
          left: 0;
          @include transition(left 0.5s, opacity 0.5s);
        }

        &.simplified {
          visibility: visible;
          opacity: 1;
          position: static;
        }

        label {
          color: $white;
          display: block;
          width: 100%;
          text-align: left;
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }

        textarea {
          border: 2px solid $white !important;
          padding: 10px !important;
        }

        input,
        textarea {
          width: 100%;
          border: 0;
          border-bottom: 2px solid $white;
          background-color: transparent;
          padding: 10px 0;
          font-size: 1rem;

          @include input-placeholder {
            color: $grey;
            font-style: italic;
          }

          &[type="checkbox"] {
            width: auto;
          }

          &:focus {
            outline: 1px solid transparent;
          }
        }

        input:-webkit-autofill,
        textarea:-webkit-autofill,
        select:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px $orange inset;
        }
      }
    }
  }

  @include editable-min-width(576px) {
    button.round-btn {
      svg.fa-icon {
        margin-left: 10px;
      }
    }
  }

  @include editable-max-width(768px) {
    .form-container {
      .header {
        .row {
          margin-bottom: $margin-bottom - 4;
        }
      }

      h2,
      .counter {
        font-size: 1.8rem;
      }

      .intro {
        font-size: 1rem;
      }

      .group-container {
        .form-group {
          label {
            font-size: 1.2rem;
          }
        }
      }

      .errors {
        font-size: 0.9rem;
      }

      button.round-btn {
        margin-top: 1rem;
        padding: 10px 20px;

        i.ti-arrow-left {
          margin-left: 0;
        }

        i.ti-arrow-right {
          margin-right: 0;
        }
      }
    }
  }
</style>
