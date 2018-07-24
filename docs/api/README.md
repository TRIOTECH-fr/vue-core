---
sidebar: auto
---

# API Reference

[Lodash Mixins](https://lodash.com/docs/#mixin)

## Lodash (alias)

### vm._.encode(string)

- **Arguments:**
  - `{String} string`

- **Returns:** `{String}`

- **Usage:**

[window.encodeURIComponent](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) alias

- **Example:**

```js
vm._.encode('$');
// => "%24"
```

---

### vm._.decode(string)

- **Arguments:**
  - `{String} string`

- **Returns:** `{String}`

- **Usage:**

[window.decodeURIComponent](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Objets_globaux/decodeURIComponent) alias

- **Example:**

```js
vm._.decode('%24');
// => "$"
```

---

## Lodash (base)

### vm._.access(object, key, value)

- **Arguments:**
  - `{Object} object`
  - `{String} key`
  - `{any} value`

- **Returns:** `{any}`

- **Usage:**

Calls [vm._.extend(object, { [key]: value })](https://lodash.com/docs/#extend) if [vm.\_.has(object, key)](https://lodash.com/docs/#has) is falsy and returns [vm.\_.get(object, key)](https://lodash.com/docs/#get)

- **Example:**

```js
const obj = { foo: 'foo' };

vm._.access(obj, 'foo', 'foo');
// => "foo"
// obj is now {foo: "foo"}

vm._.access(obj, 'bar', 'bar');
// => "bar"
// obj is now {foo: "foo", bar: "bar"}
```

---

### vm._.param(object, prepend)

- **Arguments:**
  - `{Object} object`
  - `{Boolean} prepend (optional)` : Whether question mark should be prepend. Defaults to `true`

- **Returns:** `{String}`

- **Usage:**

Converts a plain object to a string representing an [URL query part](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Examples) (also known as [Query String](https://en.wikipedia.org/wiki/Query_string))

- **Example:**

```js
vm._.param({ key: 'bar', answer: 42 });
// => "?key=bar&answer=42"
```

::: warning
Doesn't handle array/object conversion yet
:::
```js
vm._.param({ chunks: [1,2,3], a: {b: 'c'} });
// => "?chunks=1%2C2%2C3&a=%5Bobject%20Object%5D"
```

---

### vm._.deparam(string)

- **Arguments:**
  - `{String} string (optional)` : Defaults to `window.location.search`

- **Returns:** `Object`

- **Usage:**

Converts a Query String to a plain object

- **Example:**

```js
console.log(window.location.search);
// => ?foo=bar&chunks%5B%5D=1&chunks%5B%5D=2
vm._.deparam();
// => {"foo":"bar","chunks":["1","2"]}
```

---

### vm._.args(array)

- **Arguments:**
  - `{Array} array`

- **Returns:** `{Object}`

- **Usage:**

Transforms array to object using even values as keys and odd values as values

- **Example:**

```js
vm._.args([0, 1, 'array', [], 'object', {foo: 'bar'}]);
// => {1: 2, array: Array(0), object: {foo: "bar"}}
```

---

### vm._.flatTree(tree, key, nodes)

- **Arguments:**
  - `{Array} tree`
  - `{String} key (optional)` : Defaults to `'id'`
  - `{String} nodes (optional)` : Defaults to `'children'`

- **Returns:** `{Array}`

- **Usage:**

Flattens tree using `key` as identifier to ignore duplicates and `nodes` as lookup children key

- **Example:**

```js
const tree = vm._.flatTree([{ id: 1, children: [{id: 2}, {id: 3, children: []}] }]);
// => [{"id":1,"children":[{"id":2},{"id":3,"children":[]}]},{"id":2},{"id":3,"children":[]}]
console.log(tree.length);
// => 3
```

---

## Lodash (router)

### vm._.propsValidator(component, route, addRouteQueryInParams)

- **Arguments:**
  - `{Object} component` : [Vue Instance](https://vuejs.org/api/)
  - `{Object} route` : [Vue Router Route Object](https://router.vuejs.org/api/#the-route-object)
  - `{Boolean} addRouteQueryInParams (optional)` : Whether route query should be merged with route parameters. Defaults to `false`

- **Returns:** `{Object}`

- **Usage:**

<!-- TODO @ta validate usage -->
Should be used as a props value for a [RouteConfig](https://router.vuejs.org/api/#routes) object in order to automatically assign component props using route object

- **Example:**

```js
import Home from '@/views/Home';
import _ from '@triotech/vue-core/src/lib/plugins/_';

export default [{
  path: '/',
  name: 'home',
  component: Home,
  props: _.propsValidator.bind(_, Home)
}];
```

---

### vm._.queryPropsValidator(...args)

- **Arguments:**
  - `{any} ...args`

- **Returns:** `{Object}`

- **Usage:**

[vm._.propsValidator(component, route, true)](#vm-propsvalidator-component-route-addroutequeryinparams) alias

- **Example:**

```js
import Home from '@/views/Home';
import _ from '@triotech/vue-core/src/lib/plugins/_';

export default [{
  path: '/',
  name: 'home',
  component: Home,
  props: _.queryPropsValidator.bind(_, Home)
}];
```

---

## Lodash (transforms)

### vm._.dataURIToObjectURL(dataURI)

- **Arguments:**
  - `{String} dataURI`

- **Returns:** `{String}`

- **Usage:**

Converts a [Data URI](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) string to an Object URL

- **Example:**

```js
vm._.dataURIToObjectURL('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
// => "blob:http://domain.tld/9dc628cc-ee12-4dca-9d07-1a461c362452"
```

---

### vm._.base64ToObjectURL(base64, type)

- **Arguments:**
  - `{String} base64`
  - `{String} type (optional)` : [MIME Type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types). Defaults to `image/jpeg`

- **Returns:** `{String}`

- **Usage:**

Converts a [Base64](https://developer.mozilla.org/docs/Web/API/WindowBase64/Base64_encoding_and_decoding) string to an Object URL

- **Example:**

```js
vm._.base64ToObjectURL('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
// => "blob:http://domain.tld/e28c1479-67ec-4de4-8d78-a44a7c5af614"
```

---

### vm._.stringToObjectURL(string, type)

- **Arguments:**
  - `{String} string`
  - `{String} type (optional)` : [MIME Type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types). Defaults to `image/jpeg`

- **Returns:** `{String}`

- **Usage:**

Converts a [Binary String](https://developer.mozilla.org/docs/Web/API/DOMString/Binary) to an Object URL

- **Example:**

```js
vm._.stringToObjectURL(`GIF89a�������!ù��
���,�����������L��;`);
// => "blob:http://domain.tld/e82e9296-eda5-43fc-b4ec-376ef28b1e3d"
```

---

### vm._.typedArrayToObjectURL(typedArray, type)

- **Arguments:**
  - `{TypedArray} typedArray`
  - `{String} type (optional)` : [MIME Type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types). Defaults to `image/jpeg`

- **Returns:** `{String}`

- **Usage:**

Converts a [TypedArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/prototype) to an Object URL

- **Example:**

```js
vm._.typedArrayToObjectURL(new Uint8Array([71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 0, 0, 0, 33, 249, 4, 1, 10, 0, 1, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 76, 1, 0, 59]));
// => "blob:http://domain.tld/0f55173c-f5ee-4767-9ef6-2dec171a96d7"
```

---

### vm._.blobToObjectURL(blob)

- **Arguments:**
  - `{Blob} blob`

- **Returns:** `{String}`

- **Usage:**

Converts a [Blob](https://developer.mozilla.org/docs/Web/API/Blob) to an Object URL

- **Example:**

```js
vm._.blobToObjectURL(new Blob([new Uint8Array([71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 0, 0, 0, 33, 249, 4, 1, 10, 0, 1, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 76, 1, 0, 59])], {type: 'image/gif'}));
// => "blob:http://domain.tld/f47c3d6f-d56e-4783-b512-0919792446ed"
```

---

### vm._.dataURIToBlob(dataURI)

- **Arguments:**
  - `{String} dataURI`

- **Returns:** `{Blob}`

- **Usage:**

Converts a [Data URI](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) string to a [Blob](https://developer.mozilla.org/docs/Web/API/Blob)

- **Example:**

```js
vm._.dataURIToBlob('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
// => Blob(37) {size: 37, type: "image/gif"}
```

---

### vm._.base64ToBlob(base64, type)

- **Arguments:**
  - `{String} base64`
  - `{String} type (optional)` : [MIME Type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types). Defaults to `image/jpeg`

- **Returns:** `{Blob}`

- **Usage:**

Converts a [Base64](https://developer.mozilla.org/docs/Web/API/WindowBase64/Base64_encoding_and_decoding) string to a [Blob](https://developer.mozilla.org/docs/Web/API/Blob)

- **Example:**

```js
vm._.base64ToBlob('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
// => Blob(37) {size: 37, type: "image/jpeg"}
```

---

### vm._.stringToBlob(string, type)

- **Arguments:**
  - `{String} string`
  - `{String} type (optional)` : [MIME Type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types). Defaults to `image/jpeg`

- **Returns:** `Blob`

- **Usage:**

Converts a [Binary String](https://developer.mozilla.org/docs/Web/API/DOMString/Binary) to a [Blob](https://developer.mozilla.org/docs/Web/API/Blob)

- **Example:**

```js
vm._.stringToBlob(`GIF89a�������!ù��
���,�����������L��;`);
// => Blob(37) {size: 37, type: "image/jpeg"}
```

---

### vm._.stringToTypedArray(string)

- **Arguments:**
  - `{String} string`

- **Returns:** `Uint8Array`

- **Usage:**

Converts a [Binary String](https://developer.mozilla.org/docs/Web/API/DOMString/Binary) to a [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

- **Example:**

```js
vm._.stringToTypedArray(`GIF89a�������!ù��
���,�����������L��;`);
// => Uint8Array(37) [71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 0, 0, 0, 33, 249, 4, 1, 10, 0, 1, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 76, 1, 0, 59]
```

---

### vm._.typedArrayToBlob(typedArray, type)

- **Arguments:**
  - `{TypedArray} typedArray`
  - `{String} type (optional)` : [MIME Type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types). Defaults to `image/jpeg`

- **Returns:** `{Blob}`

- **Usage:**

Converts a [TypedArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/prototype) to a [Blob](https://developer.mozilla.org/docs/Web/API/Blob)

- **Example:**

```js
vm._.typedArrayToBlob(new Uint8Array([71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 0, 0, 0, 33, 249, 4, 1, 10, 0, 1, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 76, 1, 0, 59]));
// => Blob(37) {size: 37, type: "image/jpeg"}
```

---

### vm._.stringToArrayBuffer(string)

- **Arguments:**
  - `{String} string`

- **Returns:** `{ArrayBuffer}`

- **Usage:**

Converts a [Binary String](https://developer.mozilla.org/docs/Web/API/DOMString/Binary) to an [ArrayBuffer](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

- **Example:**

```js
vm._.stringToArrayBuffer(`GIF89a�������!ù��
���,�����������L��;`);
// => ArrayBuffer(37) {}
```

---

### vm._.arrayBufferToString(arrayBuffer)

- **Arguments:**
  - `{ArrayBuffer} arrayBuffer`

- **Returns:** `{String}`

- **Usage:**

Converts an [ArrayBuffer](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) to a [Binary String](https://developer.mozilla.org/docs/Web/API/DOMString/Binary)

- **Example:**

```js
_.arrayBufferToString(_.stringToArrayBuffer(`GIF89a�������!ù��
���,�����������L��;`))
// => "GIF89aýýýýýýý!ùýý
ýýý,ýýýýýýýýýýýLýý;"
```

---

## Lodash (types)

### vm._.isBlob(value)

- **Arguments:**
  - `{any} value`

- **Returns:** `{Boolean}`

- **Usage:**

Checks if value is an instance of [Blob](https://developer.mozilla.org/docs/Web/API/Blob)

- **Example:**

```js
vm._.isBlob();
// => false
vm._.isblob(new Blob());
// => true
```

---

### vm._.isFile(value)

- **Arguments:**
  - `{any} value`

- **Returns:** `{Boolean}`

- **Usage:**

Checks if value is an instance of [File](https://developer.mozilla.org/docs/Web/API/File)

- **Example:**

```js
vm._.isFile();
// => false
vm._.isFile(new File([], ''));
// => true
```

---

### vm._.isEvent(value)

- **Arguments:**
  - `{any} value`

- **Returns:** `{Boolean}`

- **Usage:**

Checks if value is an instance of [Event](https://developer.mozilla.org/docs/Web/API/Event)

- **Example:**

```js
vm._.isEvent();
// => false
vm._.isEvent(new Event(''));
// => true
```

---

### vm._.isProgressEvent(value)

- **Arguments:**
  - `{any} value`

- **Returns:** `{Boolean}`

- **Usage:**

Checks if value is an instance of [ProgressEvent](https://developer.mozilla.org/docs/Web/API/ProgressEvent)

- **Example:**

```js
vm._.isProgressEvent();
// => false
vm._.isProgressEvent(new ProgressEvent());
// => true
```

---

### vm._.isXHR(value)

- **Arguments:**
  - `{any} value`

- **Returns:** `{Boolean}`

- **Usage:**

Checks if value is an instance of [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)

- **Example:**

```js
vm._.isXHR();
// => false
vm._.isXHR(new XMLHttpRequest());
// => true
```

---

## Lodash (others)

### vm._.Y(function)

- **Arguments:**
  - `{Function} function`

- **Returns:** `{Function}`

- **Usage:**

Permits to use the [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) ES5 Idiom in ES6 by injecting a closure using the [Y Combinator](http://kestas.kuliukas.com/YCombinatorExplained/) function

- **Example:**

```js
const fib = vm._.Y(next => num => num <= 1 ? num : next(num - 1) + next(num - 2));
const fib9 = fib(9);
// => 34
```

---

## Ajax

[OAuth 2.0](https://oauth.net/2/) [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)

### vm.$ajax.url(config, withoutEndpoint)

- **Arguments:**
  - `{String | Object} config`
  - `{Boolean} withoutEndpoint (optional)` : Whether we should use vm.$config.endpoint. Defaults to `false`

- **Returns:** `{String}`

- **Usage:**

Returns an URL built using vm.$config.host and optionally with vm.$config.endpoint

- **Example:**

```js
console.log(vm.$config.host);
// => "https://backend.triotech.fr"
console.log(vm.$config.endpoint);
// => "/app_dev.php/api/"
vm.$ajax.uri('public/enum/');
// => "https://backend.triotech.fr/app_dev.php/api/public/enum/"
```

---

### vm.$ajax.uri(uri)

- **Arguments:**
  - `{String} uri`

- **Returns:** `{String}`

- **Usage:**

Returns an URL built using vm.$config.host without vm.$config.endpoint (Required for uploads URL)

- **Example:**

```js
console.log(vm.$config.host);
// => "https://backend.triotech.fr"
vm.$ajax.uri('uploads/docs.pdf');
// => "https://backend.triotech.fr/uploads/docs.pdf"
```

---

### vm.$ajax.encode(input)

- **Arguments:**
  - `{String | Object | Array} input`

- **Returns:** `{FormData}`

- **Usage:**

Transforms input to a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) handling multipart/form-data

- **Example:**

```js
vm.$ajax.encode({ file: new Blob(), array: [], object: {foo: 'bar'} });
// => FormData {}
```

---

### vm.$ajax.build(url, method, data, config)

- **Arguments:**
  - `{String} url`
  - `{String} method`
  - `{Object} data (optional)`
  - `{Object} config (optional)`

- **Returns:** `{Object}`

- **Usage:**

Builds an [Axios Request Config](https://github.com/axios/axios#request-config) object. Mainly used internally

- **Example:**

```js
vm.$ajax.build('http://domain.tld', 'GET', { foo: 'bar' }, { headers: {'content-type': 'application/json'} });
// => {"headers":{"content-type":"application/json"},"url":"http://domain.tld","method":"GET","data":{"foo":"bar"}}
```

---

### vm.$ajax.cancel(message)

- **Arguments:**
  - `{String} message`

- **Returns:** `{undefined}`

- **Usage:**

Cancels every [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) since the last cancellation.

::: tip
Cancellation is triggered automatically using [Vue Router Global Guard](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-guards)
:::

- **Example:**

```js
vm.$ajax.get('https://nghttp2.org/httpbin/delay/30');
vm.$ajax.cancel('custom');
// => Uncaught (in promise) Cancel {message: "custom"}
```

---

### vm.$ajax.get(url, data, config)

- **Arguments:**
  - `{String} url`
  - `{Object} data`
  - `{Object} config`

- **Returns:** `{Promise}`

- **Usage:**

Performs an Authorized [GET](https://developer.mozilla.org/docs/Web/HTTP/Methods/GET) [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)

- **Example:**

```js
const get = await vm.$ajax.get('https://nghttp2.org/httpbin/get');
// => {args: {…}, headers: {…}, origin: "1.2.3.4", url: "https://nghttp2.org/httpbin/get"}
```

---

### vm.$ajax.post(url, data, config)

- **Arguments:**
  - `{String} url`
  - `{Object} data`
  - `{Object} config`

- **Returns:** `{Promise}`

- **Usage:**

Performs an Authorized [POST](https://developer.mozilla.org/docs/Web/HTTP/Methods/POST) [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)

- **Example:**

```js
const post = await vm.$ajax.post('https://nghttp2.org/httpbin/post', {foo: 'bar'});
// => {args: {…}, data: "{"foo":"bar"}", files: {…}, form: {…}, headers: {…}, …}
```

---

### vm.$ajax.put(url, data, config)

- **Arguments:**
  - `{String} url`
  - `{Object} data`
  - `{Object} config`

- **Returns:** `{Promise}`

- **Usage:**

Performs an Authorized [PUT](https://developer.mozilla.org/docs/Web/HTTP/Methods/PUT) [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)

- **Example:**

```js
const put = await vm.$ajax.put('https://nghttp2.org/httpbin/put', {foo: 'bar'});
// => {args: {…}, data: "{"foo":"bar"}", files: {…}, form: {…}, headers: {…}, …}
```

---

### vm.$ajax.patch(url, data, config)

- **Arguments:**
  - `{String} url`
  - `{Object} data`
  - `{Object} config`

- **Returns:** `{Promise}`

- **Usage:**

Performs an Authorized [PATCH](https://developer.mozilla.org/docs/Web/HTTP/Methods/PATCH) [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)

- **Example:**

```js
const patch = await vm.$ajax.patch('https://nghttp2.org/httpbin/patch', {foo: 'bar'});
// => {args: {…}, data: "{"foo":"bar"}", files: {…}, form: {…}, headers: {…}, …}
```

---

### vm.$ajax.delete(url, data, config)

- **Arguments:**
  - `{String} url`
  - `{Object} data`
  - `{Object} config`

- **Returns:** `{Promise}`

- **Usage:**

Performs an Authorized [DELETE](https://developer.mozilla.org/docs/Web/HTTP/Methods/DELETE) [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)

- **Example:**

```js
const delete = await vm.$ajax.delete('https://nghttp2.org/httpbin/delete');
// => {args: {…}, data: "{}", files: {…}, form: {…}, headers: {…}, …}
```

---

### vm.$ajax.head(url, data, config)

- **Arguments:**
  - `{String} url`
  - `{Object} data`
  - `{Object} config`

- **Returns:** `{Promise}`

- **Usage:**

Performs an Authorized [HEAD](https://developer.mozilla.org/docs/Web/HTTP/Methods/HEAD) [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)

- **Example:**

```js
const head = await vm.$ajax.head('https://nghttp2.org/httpbin/head');
// => ""
```

---

### vm.$ajax.redirect(uri)

- **Arguments:**
  - `{String} uri`

- **Returns:** `{undefined}`

- **Usage:**

[window.location.assign](https://developer.mozilla.org/docs/Web/API/Location/assign) alias

- **Example:**

```js
vm.$ajax.redirect('https://www.triotech.fr');
// => Performs a GET request to https://www.triotech.fr
```

---

### vm.$ajax.impersonate(userEmail, routeRedirect)

- **Arguments:**
  - `{String} userEmail (optional)` : If provided, performs an impersonation, otherwise removes the impersonation
  - `{String | Object} routeRedirect` : Whether we should redirect after impersonation

- **Returns:** `{undefined}`

- **Usage:**

<!-- TODO @ta -->

- **Example:**

```js
vm.$ajax.impersonate('user@domain.tld', '/home');
// => Impersonating user@domain.tld and redirects to '/home'
vm.$ajax.impersonate();
// => Removes user@domain.tld impersonation
```

---

### vm.$ajax.login(data)

- **Arguments:**
  - `{Object} data`

- **Returns:** `{Promise}`

- **Usage:**

Performs an OAuth [POST](https://developer.mozilla.org/docs/Web/HTTP/Methods/POST) [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) on '/oauth/v2/token' URI using default config `{grant_type: 'password'`} in order to obtain an Access Token

- **Example:**

```js
const token = await vm.$ajax.login({ username: '', password: '' });
// => {"access_token":"...","expires_in":3600,"token_type":"bearer","scope":"api","refresh_token":"...","refresh_token_lifetime":1209600,"expires_at":...,"refresh_token_expires_at":...}
```

---

### vm.$ajax.refresh()

- **Returns:** `{Promise}`

- **Usage:**

Performs an OAuth [POST](https://developer.mozilla.org/docs/Web/HTTP/Methods/POST) [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) on '/oauth/v2/token' URI using default config `{grant_type: 'refresh_token'`} in order to obtain an Access Token using a previous stored Refresh Token

- **Example:**

```js
const token = await vm.$ajax.refresh();
// => {"access_token":"...","expires_in":3600,"token_type":"bearer","scope":"api","refresh_token":"...","refresh_token_lifetime":1209600,"expires_at":...,"refresh_token_expires_at":...}
```

---

### vm.$ajax.request(config)

- **Arguments:**
  - `{Object} config`

- **Returns:** `{Promise}`

- **Usage:**

Performs an Authorized [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) according to the [Axios Request Config](https://github.com/axios/axios#request-config) object

- **Example:**

```js
const request = await app.$ajax.request({ url: 'https://nghttp2.org/httpbin/post', method: 'POST', data: {foo: 'bar'} });
// => {args: {…}, data: "{"foo":"bar"}", files: {…}, form: {…}, headers: {…}, …}
```

---

## Bus

[Global Event Bus](https://vuejs.org/v2/guide/migration.html#dispatch-and-broadcast-replaced)

### vm.$bus.$on(event, callback)

- **Arguments:**
  - `{String | Array<String>} event`
  - `{Function} callback`

- **Returns:** `{vm}` (self)

- **Usage:**

See [vm.$on](https://vuejs.org/v2/api/#vm-on)

- **Example:**

```js
vm.$bus.$on('log', console.log.bind(console, '*'));
vm.$bus.$emit('log', 'foo');
// => "* foo"
vm.$bus.$emit('log', 'bar');
// => "* bar"
```

---

### vm.$bus.$once(event, callback)

- **Arguments:**
  - `{String | Array<String>} event`
  - `{Function} callback`

- **Returns:** `{vm}` (self)

- **Usage:**

See [vm.$once](https://vuejs.org/v2/api/#vm-once)

- **Example:**

```js
vm.$bus.$once('log', console.log.bind(console, '*'));
vm.$bus.$emit('log', 'foo');
// => "* foo"
vm.$bus.$emit('log', 'bar');
// => nothing
```

---

### vm.$bus.$off(event, callback)

- **Arguments:**
  - `{String | Array<String>} event`
  - `{Function} callback (optional)`

- **Returns:** `{vm}` (self)

- **Usage:**

See [vm.$off](https://vuejs.org/v2/api/#vm-off)

- **Example:**

```js
vm.$bus.$on('log', console.log.bind(console, '*'));
vm.$bus.$emit('log', 'foo');
// => "* foo"
vm.$bus.$off('log');
vm.$bus.$emit('log', 'bar');
// => nothing
```

---

### vm.$bus.$emit(eventName, ...args)

- **Arguments:**
  - `{String} eventName`
  - `{any} ...args (optional)`

- **Returns:** `{vm}` (self)

- **Usage:**

See [vm.$emit](https://vuejs.org/v2/api/#vm-emit)

---

## Config

ParameterBag Like

### vm.$config.all()

- **Returns:** `Object`

- **Usage:**

Returns an object representation the configuration, initialized with config/config.yml and config/parameters.yml key/values

- **Example:**

```js
vm.$config.all();
// => {"host": "https://backend.triotech.fr"}
```

### vm.$config.get(key, fallback)


---

### vm.$config.set(key, fallback)

---

### vm.$config.local(key, fallback)

---

## Enum

---

## Env

---

## FS

---

## Hash

### vm.$hash(object)

- **Arguments:**
  - `{Object} object`

- **Returns:** `{String}`

- **Usage:**

Generates a 40 characters length string

::: warning
Doesn't handle special classes inside object
:::

- **Example:**

```js
vm..$hash({ foo: 'bar' });
// => "a75c05bdca7d704bdfcd761913e5a4e4636e956b"
```

---

## i18n

---

## Router

---

## Store

---

## Voca

