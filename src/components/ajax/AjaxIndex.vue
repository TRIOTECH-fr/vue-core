<template>
  <div class="w-100">
    <div v-if="loader && isLoading" class="text-center mb-3">
      <slot name="loader">
        <i class="ti ti-2x ti-spin ti-refresh"/>
      </slot>
    </div>
    <template :class="{ hidden: !isLoading }">
      <slot v-if="!isLoading" name="list-header"/>
      <template v-if="items.length > 0">
        <div v-if="renderMode === 'table'" class="table-responsive">
          <slot name="table-title"/>
          <table class="table">
            <slot name="header">
              <tr>
                <th>{{ $t('table.item') }}</th>
                <th>{{ $t('table.index') }}</th>
              </tr>
            </slot>
            <slot
              v-for="(item, index) in listOverCallBack(items)"
              :item="item"
              :index="index"
              name="item"
            >
              <tr :key="item.id">
                <td>{{ item }}</td>
                <td>{{ index }}</td>
                <slot name="table-action"/>
              </tr>
            </slot>
          </table>
        </div>
        <b-list-group v-else-if="renderMode === 'list'">
          <slot
            v-for="(item, index) in listOverCallBack(items)"
            :item="item"
            name="item"
            index="index"
          >
            <b-list-group-item>{{ item }} - {{ index }}</b-list-group-item>
          </slot>
        </b-list-group>
        <div v-else-if="renderMode === 'mosaic'" class="mosaic">
          <b-row>
            <slot
              v-for="(item, index) in listOverCallBack(items)"
              :item="item"
              :index="index"
              name="item"
            >
              <b-col sm="3">{{ item }} - {{ index }}</b-col>
            </slot>
          </b-row>
        </div>
        <!-- TODO render custom, render slot -->
      </template>
      <b-alert v-else-if="init" show>{{ $t(`pages.${entityName}.empty_set`) }}</b-alert>
      <slot v-if="!isLoading" name="footer"/>
    </template>
    <slot name="modal"/>
  </div>
</template>

<script>
  export default {
    name: 'AjaxIndex',
    props: {
      entityUniqueKey: {
        type: String,
        default: 'id',
      },
      eventId: {
        type: String,
        default: null,
      },
      entityName: {
        type: String,
        default: 'item',
      },
      uri: {
        type: String,
        required: true,
      },
      method: {
        type: String,
        default: 'get',
      },
      data: {
        type: Object,
        default: () => ({}),
      },
      config: {
        type: Object,
        default: () => ({}),
      },
      auth: {
        type: [Boolean, String],
        default: true,
      },
      authHeader: {
        type: String,
        default: 'Authorization',
      },
      authPrefix: {
        type: String,
        default: 'Bearer',
      },
      loader: {
        type: Boolean,
        default: true,
      },
      initLoad: {
        type: Boolean,
        default: true,
      },
      renderMode: {
        type: String,
        default: 'table',
      },
      orderCallBack: {
        type: Function,
        default: list => list,
      },
    },
    data() {
      return {
        init: false,
        isLoading: false,
        items: [],
      };
    },
    created() {
      const auth = _.isBoolean(this.auth) ? 'access_token' : this.auth;
      if (auth) {
        const header = {};
        header[this.authHeader] = [this.authPrefix, _.get(this.get(), auth)].join(' ').trim();
        this.config.headers = _.extend(header, this.config.headers);
      }
    },
    async mounted() {
      if (this.initLoad) {
        await this.load();
      }

      if (this.eventId !== null) {
        this.$bus.$on(this.eventName('refresh'), this.refresh);
        this.$bus.$on(this.eventName('load'), this.load);
      }
    },
    beforeDestroy() {
      this.$bus.$off(this.eventName('refresh'));
      this.$bus.$off(this.eventName('load'));
    },
    methods: {
      listOverCallBack(list) {
        return this.orderCallBack(list);
      },
      eventName(action) {
        return `t-event.ajax-index.${this.eventId}.${action}`;
      },
      async load() {
        this.isLoading = true;
        const fn = this.$ajax[this.method];
        const items = await fn(this.uri, this.data, this.config);
        this.items = items;
        this.isLoading = false;
        this.init = true;
        this.$bus.$emit('t-event.ajax-index.load-data-success', this.items);
      },
      refreshData(dataRef, data) {
        if (typeof dataRef !== 'undefined') {
          _.each(data, (value, key) => {
            if (key !== 'id') {
              if (_.isObject(value) && !_.isArray(value)) {
                this.refreshData(dataRef[key], value);
              } else {
                this.$set(dataRef, key, value);
              }
            }
          });
        }
      },
      async refresh() {
        this.isLoading = true;
        const fn = this.$ajax[this.method];
        await fn(this.uri, this.data, this.config).then((items) => {
          if (items.length < this.items.length) {
            const deletedData = _.differenceWith(this.items, items, (x, y) => x.id === y.id);
            deletedData.forEach((data) => {
              this.$delete(this.items, _.findIndex(this.items, data));
            });
          }
          const updatedData = _.differenceObj(items, this.items, true);
          updatedData.forEach((data) => {
            const dataRef = this.items.find(x => x.id === data.id);
            if (typeof dataRef !== 'undefined') {
              this.refreshData(dataRef, data);
            } else {
              this.$set(this.items, this.items.length, data);
            }
          });
          this.isLoading = false;
          this.init = true;
          this.$bus.$emit('t-event.ajax-index.load-data-success', this.items);
        });
      },
    },
  };
</script>

<style lang="scss">
  .hidden {
    display: none;
  }

  .alert.alert-info {
    margin-top: 1rem;
  }
</style>

