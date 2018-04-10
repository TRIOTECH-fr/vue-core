<template>
  <div>
    <sweet-modal
      :ref="modalUid"
      :title="title"
      :width="width"
      :class="klass"
      class="modal-form"
      @open="onModalOpen"
      @close="onModalClose"
    >
      <slot />
    </sweet-modal>
  </div>
</template>

<script>
  export default {
    name: 'TModal',
    props: {
      eventId: {
        type: String,
        default: null,
      },
      title: {
        type: String,
        default: null,
      },
      width: {
        type: String,
        default: null,
      },
      klass: {
        type: String,
        default: '',
      },
    },
    computed: {
      modalUid() {
        return `${this._uid}_modal`; // eslint-disable-line no-underscore-dangle
      },
      modalRef() {
        return this.$refs[this.modalUid];
      },
    },
    mounted() {
      if (this.eventId !== null) {
        this.$bus.$on([this.eventName('open'), this.eventName('close')], this.catchModalArguments);
        this.$bus.$on(this.eventName('open'), this.modalRef ? this.modalRef.open : this._.noop);
        this.$bus.$on(this.eventName('close'), this.modalRef ? this.modalRef.close : this._.noop);
      }
    },
    beforeDestroy() {
      if (this.eventId !== null) {
        this.$off([this.eventName('open'), this.eventName('close')]);
      }
    },
    methods: {
      onModalOpen() {
        this.$bus.$emit(this.eventName('opened'), ...this.modalRef.args);
      },
      onModalClose() {
        if (this.modalRef.is_open) {
          this.$bus.$emit(this.eventName('closed'), ...this.modalRef.args);
        }
      },
      eventName(action) {
        return `t-event.t-modal.${this.eventId}.${action}`;
      },
      catchModalArguments(...args) {
        if (this.modalRef) {
          this.modalRef.args = args || [];
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  /deep/ .sweet-modal {
    .sweet-title > h2 {
      line-height: 64px !important;
      margin: 0 !important;
    }
  }
</style>
