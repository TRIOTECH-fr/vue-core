import QS from 'qs';
import Router from '../../plugins/router';

export default {
  router: Router,
  computed: {
    http() {
      return this._.mapKeys(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'], this._.toLower);
    },
    oauthTokenTypes() {
      return this._.mapKeys(['Bearer'], this._.toLower);
    },
    oauthGrantTypes() {
      return this._.mapKeys(['password', 'refresh_token'], this._.camelCase);
    },
    oauthStore() {
      return this.$store.getters.oauth || {};
    },
    oauthUsurpatorStore() {
      return this.$store.getters.usurpator || {};
    },
    oauthConfig() {
      return this.$config.get('oauth', {});
    },
    oauthTokenEndpoint() {
      return this.oauthConfig.token_endpoint || 'oauth/v2/token';
    },
    oauthTokenPositions() {
      return this._.mapKeys(['headers', 'query_string', 'body'], this._.camelCase);
    },
    oauthAccessToken() {
      return new Promise((resolve, reject) => {
        if (this._.expired(this.oauthStore.expires_at)) {
          if (this._.expired(this.oauthStore.refresh_token_expires_at)) {
            this.unset('oauth');

            return reject(new Error('Refresh token expired'));
          }

          return this.refresh().then(resolve);
        }

        return resolve(this.oauthStore.access_token);
      });
    },
    impersonateEndpoint() {
      return this.oauthConfig.impersonate_endpoint || 'api/private/impersonate';
    },
  },
  data() {
    return {
      pendingRefresh: false,
      cancelToken: null,
    };
  },
  created() {
    this.cancel();
  },
  methods: {
    getUploadsUri(location) {
      return this.url(this.build(location), true);
    },
    url(config, withoutEndpoint = false) {
      let url = this._.isObject(config) ? config.url : config;
      const endPoint = withoutEndpoint ? '/' : (this.$config.endpoint || '');
      if (url && url.indexOf('://') === -1) {
        url = `${this.$config.host}${endPoint}${url}`;
      }
      return url;
    },
    encode(input) {
      const format = (stack, key) => (stack ? `${stack}[${key}]` : key);
      return this._.Y(next => (form, data, stack = null) => {
        if (this._.isObject(data)) {
          this._.forOwn(data, (value, key) => {
            if (this._.isObject(value)) {
              if (this._.isBlob(value)) {
                const type = value.type.split('/').slice(-1).join();
                form.append(format(stack, key), value, value.name || `${key}.${type}`);
              } else if (this._.isArray(value)) {
                value.forEach(subValue => form.append(`${format(stack, key)}[]`, subValue));
              } else {
                next(form, value, format(stack, key));
              }
            } else {
              form.append(format(stack, key), value);
            }
          });
        }
        return form;
      })(new FormData(), this._.isString(input) ? QS.parse(input) : input);
    },
    build(url, method, data = {}, config = {}) {
      return this._.extend(config, {
        url,
        method,
        data,
      });
    },
    cancel(message) {
      if (this.cancelToken) {
        this.cancelToken.cancel(message);
      }
      this.cancelToken = this.$http.CancelToken.source();
    },
    publicRequest(url = '/', method = this.http.get, data = {}, config = {}) {
      const conf = this._.merge({
        method,
        url,
        data,
      }, config);
      conf.url = this.url(conf);
      return this.$http.request(conf).then(response => response.data);
    },
    get(url, data, config) {
      return this.request(this.build(url, this.http.get, data, config));
    },
    post(url, data, config) {
      return this.request(this.build(url, this.http.post, data, config));
    },
    put(url, data, config) {
      return this.request(this.build(url, this.http.put, data, config));
    },
    patch(url, data, config) {
      return this.request(this.build(url, this.http.patch, data, config));
    },
    delete(url, data, config) {
      return this.request(this.build(url, this.http.delete, data, config));
    },
    head(url, data, config) {
      return this.request(this.build(url, this.http.head, data, config));
    },
    redirect(uri = '/') {
      window.location.href = uri;
    },
    expires(delay) {
      return delay * 1000 + this.$moment() || Number.MAX_SAFE_INTEGER;
    },
    impersonate(userEmail = null, routeRedirect = null) {
      if (this.impersonateEndpoint === false) {
        return false;
      }

      const redirect = () => {
        if (routeRedirect) {
          this.$router.push(routeRedirect);
        }
      };

      if (!userEmail) {
        const oauth = this._.clone(this.oauthUsurpatorStore);
        this.set({
          oauth,
          oauthUsurpator: null,
        });
        return Promise.resolve().then(redirect);
      }

      return this.get(`${this.impersonateEndpoint}/${userEmail}`).then((response) => {
        response.expires_at = this.expires(response.expires_in);
        response.refresh_token_expires_at = this.expires(response.refresh_token_lifetime);

        const oauthUsurpator = this._.clone(this.oauthStore);
        this.set({
          oauth: this._.extend(this.oauthUsurpator, response),
          oauthUsurpator,
        });
      }).then(redirect);
    },
    login(data, persistSession = true) {
      return this.oauth(this._.extend({
        grant_type: this.oauthGrantTypes.password,
      }, data), persistSession);
    },
    refresh() {
      if (this.pendingRefresh) {
        return new Promise((resolve) => {
          this.pendingRefresh.push(resolve);
        });
      }

      this.pendingRefresh = [];
      return this.oauth({
        grant_type: this.oauthGrantTypes.refreshToken,
        refresh_token: this.oauthStore.refresh_token,
      }).then(() => {
        this.pendingRefresh.forEach(Function.prototype.call, Function.prototype.call);
        return this.oauthStore.access_token;
      }).finally(() => {
        this.pendingRefresh = false;
      });
    },
    oauth(data, commit = true) {
      return this.request(this.build(this.oauthTokenEndpoint, this.http.post, this._.extend({
        client_id: this.oauthConfig.client_id,
        client_secret: this.oauthConfig.client_secret,
      }, data))).then((response) => {
        response.expires_at = this.expires(response.expires_in);
        response.refresh_token_expires_at = this.expires(response.refresh_token_lifetime);
        if (commit) {
          this.set({ oauth: this._.extend(this.oauthStore, response) });
        } else {
          // TODO handle rememberMe
          // this.$store._mutations.set[0](this.get(), data)
        }
        return response;
      });
    },
    async request(config = {}) {
      config.url = this.url(config);
      if (!config.headers) {
        config.headers = [];
      }

      if (!this._.isEmpty(this.oauthStore) && config.url.indexOf(this.oauthTokenEndpoint) === -1) {
        let accessToken;

        try {
          accessToken = await this.oauthAccessToken;
        } catch (error) {
          return this.redirect();
        }

        switch (config.tokenPosition) {
          case this.oauthTokenPositions.body:
            config.data = this._.extend({
              access_token: accessToken,
            }, config.data);
            break;

          case this.oauthTokenPositions.queryString:
            config.params = this._.extend({
              access_token: accessToken,
            }, config.params);
            break;

          case this.oauthTokenPositions.headers:
          default:
            config.headers = this._.extend({
              Authorization: `${this.oauthTokenTypes.bearer} ${accessToken}`,
            }, config.headers);
            break;
        }
      }

      if (config.stringify) {
        config.data = QS.stringify(config.data);
      }

      const multiPart = this._.some(config.data, this._.isBlob);
      if (multiPart) {
        config.data = this.encode(config.data);
        config.headers['X-Http-Method-Override'] = config.method;
        config.method = this.http.post;
      }

      if (this._.isUndefined(config.cancelToken)) {
        config.cancelToken = this.cancelToken.token;
      }

      return this.$http.request(config).then((res) => {
        const { data } = res;
        this.$store.data = data;
        this.$store[config.url] = data;
        return data;
      }).catch(async (error) => {
        let data = (error.response && error.response.data) || {};
        if (this._.isBlob(data)) {
          const blobParser = blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = (progressEvent) => {
              let { result } = progressEvent.target;
              if (error.response.headers['content-type'] === 'application/json') {
                result = JSON.parse(result);
              }
              resolve(result);
            };
            reader.onerror = reject;
            reader.readAsText(blob);
          });
          data = await blobParser(data);
        }
        const description = data.error_description;
        if (data.error === 'invalid_grant' && this._.isString(description)) {
          if (description.match(/expired/i) && error.response.status === 401) {
            delete config.headers.Authorization;
            return this.refresh().then(this.request.bind(this, config));
          }
          if (!description.match(/password/i) && description.match(/invalid|expired/i) && error.response.status >= 400) {
            this.unset('oauth');
            this.redirect();
          }
        } else if (!this.$http.isCancel(error)) {
          // eslint-disable-next-line no-console
          console.error(error.response && error.response.data && error.response.data.error, {
            response: error.response,
            request: error.request,
            message: error.message,
            config: error.config,
          });
        }
        throw error;
      });
    },
  },
};
