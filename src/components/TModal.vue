<template>
    <sweet-modal @open="modal_open" @close="modal_close" :ref="modal_uid" class="modal-form" :title="title">
        <slot>

        </slot>
    </sweet-modal>
</template>

<script>
  export default {
    name: 't-modal',
    props: {
      eventId: {
        type: String,
        default: null,
      },
      title: {
        type: String,
        default: null,
      },
    },
    mounted() {
      if (this.eventId !== null) {
        this.$bus.$on(this.event_name('open'), this.open_modal);
        this.$bus.$on(this.event_name('close'), this.close_modal);
      }
    },
    beforeDestroy() {
      this.$off(this.event_name('open'));
      this.$off(this.event_name('close'));
    },
    computed: {
      modal_uid() {
        // eslint-disable-next-line no-underscore-dangle
        return `${this._uid}_modal`;
      },
      modal_state() {
        return this.$refs[this.modal_uid].is_open;
      },
    },
    methods: {
      modal_open() {
        this.$bus.$emit(this.event_name('opened'));
      },
      modal_close() {
        this.$bus.$emit(this.event_name('closed'));
      },
      event_name(action) {
        return `t-event-t-modal-${this.eventId}-${action}`;
      },
      open_modal() {
        this.$refs[this.modal_uid].open();
      },
      close_modal() {
        this.$refs[this.modal_uid].close();
      },
    },
  };
</script>

<style scoped>

</style>
