<!-- TODO REWORK -->
<!--<template>-->
  <!--<div>-->
    <!--<b-card no-body class="mb-1">-->
      <!--<b-card-header header-tag="header" class="p-1" role="tab">-->
        <!--<b-btn-->
          <!--v-b-toggle="name"-->
          <!--block-->
          <!--href="#"-->
          <!--class="text-left"-->
          <!--variant="light"-->
        <!--&gt;{{ title }}</b-btn>-->
      <!--</b-card-header>-->
      <!--<b-collapse v-model="ajaxTableVisible"-->
                  <!--:id="name"-->
                  <!--accordion="my-accordion"-->
                  <!--role="tabpanel">-->
        <!--<b-card-body>-->
          <!--<ajax-index :event-id="uid_ajax_table"-->
                      <!--:init-load="false"-->
                      <!--:uri="uri"-->
                      <!--auth="oauth.access_token">-->
            <!--<tr slot="header">-->
              <!--<th>{{ $t('form.label') }}</th>-->
              <!--<th>&lt;!&ndash; Action &ndash;&gt;</th>-->
            <!--</tr>-->
            <!--<tr slot="item" slot-scope="ctx">-->
              <!--<td>{{ ctx.item.label }}</td>-->
              <!--<td class="text-right">-->
                <!--<b-button-->
                  <!--v-if="isEditable"-->
                  <!--variant="primary"-->
                  <!--size="sm"-->
                  <!--@click="openModal(modalName('edit'), ctx.item)"-->
                <!--&gt;-->
                  <!--<i class="ti ti-fw ti-lg ti-edit"/>-->
                <!--</b-button>-->
                <!--<b-button-->
                  <!--v-if="isDeletable"-->
                  <!--:disabled="_.isFunction(isDeleteDisabled) ? isDeleteDisabled(ctx.item) : isDeleteDisabled"-->
                  <!--variant="danger"-->
                  <!--size="sm"-->
                  <!--@click="openModal(modalName('delete'), ctx.item)"-->
                <!--&gt;-->
                  <!--<i class="ti ti-fw ti-lg ti-trash"/>-->
                <!--</b-button>-->
              <!--</td>-->
            <!--</tr>-->
            <!--<div slot="footer">-->
              <!--<b-btn block variant="success" @click="openModal(modalName('new'))">{{ $t('actions.create') }}</b-btn>-->
            <!--</div>-->
            <!--<template slot="modal">-->
              <!--<t-modal :event-id="modalName('new')" :title="$t(`pages.${name}.new`)">-->
                <!--<ajax-new-->
                  <!--:close-modal="true"-->
                  <!--:ref-modal="modalName('new')"-->
                  <!--:refresh-ajax-index="true"-->
                  <!--:ref-ajax-index="uid_ajax_table"-->
                  <!--:load-on-mount="false"-->
                  <!--:name="name"-->
                <!--/>-->
              <!--</t-modal>-->
              <!--<t-modal :event-id="modalName('edit')" :title="$t(`pages.${name}.edit`)">-->
                <!--<ajax-edit-->
                  <!--:close-modal="true"-->
                  <!--:ref-modal="modalName('edit')"-->
                  <!--:refresh-ajax-index="true"-->
                  <!--:ref-ajax-index="uid_ajax_table"-->
                  <!--:load-on-mount="false"-->
                  <!--:name="name"-->
                <!--/>-->
              <!--</t-modal>-->
              <!--<t-modal :event-id="modalName('delete')" :title="$t(`pages.${name}.delete`)">-->
                <!--<ajax-delete-->
                  <!--:close-modal="true"-->
                  <!--:ref-modal="modalName('delete')"-->
                  <!--:refresh-ajax-index="true"-->
                  <!--:ref-ajax-index="uid_ajax_table"-->
                  <!--:load-on-mount="false"-->
                  <!--:name="name"-->
                <!--/>-->
              <!--</t-modal>-->
            <!--</template>-->
          <!--</ajax-index>-->
        <!--</b-card-body>-->
      <!--</b-collapse>-->
    <!--</b-card>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import AjaxEdit from './ajax/AjaxEdit';-->
  <!--import AjaxNew from './ajax/AjaxNew';-->
  <!--import AjaxIndex from './ajax/AjaxIndex';-->
  <!--import AjaxDelete from './ajax/AjaxDelete';-->
  <!--import TModal from './TModal';-->

  <!--export default {-->
    <!--name: 'CollapseItemComponent',-->
    <!--components: {-->
      <!--AjaxIndex,-->
      <!--AjaxEdit,-->
      <!--AjaxNew,-->
      <!--AjaxDelete,-->
      <!--TModal,-->
    <!--},-->
    <!--props: {-->
      <!--name: {-->
        <!--type: String,-->
        <!--default: '',-->
      <!--},-->
      <!--title: {-->
        <!--type: String,-->
        <!--default: '',-->
      <!--},-->
      <!--uri: {-->
        <!--type: String,-->
        <!--default: '',-->
      <!--},-->
      <!--isDeletable: {-->
        <!--type: Boolean,-->
        <!--default: true,-->
      <!--},-->
      <!--isEditable: {-->
        <!--type: Boolean,-->
        <!--default: true,-->
      <!--},-->
      <!--isDeleteDisabled: {-->
        <!--type: [Boolean, Function],-->
        <!--default: false,-->
      <!--},-->
    <!--},-->
    <!--data() {-->
      <!--return {-->
        <!--uid: this._uid, // eslint-disable-line no-underscore-dangle-->
        <!--ajaxTableVisible: false,-->
      <!--};-->
    <!--},-->
    <!--computed: {-->
      <!--uid_ajax_table() {-->
        <!--return `ajax-table-${this.uid}`;-->
      <!--},-->
    <!--},-->
    <!--watch: {-->
      <!--ajaxTableVisible(oldValue, newValue) {-->
        <!--if (!newValue) {-->
          <!--this.$bus.$emit(`t-event.ajax-index.${this.uid_ajax_table}.refresh`);-->
        <!--}-->
      <!--},-->
    <!--},-->
    <!--methods: {-->
      <!--modalName(action) {-->
        <!--return `${this.name}-${action}-${this.uid}`;-->
      <!--},-->
      <!--openModal(id, data = null) {-->
        <!--this.$bus.$emit(`t-event.t-modal.${id}.open`, data);-->
      <!--},-->
    <!--},-->
  <!--};-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--@import '~@/scss/vars';-->
<!--</style>-->
