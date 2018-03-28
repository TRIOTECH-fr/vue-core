export default {
  isBlob: value => value instanceof Blob,
  isFile: value => value instanceof File,
  isEvent: value => value instanceof Event,
  isProgressEvent: value => value instanceof ProgressEvent,
  isXHR: value => value instanceof XMLHttpRequest,
};
