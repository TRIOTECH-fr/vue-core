import Vue from 'vue';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';

Vue.component('multiselect', {
  functional: true,
  render (h, context) {
    console.log(context);
    return h( Multiselect, {
      props: {
        options: context.props.options,
        placeholder: context.parent.$t(`placeholders.${context.props.id}.${context.props.multiple ? 'multiple' : 'single'}`),
        label: context.props.label,
        // trackBy: context.props.value,
        multiple: context.props.multiple,
        selectLabel: '',
        selectedLabel: '',
        deselectLabel: '',
        preserveSearch: true,
      },
    });
  },
});
