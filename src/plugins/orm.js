import Vue from '@triotech/vue-core/src/vendor/vue';
import QS from '@triotech/vue-core/src/vendor/qs';

const Entity = {
  computed: {
    ajaxMethodMapping: () => ({
      list: 'get',
      read: 'get',
      create: 'post',
      update: 'patch',
      delete: 'delete',
    }),
  },
  methods: {
    list(options = {}) {
      return this.exec('list', null, {}, options);
    },
    create(data = {}, options = {}, parameters = null) {
      return this.exec('create', parameters, data, options);
    },
    read(parameters = {}, options = {}) {
      return this.exec('read', parameters, {}, options);
    },
    update(parameters = {}, data = {}, options = {}) {
      return this.exec('update', parameters, data, options);
    },
    delete(parameters = {}, options = {}) {
      return this.exec('delete', parameters, {}, options);
    },
    exec(type = null, parameters = {}, data = {}, options = {}) {
      return new Promise(async (resolve, reject) => {
        // eslint-disable-next-line no-underscore-dangle
        if (this.options._isVue || options._isVue) {
          // eslint-disable-next-line no-console
          console.warn('$orm', 'options should not be a vue instance', this.options, options);
          return reject(new Error('unparsableOptions'));
        }

        const extendedOptions = this._.merge({}, this.options, options);
        const {
          cache,
          axios,
        } = extendedOptions;
        const compiledURI = this.compileURI(parameters, extendedOptions);

        if (!compiledURI) {
          return resolve(null);
        }

        let method = this.ajaxMethodMapping[type];
        if (extendedOptions.partial === false && method === this.$ajax.http.patch.toLowerCase()) {
          method = this.$ajax.http.put.toLowerCase();
        }

        const fn = this.$ajax[method];
        const [URI, queryString] = compiledURI.split('?');
        const hashedURI = window.btoa(URI);
        const hashedQueryString = window.btoa(queryString);
        const isCachedMethod = this.$ajax.http.get.toLowerCase() === method;
        const handleCache = cache && isCachedMethod;
        const {
          state,
        } = this.$store;

        if (!fn) {
          // eslint-disable-next-line no-console
          console.warn('$orm', '$ajax method is uncallbable', type);
          return reject(new Error('uncallableMethod'));
        }

        if (handleCache) {
          const cacheDuration = this._.isNumber(cache) ? cache : 3600000;
          const cacheStore = this._.get(state.orm, `${hashedURI}.${hashedQueryString}`);

          if (this._.isPlainObject(cacheStore) && !this._.expired(cacheStore.time + cacheDuration)) {
            return resolve(cacheStore.response);
          }
        }

        let response = null;
        try {
          response = await fn.call(this, compiledURI, data, axios);
        } catch (error) {
          return reject(error);
        }

        if (handleCache) {
          const time = Number(new Date());

          if (type === 'list' && extendedOptions.invalidate !== false) {
            // Invalidating Previous Caches if response.total differs
            const criteria = this._.pick(extendedOptions.queryString, 'criteria');
            const cachedURI = this._.get(state, `orm.${hashedURI}`);
            this._.forIn(this._.keys(this._.pickBy(cachedURI, (cacheEntry, cacheKey) => {
              const cacheQueryString = QS.parse(window.atob(cacheKey));
              const cacheCriteria = this._.pick(cacheQueryString, 'criteria');
              const isPrevious = cacheEntry.time < time;
              const hasNewEntries = cacheEntry.response.total !== response.total;
              const isSameEntries = this._.isEqual(cacheCriteria, criteria);
              const isInvalid = isPrevious && hasNewEntries && isSameEntries;
              if (isInvalid) {
                // eslint-disable-next-line no-console
                console.warn('invalidating', {
                  cacheKey,
                  cacheQueryString,
                  cacheCriteria,
                  criteria,
                  isPrevious,
                  hasNewEntries,
                  isSameEntries,
                });
              }
              return isInvalid;
            })), this._.unset.bind(null, cachedURI));
          }

          this._.set(state, `orm.${hashedURI}.${hashedQueryString}`, {
            time,
            response,
          });

          this.set(state);
        }

        return resolve(response);
      });
    },
    compileURI(parameters = {}, options = {}) {
      const {
        uri,
        trailingSlash,
        queryString,
      } = options;

      if (!uri) {
        return null;
      }

      const interpolate = /\{([\s\S]+?)\}/g;
      let compiledURI = parameters ? this._.template(uri, {
        interpolate,
      })(parameters) : uri.replace(interpolate, '');

      if (trailingSlash === false) {
        compiledURI = compiledURI.replace(/\/$/, '');
      }

      const compiledQueryString = QS.stringify(queryString);
      if (compiledQueryString) {
        compiledURI += `?${compiledQueryString}`;
      }

      return compiledURI;
    },
  },
};

const ORM = new Vue({
  methods: {
    register(data, opts = {}) {
      this._.forIn(this._.isString(data) ? {
        [data]: opts,
      } : data, (options, entity) => {
        if (this[entity]) {
          // eslint-disable-next-line no-console
          console.warn(`${entity} is already registered`);
        } else {
          this[entity] = new Vue({
            mixins: [
              Entity,
            ],
            data() {
              return {
                options,
              };
            },
          });
        }
      });
    },
    unregister(data) {
      this._.forIn(this._.isString(data) ? [data] : data, (entity) => {
        if (!this[entity]) {
          // eslint-disable-next-line no-console
          console.warn(`${entity} isn't registered`);
        } else {
          delete this[entity];
        }
      });
    },
  },
});

Vue.set(Vue.prototype, '$orm', ORM);

export default ORM;
