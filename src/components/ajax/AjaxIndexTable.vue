<template>
  <div class="table-responsive">
    <slot name="table-title"/>
    <table class="table">
      <slot name="table-header">
        <tr>
          <th>{{ $t('table.item') }}</th>
          <th>{{ $t('table.index') }}</th>
        </tr>
      </slot>
      <tr v-for="(item, index) in items" :key="index">
        <slot :item="item" name="item">
          <td>{{ item }}</td>
          <td>{{ index }}</td>
          <slot name="table-action"/>
        </slot>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'AjaxIndexTableComponent',
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
