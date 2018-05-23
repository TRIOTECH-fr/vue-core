import Vue from 'vue';
import VueSelectImage from '../../vue-select-image';
import Mixins from './mixins';
import Ajax from '@triotech/vue-core/src/lib/plugins/ajax';

Vue.component('fieldGallery', {
  components: {
    VueSelectImage,
  },
  mixins: Mixins,
  data() {
    return {
      galleryModel: [],
      dataImages: [],
      isMultiple: this.schema.selectOptions.multiple,
    };
  },
  computed: {
    value() {
      return this.galleryModel;
    },
  },
  watch: {
    model(newValue) {
      if (Object.keys(newValue).length < 1) {
        this.galleryModel = null;
      }
    },
    galleryModel(newValue, oldValue) {
      this.galleryModel = this._.isNull(newValue) ? [] : newValue;
      this.setModelValueByPath(this.schema.model, newValue);
    },
  },
  mounted() {
    this._.each(this.schema.choices, (choice) => {
      this.dataImages.push({
        id: choice.id,
        src: `${this.$config.host}/uploads${choice.url}`,
        alt: choice.label,
      });
    });
    this.galleryModel = this.modelNameToProperty(this.schema.model, this.model);
  },
  methods: {
    getSelectedImages() {
      return [{
        id: this.model.image ? String(this.model.image.id) : null,
      }];
    },
    onSelectImage(images) {
      this.galleryModel = images.id;
    },
    onSelectMultipleImage(images) {
      this._.each(images, (image) => {
        this.galleryModel.push(image.id);
      });
    },
  },
  template: `
    <vue-select-image
      :dataImages="dataImages"
      :is-multiple="isMultiple"
      :selectedImages="getSelectedImages()"
      @onselectimage="onSelectImage"
      @onselectmultipleimage="onSelectMultipleImage"
    >
    </vue-select-image>
  `,
});
