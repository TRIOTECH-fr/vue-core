import Vue from 'vue';
import Y from '../helper/y';

const FileSystem = new Vue({
  name: 'FileSystem',
  computed: {
    diskSize: () => 300 * 1024 * 1024,
    blockSize: () => 5 * 1024 * 1024,
    unavailableError: () => 'FileSystem API is unavailable',
    unhandledError: () => 'FileSystem API is unhandled',
  },
  created() {
    this.stat();
  },
  methods: {
    resolveFileSystem() {
      return (window.cordova ? window.resolveLocalFileSystemURL : window.webkitRequestFileSystem).bind(window);
    },
    root() {
      return new Promise((resolve, reject) => {
        const fileSystem = this.resolveFileSystem();
        if (!fileSystem) {
          reject(new Error(this.unavailableError));
        } else if (window.cordova) {
          fileSystem(window.cordova.file.dataDirectory, resolve, reject);
        } else if (navigator.webkitPersistentStorage) {
          navigator.webkitPersistentStorage.requestQuota(this.diskSize, (grantedBytes) => {
            fileSystem(window.PERSISTENT, grantedBytes, (fs) => {
              resolve(fs.root);
            }, reject);
          }, reject);
        } else {
          reject(new Error(this.unhandledError));
        }
      });
    },
    stat() {
      return new Promise((resolve, reject) => {
        if (!this.resolveFileSystem) {
          reject(new Error(this.unavailableError));
        } else if (window.cordova) {
          resolve(0);
        } else if (navigator.webkitPersistentStorage) {
          const toPercentage = (callback, divide, divisor) => callback(100 * (divide / divisor), divide, divisor);
          navigator.webkitPersistentStorage.queryUsageAndQuota(toPercentage.bind(this, resolve), reject);
        } else {
          reject(new Error(this.unhandledError));
        }
      });
    },
    ready() {
      return new Promise((resolve) => {
        if (window.isFilePluginReadyRaised()) {
          resolve();
        } else {
          window.addEventListener('filePluginIsReady', resolve, false);
        }
      });
    },
    read(name, withBuffer = true) {
      const self = this;
      const moment = this.$moment();
      return new Promise((resolve, reject) => {
        this.root().then((dirEntry) => {
          dirEntry.getFile(name, {}, (fileEntry) => {
            fileEntry.file((file) => {
              if (file.size === 0) {
                fileEntry.remove(() => {
                  reject(new Error(`${name} exists but is empty`));
                });
              } else if (withBuffer) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (reader.error) {
                    return reject(new Error(reader.error));
                  } else if (!reader.result) {
                    return fileEntry.remove(() => {
                      reject(new Error(`${name} exists and not empty but not readable`));
                    });
                  }
                  file.buffer = reader.result;
                  console.debug('fs.read', { name, withBuffer }, `${self.$moment().diff(moment) / 1000}s`);
                  return resolve(file);
                };
                reader.onerror = fileEntry.remove;
                reader.readAsArrayBuffer(file);
              } else {
                resolve(file);
              }
            });
          }, reject);
        }, reject);
      });
    },
    write(name, buffer) {
      const self = this;
      const moment = this.$moment();
      return new Promise((resolve, reject) => {
        this.root().then((dirEntry) => {
          dirEntry.getFile(name, { create: true }, (fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
              fileWriter.onerror = (event) => {
                this.unlink(name).then(reject.bind(this, event.target.error)).catch(reject);
              };
              Y(next => (bytesWritten, callback) => {
                const totalSize = buffer.byteLength;
                const blockSize = Math.min(this.blockSize, totalSize - bytesWritten);
                const nextSize = bytesWritten + blockSize;
                fileWriter.write(new Blob([new Uint8Array(buffer.slice(bytesWritten, nextSize))]));
                fileWriter.onwrite = () => {
                  // eslint-disable-next-line
                  console.debug(name, 100 * nextSize / totalSize, nextSize === fileWriter.length);
                  if (nextSize < totalSize) {
                    next(nextSize, callback);
                  } else if (_.isFunction(callback)) {
                    console.debug('fs.write', { name, totalSize }, `${self.$moment().diff(moment) / 1000}s`);
                    callback();
                  }
                };
              })(0, resolve.bind(this, buffer));
            });
          }, reject);
        }, reject);
      });
    },
    list() {
      return new Promise((resolve, reject) => {
        this.root().then((dirEntry) => {
          const dirReader = dirEntry.createReader();
          dirReader.readEntries((fileEntries) => {
            resolve(fileEntries);
          }, reject);
        }).catch(reject);
      });
    },
    unlink(name) {
      return new Promise((resolve, reject) => {
        this.root().then((dirEntry) => {
          dirEntry.getFile(name, { }, (fileEntry) => {
            fileEntry.remove(resolve, reject);
          }, reject);
        }, reject);
      });
    },
    clear() {
      return new Promise((resolve, reject) => {
        this.root().then((dirEntry) => {
          const dirReader = dirEntry.createReader();
          dirReader.readEntries((fileEntries) => {
            fileEntries.forEach((fileEntry) => {
              fileEntry.remove(resolve, reject);
            });
          }, reject);
        }).catch(reject);
      });
    },
    download(data, filename, mime) {
      const blob = this._.isBlob(data) ? data : new Blob([data], { type: mime || 'application/octet-stream' });
      // IE
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename);
        return;
      }

      const blobURL = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobURL;
      tempLink.setAttribute('download', filename);

      // Safari
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
      }

      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      // Firefox
      setTimeout(window.URL.revokeObjectURL.bind(window.URL, blobURL), 100);
    },
  },
});

Vue.set(Vue.prototype, '$fs', FileSystem);

export default FileSystem;
