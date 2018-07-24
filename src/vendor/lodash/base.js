export default {
  access(object, key, value) {
    return object[key] || this.extend(object, { [key]: value })[key];
  },
  param(object, prepend = true) {
    return this.reduce(object, (carry, value, key) => `${carry}&${this.encode(key)}=${this.encode(value)}`, '').replace('&', prepend ? '?' : '');
  },
  deparam(string = window.location.search) {
    const qs = {};
    string.replace(new RegExp('([^?=&]+)(=([^&#]*))?', 'g'), ($0, $1, $2, $3) => {
      let key = this.decode($1);
      if (this.endsWith(key, '[]')) {
        key = key.replace('[]', '');
        if (!this.has(qs, key)) {
          qs[key] = [];
        }
        qs[key].push($3);
      } else {
        qs[key] = $3;
      }
    });
    return qs;
  },
  args(array) {
    return this.reduce(array, (carry, arg, index, args) => this.extend(carry, index % 2 === 1 && { [args[index - 1]]: arg }), {});
  },
  flatTree(tree, key = 'id', nodes = 'children') {
    const stack = tree;
    const array = [];
    const map = {};
    while (stack.length > 0) {
      const node = stack.pop();
      const id = node[key];
      if (!map[id]) {
        map[id] = true;
        array.push(node);
      }
      const children = this.get(node, nodes);
      const len = this.get(children, 'length');
      if (len > 0) {
        for (let i = len - 1; i >= 0; i -= 1) {
          stack.push(children[i]);
        }
      }
    }

    return array;
  },
};
