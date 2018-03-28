<template>
  <b-list-group>
    <b-list-group-item v-for="(item, index) in items" :key="index">
      <slot :item="item" name="item">
        {{ index }} : {{ item }}
      </slot>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  export default {
    name: 'AjaxIndexListComponent',
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/scss/vars';
</style>
