import autoload from '@triotech/vue-core/src/lib/core/autoload';

const fields = autoload(require.context('@triotech/vue-core/src/vendor/vue-form-generator/fields', false, /field[\w]+\.js$/));

export default fields;
