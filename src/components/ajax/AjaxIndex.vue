<template>
  <div class="w-100">
    <slot v-if="!isLoading" name="header"/>
    <div v-if="loader && isLoading" class="text-center mb-3">
      <slot name="loader">
        <i class="ti ti-2x ti-spin ti-refresh"/>
      </slot>
    </div>
    <template v-else-if="items.length > 0">
      <!-- <ajax-index-grid v-if="isGridRenderMode" slot="item" :items="mapItems" /> -->
      <div v-if="isGridRenderMode" class="mosaic">
        <b-row>
          <b-col v-for="(item, index) in items" :key="index" sm="3">
            <slot :item="item" name="item">
              {{ item }} - {{ index }}
            </slot>
          </b-col>
        </b-row>
      </div>
      <!-- <ajax-index-list v-else-if="isListRenderMode" slot="item" :items="mapItems" /> -->
      <b-list-group v-else-if="isListRenderMode">
        <b-list-group-item v-for="(item, index) in items" :key="index">
          <slot :item="item" name="item">
            {{ index }} : {{ item }}
          </slot>
        </b-list-group-item>
      </b-list-group>
      <!-- <ajax-index-table v-else-if="isTableRenderMode" slot="item" :items="mapItems" /> -->
      <div v-else-if="isTableRenderMode" class="table-responsive">
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
      <!--  -->
      <template v-else>
        <slot
          v-for="(item, index) in mapItems"
          :item="item"
          :index="index"
          name="item"
        />
      </template>
    </template>
    <b-alert v-else show>{{ $t(`pages.${entity}.empty_set`) }}</b-alert>
    <slot v-if="!isLoading" name="footer"/>
  </div>
</template>

<script>
  import AbstractAjax from './AbstractAjax';
  import AjaxIndexGrid from './AjaxIndexGrid.vue';
  import AjaxIndexList from './AjaxIndexList.vue';
  import AjaxIndexTable from './AjaxIndexTable.vue';

  export default {
    name: 'AjaxIndexComponent',
    components: {
      AjaxIndexGrid,
      AjaxIndexList,
      AjaxIndexTable,
    },
    mixins: [
      AbstractAjax,
    ],
    props: {
      method: {
        type: String,
        default: 'get',
      },
      loader: {
        type: Boolean,
        default: true,
      },
      renderMode: {
        type: String,
        default: 'none',
      },
      callback: {
        type: Function,
        default: args => args,
      },
    },
    data() {
      return {
        items: [],
      };
    },
    computed: {
      mapItems() {
        return this.callback(this.items);
      },
      isTableRenderMode() {
        return this.renderMode === 'table';
      },
      isListRenderMode() {
        return this.renderMode === 'list';
      },
      isGridRenderMode() {
        return this.renderMode === 'grid';
      },
    },
    async mounted() {
      this.on('refresh', this.refresh);
      this.on('load', this.load);
    },
    methods: {
      async load(reset = true) {
        this.emit('loading');
        const items = await this.ajax();
        if (reset) {
          this.items = items;
        } /* else {
          this.emit('reset', items);
        } */
        this.$nextTick(this.emit.bind(this, 'loaded'));
        return items;
      },
      async refresh() {
        this.load(false).then((items) => {
          this.handleDeletions(items);
          this.handleUpdates(items);
        });
        // this.once('reset', (items) => {
        //   this.handleDeletions(items);
        //   this.handleUpdates(items);
        // });
      },
      handleDeletions(items) {
        if (items.length < this.items.length) {
          const deletedItems = this._.differenceWith(this.items, items, (x, y) => x.id === y.id);
          this._.each(deletedItems, (deletedItem) => {
            this.$delete(this.items, this._.findIndex(this.items, deletedItem));
          });
        }
      },
      handleUpdates(items) {
        const set = this._.Y(next => (current, previous) => {
          if (!this._.isUndefined(current)) {
            this._.each(previous, (value, key) => {
              if (key !== 'id') {
                if (this._.isObject(value) && !this._.isArray(value)) {
                  next(current[key], value);
                } else {
                  this.$set(current, key, value);
                }
              }
            });
          }
        });

        const updatedItems = this.differenceObj(items, this.items, true);
        this._.each(updatedItems, (updatedItem) => {
          const item = this.items.find(x => x.id === updatedItem.id);
          // TODO factorize if-else
          if (!this._.isUndefined(item)) {
            set(item, updatedItem);
          } else {
            this.$set(this.items, this.items.length, updatedItem);
          }
        });
      },
    },
  };
</script>

<style lang="scss">
  .alert.alert-info {
    margin-top: 1rem;
  }
</style>

