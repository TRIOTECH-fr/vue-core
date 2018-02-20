import Vue from 'vue';

const FileSystem = new Vue({
  name: 'FileSystem',
  methods: {
    root() {
      return new Promise((resolve, reject) => {
        if (window.cordova) {
          this.ready().then(window.resolveLocalFileSystemURL.bind(window, window.cordova.file.dataDirectory, resolve, reject));
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
    read(dirEntry, name) {
      return new Promise((resolve, reject) => {
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
              return resolve({ buffer: reader.result, file });
            };
            reader.onerror = fileEntry.remove;
            return reader.readAsArrayBuffer(file);
          });
        }, reject);
      });
    },
    write(dirEntry, name, buffer) {
      return new Promise((resolve, reject) => {
        dirEntry.getFile(name, { create: true }, (fileEntry) => {
          fileEntry.createWriter((fileWriter) => {
            fileWriter.onwriteend = resolve.bind(this, buffer);
            fileWriter.onerror = reject;
            fileWriter.write(new Blob([new Uint8Array(buffer)]));
          });
        }, reject);
      });
    },
    unlink(fileEntry) {
      return new Promise((resolve, reject) => {
        fileEntry.remove(resolve, reject);
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
