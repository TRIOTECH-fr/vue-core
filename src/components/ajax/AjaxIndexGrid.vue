<template>
  <div class="mosaic">
    <b-row>
      <b-col v-for="(item, index) in items" :key="index" sm="3">
        <slot :item="item" name="item">
          {{ item }} - {{ index }}
        </slot>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: 'AjaxIndexGridComponent',
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
