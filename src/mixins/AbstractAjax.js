export default {
  props: {
    apiPath: {
      type: String,
      default: null,
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    entity: {
      type: String,
      default: 'entity',
    },
    loadOnMount: {
      type: Boolean,
      default: true,
    },
    notificationSuccessText: {
      type: String,
      default: '',
    },
    auth: {
      type: Boolean,
      default() {
        return this.$config.get('auth') !== false;
      },
    },
    authHeaderName: {
      type: String,
      default() {
        return this._.toString(this._.get(this.$config.get('auth'), 'header_name', 'Authorization'));
      },
    },
    authHeaderValuePrefix: {
      type: String,
      default() {
        return this._.toString(this._.get(this.$config.get('auth'), 'header_value_prefix', 'Bearer'));
      },
    },
    authHeaderValuePath: {
      type: String,
      default() {
        return this._.toString(this._.get(this.$config.get('auth'), 'header_value_path', 'oauth.access_token'));
      },
    },
  },
  computed: {
    uri() {
      return `${this.apiPath}${this._.template(this.path, { interpolate: /{:([\s\S]+?)}/g })({ id: this.id })}`;
    },
    name() {
      return this.$options._componentTag || ''; // eslint-disable-line no-underscore-dangle
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  mounted() {
    if (this.loadOnMount) {
      this.load();
    }
  },
  beforeDestroy() {
    this.off();
  },
  created() {
    if (this.auth) {
      const authHeaderValue = this._.get(this.get(), this.authHeaderValuePath);
      this._.extend(this.config, {
        headers: {
          [this.authHeaderName]: [this.authHeaderValuePrefix, authHeaderValue].join(' ').trim(),
        },
      });
    }
  },
  methods: {
    ajax(model) {
      const ajaxModel = model || this.model;
      const { method } = this;
      const fn = this.$ajax[method];

      if (!this._.isFunction(fn) || (method !== this.$ajax.httpGet.toLowerCase() && this._.isEmpty(ajaxModel))) {
        return false;
      }

      return fn(this.uri, ajaxModel, this.config).then((data) => {
        if (this._.has(data, 'status')) {
          if (data.status === 'ok') {
            this.$notify({
              title: this.flash('create_title'),
              text: this._.isEmpty(this.notificationSuccessText) ? this.flash('create') : this.notificationSuccessText,
              type: 'success',
            });
          } else {
            this.$notify({
              title: this.flash('create_title'),
              text: this.flash('not_create'),
              type: 'error',
            });
          }
        }
        return data;
      }).catch((error) => {
        const { data } = error.response;
        const code = data.error && data.error.code;
        if (code === 400) {
          const errors = this._.reduce(data.errors.children, (carry, value, key) => {
            if (value.errors) {
              carry[key] = value.errors;
            }
            return carry;
          }, {});

          let flashTitle = '';
          let flashText = '';

          this._.each(errors, (errorFields, field) => {
            flashTitle = this.flash(`error.${field}`);

            this._.each(errorFields, (errorField) => {
              flashText = `${errorField} <br /> ${flashText}`;
            });
          });

          this.$notify({
            title: flashTitle,
            text: flashText,
            type: 'warning',
          });
        } else if (code === 500) {
          this.$notify({
            title: this.flash('error_500_title'),
            text: this.flash('error_500'),
            type: 'error',
          });
        }
        return error;
      });
    },
    flash(event) {
      return this.$t(`flashes.${this.event(event)}`);
    },
    event(event) {
      return `${this.name}.${this.entity}.${event}`;
    },
    mapEvent(event) {
      return this._.isArray(event) ? this._.map(event, this.event) : this.event(event);
    },
    emit(event, ...args) {
      if (event === 'loading') {
        this.isLoading = true;
      } else if (event === 'loaded') {
        this.isLoading = false;
      }
      this.$bus.$emit(this.mapEvent(event), ...args);
    },
    on(event, callback) {
      this.$bus.$on(this.mapEvent(event), callback);
    },
    once(event, callback) {
      this.$bus.$once(this.mapEvent(event), callback);
    },
    off(event, callback) {
      this.$bus.$off(this.mapEvent(event), callback);
    },
    differenceObj(baseObject = {}, baseBase = {}, keepIdentifier = false, identifier = 'id') {
      return this._.Y(next => (object = {}, base = {}) => this._.transform(object, (result, value, key) => {
        if (!this._.isEqual(value, base[key]) || (keepIdentifier && key === identifier)) {
          result[key] = this._.isObject(value) && this._.isObject(base[key] && !this._.isBlob(value))
            ? next(value, base[key])
            : value;
        }
      }))(baseObject, baseBase);
    },
  },
};
