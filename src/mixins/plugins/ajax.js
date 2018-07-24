import moment from 'moment';
import QS from 'qs';
import Router from '../../lib/plugins/router';

export default {
  router: Router,
  computed: {
    httpGet: () => 'GET',
    httpPost: () => 'POST',
    httpPut: () => 'PUT',
    httpPatch: () => 'PATCH',
    httpDelete: () => 'DELETE',
    httpHead: () => 'HEAD',
    oauthTokenEndpoint() {
      return this.oauthConfig.token_endpoint || 'oauth/v2/token';
    },
    impersonateEndpoint() {
      return this.oauthConfig.impersonate_endpoint || 'api/private/impersonate';
    },
    oauthTokenType: () => 'Bearer',
    oauthStore() {
      return this.$store.getters.oauth || {};
    },
    oauthConfig() {
      return this.$config.get('oauth') || {};
    },
  },
  data() {
    return {
      cancelToken: null,
    };
  },
  created() {
    this.cancel();
  },
  methods: {
    url(config, withoutEndpoint = false) {
      let url = this._.isObject(config) ? config.url : config;
      const endPoint = withoutEndpoint ? '/' : (this.$config.endpoint || '');
      if (this._.isString(url) && url.indexOf('://') === -1) {
        url = `${this.$config.host}${endPoint}${url}`;
      }
      return url;
    },
    uri(uri) {
      return this.url(uri, true);
    },
    getUploadsUri(location) {
      // eslint-disable-next-line no-console
      console.warning('Deprecated method: use vm.$ajax.uri(uri) instead.');
      return this.url(this.build(location), true);
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
    sync() {
      this.wait = true;
      return this;
    },
    build(url, method, data = {}, config = {}) {
      return this._.extend(config, { url, method, data });
    },
    cancel(message) {
      if (this.cancelToken) {
        this.cancelToken.cancel(message);
      }
      this.cancelToken = this.$http.CancelToken.source();
    },
    publicRequest(url = '/', method = this.httpGet, data = {}, config = {}) {
      // eslint-disable-next-line no-console
      console.warning('Deprecated method: This might get removed');
      const conf = this._.merge({ method, url, data }, config);
      conf.url = this.url(conf);
      return this.$http.request(conf).then(response => response.data);
    },
    get(url, data, config) {
      return this.request(this.build(url, this.httpGet, data, config));
    },
    post(url, data, config) {
      return this.request(this.build(url, this.httpPost, data, config));
    },
    put(url, data, config) {
      return this.request(this.build(url, this.httpPut, data, config));
    },
    patch(url, data, config) {
      return this.request(this.build(url, this.httpPatch, data, config));
    },
    delete(url, data, config) {
      return this.request(this.build(url, this.httpDelete, data, config));
    },
    head(url, data, config) {
      return this.request(this.build(url, this.httpHead, data, config));
    },
    redirect(uri = '/') {
      window.location.assign(uri);
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
        const oauth = this._.cloneDeep(this.$store.getters.get.oauthUsurpator);
        this.set({ oauth, oauthUsurpator: null });
        return Promise.resolve().then(redirect);
      }

      return this.get(`${this.impersonateEndpoint}/${userEmail}`).then((response) => {
        response.expires_at = (response.expires_in * 1000) + moment();
        response.refresh_token_expires_at = (response.refresh_token_lifetime * 1000) + moment();

        const oauth = this._.cloneDeep(this.$store.getters.get.oauth);
        this.set({ oauth: response, oauthUsurpator: oauth });
      }).then(redirect);
    },
    login(data, persistSession = true) {
      return this.oauth(this._.extend({
        grant_type: 'password',
      }, data), persistSession);
    },
    refresh() {
      return this.oauth({
        grant_type: 'refresh_token',
        refresh_token: this.oauthStore.refresh_token,
      });
    },
    oauth(data, commit = true) {
      return this.request(this.build(this.oauthTokenEndpoint, this.httpPost, this._.extend({
        client_id: this.oauthConfig.client_id,
        client_secret: this.oauthConfig.client_secret,
      }, data), { commit })).then((response) => {
        response.expires_at = (response.expires_in * 1000) + moment();
        response.refresh_token_expires_at = (response.refresh_token_lifetime * 1000) + moment();
        if (commit) {
          this.set({ oauth: response });
        } else {
          // TODO handle rememberMe
          // this.$store._mutations.set[0](this.get(), data)
        }
        return response;
      });
    },
    request(config = {}) {
      const promise = this.wait ? this.syncRequest(config) : this.asyncRequest(config);
      this.wait = null;
      return promise;
    },
    async syncRequest(config) {
      return this.asyncRequest(config);
    },
    asyncRequest(config) {
      config.url = this.url(config);
      if (!config.headers) {
        config.headers = [];
      }

      if (!this._.isEmpty(this.oauthStore)) {
        const isExpired = time => ((new Date() - time) / 1000 > 0);
        if (!config.commit && isExpired(this.oauthStore.expires_at)) {
          if (isExpired(this.oauthStore.refresh_token_expires_at)) {
            this.unset('oauth');
            return this.redirect();
          }
          return this.refresh().then(this.asyncRequest.bind(this, config));
        }

        if (config.url.indexOf(this.oauthTokenEndpoint) === -1) {
          config.headers = this._.extend({
            Authorization: `${this.oauthTokenType} ${this.oauthStore.access_token}`,
          }, config.headers);
        }
      }

      if (config.stringify) {
        config.data = QS.stringify(config.data);
      }

      const multiPart = this._.some(config.data, this._.isBlob);
      if (multiPart) {
        config.data = this.encode(config.data);
        config.headers['X-Http-Method-Override'] = config.method;
        config.method = this.httpPost;
      }

      config.cancelToken = this.cancelToken.token;

      return this.$http.request(config).then((res) => {
        const { data } = res;
        this.$store.data = data;
        this.$store[config.url] = data;
        return data;
      }).catch((error) => {
        const data = (error.response && error.response.data) || {};
        const description = data.error_description;
        if (data.error === 'invalid_grant' && this._.isString(description)) {
          if (description.match(/expired/i) && error.response.status === 401) {
            delete config.headers;
            return this.refresh().then(this.asyncRequest.bind(this, config));
          }
          if (!description.match(/password/i) && description.match(/invalid|expired/i) && error.response.status >= 400) {
            this.unset('oauth');
            return this.redirect();
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
