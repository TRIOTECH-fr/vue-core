import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import Multiselect from '../../vue-multiselect';
import Mixins from './mixins';

const parent = _.clone(VueFormGenerator.component.components.fieldVueMultiSelect);

Vue.component('fieldDropdown', _.merge({}, parent, {
  components: {
    Multiselect,
  },
  mixins: Mixins,
  data() {
    return {
      internalValue: null,
    };
  },
  computed: {
    value: {
      get() {
        return this.internalValue || this.realValue;
      },
    },
    realValue() {
      return parent.mixins[0].computed.value.get.call(this);
    },
    rawValue() {
      return this.trackValue(this.internalValue);
    },
    selectOptions() {
      return this._.extend({
        'id': this.schema.id,
        'trackBy': 'id',
        'label': 'label',
        'selectLabel': this.$t('vms.select'),
        'selectGroupLabel': this.$t('vms.select_group'),
        'selectedLabel': this.$t('vms.selected'),
        'deselectLabel': this.$t('vms.deselect'),
        'deselectGroupLabel': this.$t('vms.deselect_group'),
        'placeholder': this.$t('vms.placeholder'),
        'tagPlaceholder': this.$t('vms.tag_placeholder'),
        'noResult': this.$t('vms.no_result'),
        'maxElements': this.$t('vms.max_elements'),
      }, this.schema.selectOptions);
    },
    options() {
      return parent.computed.options.call(this) || this.schema.choices;
    },
  },
  created() {
    const keys = this._.keys(this._.first(this.schema.choices));
    const internalValues = this._.map(this._.castArray(this.realValue), (realValue) => this._.mapValues(this._.pick(realValue, keys), String));

    this.internalValue = this.selectOptions.multiple ? internalValues : this._.first(internalValues);
    this.setModelValueByPath(this.schema.model, this.trackValue(this.realValue));
  },
  mounted() {
    this.setRequired();
  },
  updated() {
    if (this._.isUndefined(this.realValue)) {
      this.internalValue = this.realValue;
    }
    this.setRequired();
  },
  methods: {
    setRequired(attribute = 'required') {
      if (this.schema.required) {
        const required = !this.internalValue || this._.isEmpty(this._.castArray(this.internalValue));
        // TODO remove required hack (https://github.com/shentao/vue-multiselect/issues/104)
        const inputNode = this.$el.children[1].children[2];
        if (required) {
          inputNode.setAttribute(attribute, attribute);
        } else {
          inputNode.removeAttribute(attribute);
        }
      }
    },
    updateSelected(value, id) {
      this.internalValue = value;

      this.setModelValueByPath(this.schema.model, this.rawValue);

      this.$nextTick(this.$bus.$emit.bind(this.$bus, 't-event.multiselect-change', {
        value: this.value,
      }));
    },
    trackValue(values) {
      if (values === null) return null;
      const { trackBy, multiple } = this.selectOptions;
      const rawValue = this._.map(_.castArray(values), (value) => String(value && trackBy ? value[trackBy] : value));
      return rawValue.length > 0 && !multiple ? this._.first(rawValue) : rawValue;
    },
  },
}));
