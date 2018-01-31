<template>
  <b-col>
    <collapse-item v-for="item in data" :key="item.name" :name="item.name" :title="item.title" :uri="item.uri" :isDeletable="item.isDeletable" :isEditable="item.isEditable" />
  </b-col>
</template>

<script>
  import CollapseItem from '@triotech/vue-core/src/components/CollapseItem';

  export default {
    name: 'CollapseContainerComponent',
    components: {
      CollapseItem,
    },
    props: {
      data: {
        type: Array,
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/scss/vars';
</style>
