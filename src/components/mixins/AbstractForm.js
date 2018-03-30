import AbstractAjax from './AbstractAjax';

export default {
  mixins: [
    AbstractAjax,
  ],
  props: {
    id: {
      type: [Number, String],
      default: null,
    },
    filteredFields: {
      type: Array,
      default: () => [],
    },
    submitButtonDisabled: {
      type: Boolean,
      default: false,
    },
    formClass: {
      type: String,
      default: '',
    },
    fetchForm: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      model: {},
      previousModel: {},
      schema: {
        fields: [],
      },
      timestamp: this.$moment().valueOf(),
    };
  },
  computed: {
    formId() {
      return `${this.name}-${this.entity}`;
    },
    formKey() {
      return `${this.name}-${this.timestamp}`;
    },
    isSubmitButtonDisabled() {
      return this.submitButtonDisabled || this._.isEmpty(this.differenceObj(this.model, this.previousModel));
    },
  },
  mounted() {
    this.on('submit', this.submit);
  },
  methods: {
    form() {
      if (!this.fetchForm) {
        return true;
      }
      return this.$ajax.get(this.uri, this.model, this.config);
    },
    clearModelForForm(baseModel = {}, baseSchema = {}, modelTemp = {}, keepIdentifier = true, identifier = 'id') {
      const format = (stack, key) => (stack ? `${stack}[${key}]` : key);
      const formFields = this._.reduce(baseSchema, (carry, field) => {
        carry.push(field.model);
        return carry;
      }, keepIdentifier ? [identifier] : []);

      return this._.Y(next => (obj, models, stack = '') => {
        this._.map(obj, (value, key) => {
          const keyName = format(stack, key);
          if (!formFields.includes(keyName)) {
            if (this._.isObject(value) && !this._.isArray(value)) {
              next(value, models, keyName);
            } else {
              delete obj[key];
            }
          }
        });
        return obj;
      })(this._.Y(next => (object = {}, base = {}) => {
        this._.map(base, (currentObj, key) => {
          if ({}.hasOwnProperty.call(object, key)) {
            if (this._.isObject(currentObj) && !(currentObj instanceof Blob)) {
              // Do not simplify by object[key] == object[key] || {} !
              if (this._.isNull(object[key])) {
                object[key] = {};
              }
              next(object[key], currentObj);
            }
          } else {
            object[key] = null;
          }
        });
        return object;
      })(baseModel, modelTemp), formFields);
    },
    handleFields(fields) {
      return this._.each(this._.filter(fields, field => this.filteredFields.indexOf(field.model) === -1), (field) => {
        // TODO https://github.com/vue-generators/vue-form-generator/issues/352
        field.label = this.$t(field.label);
        field.placeholder = this.$t(field.placeholder);

        if (field.hint) {
          field.hint = this.$t(field.hint);
        }

        if (field.type === 'radios') {
          this._.each(field.values, (choice) => {
            choice.label = this.$t(choice.label);
          });
        }

        if (field.choices !== undefined) {
          this._.each(field.choices, (choice) => {
            if (choice.label !== undefined) {
              choice.label = this.$t(choice.label);
            }
            if (choice.name !== undefined) {
              choice.name = this.$t(choice.name);
            }
          });
        }
      });
    },
  },
};
