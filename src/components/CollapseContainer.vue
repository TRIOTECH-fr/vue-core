<template>
  <b-col>
    <collapse-item
      v-for="item in data"
      :key="item.name"
      :name="item.name"
      :title="item.title"
      :uri="item.uri"
      :is-deletable="item.isDeletable"
      :is-editable="item.isEditable"
      :is-delete-disabled="item.isDeleteDisabled"
    />
  </b-col>
</template>

<script>
  import CollapseItem from './CollapseItem';

  export default {
    name: 'CollapseContainerComponent',
    components: {
      CollapseItem,
    },
    props: {
      data: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/scss/vars';
</style>
