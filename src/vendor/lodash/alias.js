export default {
  encode: (string) => window.encodeURIComponent(string),
  decode: (string) => window.decodeURIComponent(string),
};
