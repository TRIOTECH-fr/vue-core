import Vue from 'vue';
import Y from '@triotech/vue-core/src/lib/plugins/y';

const FileSystem = new Vue({
  name: 'FileSystem',
  computed: {
    blockSize: () => 5 * 1024 * 1024,
  },
  methods: {
    root() {
      return new Promise((resolve, reject) => {
        if (window.cordova) {
          window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory, resolve, reject);
        } else {
          navigator.webkitPersistentStorage.requestQuota(100 * 1024 * 1024, (grantedBytes) => {
            window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, (fs) => {
              resolve(fs.root);
            }, reject);
          }, reject);
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
    read(name) {
      return new Promise((resolve, reject) => {
        this.root().then((dirEntry) => {
          dirEntry.getFile(name, {}, (fileEntry) => {
            fileEntry.file((file) => {
              if (file.size === 0) {
                return fileEntry.remove(() => {
                  reject(new Error(`${name} exists but is empty`));
                });
              }
              const reader = new FileReader();
              reader.onloadend = () => {
                if (reader.error) {
                  reject(new Error(reader.error));
                } else if (!reader.result) {
                  return fileEntry.remove(() => {
                    reject(new Error(`${name} exists and not empty but not readable`));
                  });
                }
                file.buffer = reader.result;
                return resolve(file);
              };
              reader.onerror = fileEntry.remove;
              return reader.readAsArrayBuffer(file);
            });
          }, reject);
        }, reject);
      });
    },
    write(name, buffer) {
      return new Promise((resolve, reject) => {
        this.root().then((dirEntry) => {
          dirEntry.getFile(name, { create: true }, (fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
              fileWriter.onerror = () => {
                this.unlink(name).then(reject).catch(reject);
              };
              Y(next => (bytesWritten, callback) => {
                const totalSize = buffer.byteLength;
                const blockSize = Math.min(this.blockSize, totalSize - bytesWritten);
                const nextSize = bytesWritten + blockSize;
                // if (bytesWritten > 0) {
                //   fileWriter.seek(fileWriter.length);
                // }
                fileWriter.write(new Blob([new Uint8Array(buffer.slice(bytesWritten, nextSize))]));
                fileWriter.onwrite = () => {
                  // eslint-disable-next-line
                  console.debug(name, 100 * nextSize / totalSize, nextSize === fileWriter.length);
                  if (nextSize < totalSize) {
                    next(nextSize, callback);
                  } else if (_.isFunction(callback)) {
                    callback();
                  }
                };
              })(0, resolve.bind(this, buffer));
            });
          }, reject);
        }, reject);
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
  },
});

Vue.set(Vue.prototype, '$fs', FileSystem);

export default FileSystem;
