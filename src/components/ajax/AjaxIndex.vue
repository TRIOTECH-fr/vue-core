<template>
    <b-container fluid>
      <b-row>
        <b-col cols="12">
            <div v-if="loader && isLoading" class="text-center mb-3">
                <slot name="loader">
                    <i class="ti ti-2x ti-spin ti-refresh"></i>
                </slot>
            </div>
            <template :class="{ hidden: !isLoading }">
                <slot v-if="!isLoading" name="list-header"></slot>
                <template v-if="items.length > 0">
                    <table class="table" v-if="renderMode === 'table'">
                        <slot name="header">
                            <tr>
                                <th>{{ $t('table.item') }}</th>
                                <th>{{ $t('table.index') }}</th>
                            </tr>
                        </slot>
                        <slot name="item" v-for="(item, index) in listOverCallBack(items)" :item="item" :index="index">
                            <tr>
                                <td>{{ item }}</td>
                                <td>{{ index }}</td>
                                <slot name="table-action"></slot>
                            </tr>
                        </slot>
                    </table>
                    <b-list-group v-else-if="renderMode === 'list'">
                        <slot name="item" v-for="(item, index) in listOverCallBack(items)" :item="item" :index="index">
                            <b-list-group-item>{{ item }} - {{ index }}</b-list-group-item>
                        </slot>
                    </b-list-group>
                    <div class="mosaic" v-else-if="renderMode === 'mosaic'">
                        <b-row>
                          <slot name="item" v-for="(item, index) in listOverCallBack(items)" :item="item" :index="index">
                              <b-col sm="3">{{ item }} - {{ index }}</b-col>
                          </slot>
                        </b-row>
                    </div>
                    <!-- TODO render custom, render slot -->
                </template>
                <b-alert v-else-if="init" show>{{ $t('pages.' + entityName + '.empty_set') }}</b-alert>
                <slot v-if="!isLoading" name="footer"/>
            </template>
        </b-col>
      </b-row>
      <slot name="modal"/>
    </b-container>
</template>

<script>
  export default {
    name: 'AjaxIndex',
    props: {
      eventId: {
        type: String,
        default: null,
      },
      entityName: {
        type: String,
        default: 'item',
      },
      uri: { type: String,
        required: true,
      },
      method: {
        type: String,
        default: 'get',
      },
      data: {
        type: Object,
      },
      config: {
        type: Object,
        default: () => ({}),
      },
      auth: {
        type: [String, Boolean],
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
        header[this.authHeader] = [this.authPrefix, _.get(this.$store.state, auth)].join(' ').trim();
        this.config.headers = _.extend(header, this.config.headers);
      }
    },
    async mounted() {
      if (this.initLoad) {
        await this.load();
      }

      if (this.eventId !== null) {
        this.$bus.$on(this.event_name('refresh'), this.refresh);
        this.$bus.$on(this.event_name('load'), this.load);
      }
    },
    beforeDestroy() {
      this.$bus.$off(this.event_name('refresh'));
      this.$bus.$off(this.event_name('load'));
    },
    methods: {
      listOverCallBack(list) {
        return this.orderCallBack(list);
      },
      event_name(action) {
        return `t-event.ajax-index.${this.eventId}.${action}`;
      },
      async load() {
        this.isLoading = true;
        const fn = this.$ajax[this.method];
        await fn(this.uri, this.data, this.config).then((items) => {
          this.items = items;
          this.isLoading = false;
          this.init = true;
        });
      },
      refresh_data(dataRef, data) {
        if (typeof dataRef !== 'undefined') {
          _.each(data, (value, key) => {
            if (key !== 'id') {
              if (_.isObject(value) && !_.isArray(value)) {
                this.refresh_data(dataRef[key], value);
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
              this.refresh_data(dataRef, data);
            } else {
              this.$set(this.items, this.items.length, data);
            }
          });
          this.isLoading = false;
          this.init = true;
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

