<template>
  <div>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-btn block href="#" class="text-left" v-b-toggle="name" variant="light">{{ title }}</b-btn>
      </b-card-header>
      <b-collapse v-model="ajaxTableVisible" :id="name" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <ajax-index :eventId="uid_ajax_table" :initLoad="false" :uri="uri" auth="oauth.access_token">
            <tr slot="header">
              <th>{{ $t('form.label') }}</th>
              <th><!--Action--></th>
            </tr>
            <tr slot="item" slot-scope="ctx">
              <td>{{ ctx.item.label }}</td>
              <td class="text-right">
                <b-button v-if="isEditable" @click="openModal(modal_name('edit'), ctx.item)" variant="primary" size="sm">
                  <i class="ti ti-fw ti-lg ti-edit"></i>
                </b-button>
                <b-button v-if="isDeletable" @click="openModal(modal_name('delete'), ctx.item)" :disabled="(typeof ctx.item.companies_count !== 'undefined' && ctx.item.companies_count > 0) || (typeof ctx.item.sites_count !== 'undefined' && ctx.item.sites_count > 0)" variant="danger" size="sm">
                  <i class="ti ti-fw ti-lg ti-trash"></i>
                </b-button>
              </td>
            </tr>
            <div slot="footer">
              <b-btn block @click="openModal(modal_name('new'))" variant="success">{{ $t('actions.create') }}</b-btn>
            </div>
            <template slot="modal">
              <t-modal :eventId="modal_name('new')" :title="$t(`pages.${name}.new`)">
              <ajax-new
                :closeModal="true"
                :refModal="modal_name('new')"
                :refreshAjaxIndex="true"
                :refAjaxIndex="uid_ajax_table"
                :loadOnMount="false"
                :name="name"
              />
            </t-modal>
            <t-modal :eventId="modal_name('edit')" :title="$t(`pages.${name}.edit`)">
              <ajax-edit
                :closeModal="true"
                :refModal="modal_name('edit')"
                :refreshAjaxIndex="true"
                :refAjaxIndex="uid_ajax_table"
                :loadOnMount="false"
                :name="name"
              />
            </t-modal>
            <t-modal :eventId="modal_name('delete')" :title="$t(`pages.${name}.delete`)">
              <ajax-delete
                :close-modal="true"
                :refModal="modal_name('delete')"
                :refreshAjaxIndex="true"
                :refAjaxIndex="uid_ajax_table"
                :loadOnMount="false"
                :name="name"
              />
            </t-modal>
            </template>
          </ajax-index>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
  import AjaxEdit from '@triotech/vue-core/src/components/ajax/AjaxEdit';
  import AjaxNew from '@triotech/vue-core/src/components/ajax/AjaxNew';
  import AjaxIndex from '@triotech/vue-core/src/components/ajax/AjaxIndex';
  import AjaxDelete from '@triotech/vue-core/src/components/ajax/AjaxDelete';
  import TModal from '@triotech/vue-core/src/components/TModal';

  export default {
    name: 'CollapseItemComponent',
    components: {
      AjaxIndex,
      AjaxEdit,
      AjaxNew,
      AjaxDelete,
      TModal,
    },
    props: {
      name: {
        type: String,
      },
      title: {
        type: String,
      },
      uri: {
        type: String,
      },
      isDeletable: {
        type: Boolean,
        default: true,
      },
      isEditable: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        // eslint-disable-next-line no-underscore-dangle
        uid: this._uid,
        ajaxTableVisible: false,
      };
    },
    watch: {
      ajaxTableVisible(oldValue, newValue) {
        if (!newValue) {
          this.$bus.$emit(`t-event.ajax-index.${this.uid_ajax_table}.refresh`);
        }
      },
    },
    computed: {
      uid_ajax_table() {
        return `ajax-table-${this.uid}`;
      },
    },
    methods: {
      modal_name(action) {
        return `${this.name}-${action}-${this.uid}`;
      },
      openModal(id, data = null) {
        this.$bus.$emit(`t-event.t-modal.${id}.open`, data);
      },
    },
  };
</script>

<style lang="scss" scoped>
@import '~@/scss/vars';
</style>
