export default {
  dataURIToObjectURL(dataURI) {
    return this.blobToObjectURL(this.dataURIToBlob(dataURI));
  },
  base64ToObjectURL(base64, type) {
    return this.blobToObjectURL(this.base64ToBlob(base64, type));
  },
  stringToObjectURL(string, type) {
    return this.blobToObjectURL(this.stringToBlob(string, type));
  },
  typedArrayToObjectURL(typedArray, type) {
    return this.blobToObjectURL(this.typedArrayToBlob(typedArray, type));
  },
  blobToObjectURL(blob) {
    return window.URL.createObjectURL(blob);
  },
  dataURIToBlob(string) {
    const [header, base64] = string.split(',');
    return this.base64ToBlob(base64, header.replace('data:', '').replace(';base64', ''));
  },
  base64ToBlob(string, type) {
    return this.stringToBlob(window.atob(string), type);
  },
  stringToBlob(string, type) {
    return this.typedArrayToBlob(this.stringToTypedArray(string), type);
  },
  stringToTypedArray(string) {
    const stringLength = string.length;
    const arrayBuffer = new ArrayBuffer(stringLength);
    const view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < stringLength; i += 1) {
      view[i] = string.charCodeAt(i);
    }

    return view;
  },
  typedArrayToBlob(typedArray, type = 'image/jpeg') {
    return new Blob([typedArray], { type });
  },
  stringToArrayBuffer(string) {
    return this.stringToTypedArray(string).buffer;
  },
  arrayBufferToString(arrayBuffer) {
    let string = '';
    const view = new Uint8Array(arrayBuffer);
    const viewLength = view.length;

    for (let i = 0; i < viewLength; i += 1) {
      string += String.fromCharCode(view[i]);
    }

    return string;
  },
};
