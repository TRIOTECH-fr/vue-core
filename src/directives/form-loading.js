const createHiddenInput = (element, form) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', element.name);
  input.setAttribute('value', element.value);
  form.appendChild(input);
};

const toggle = (enable, form, binding) => {
  const { value } = binding;
  const button = {
    label: typeof value === 'object' ? value.html : value,
    className: typeof value === 'object' ? value.class : '',
  };

  // disable submit button
  const submitEl = form.querySelector('[type="submit"]');
  submitEl.disabled = !enable;
  if (button.className !== '') {
    submitEl.classList.add(button.className);
  }

  const prop = submitEl.tagName === 'INPUT' ? 'value' : 'innerHTML';
  if (enable) {
    submitEl[prop] = submitEl.dataset[prop];
    delete submitEl.dataset[prop];
  } else {
    submitEl.dataset[prop] = submitEl[prop];
    if (value && button.label) {
      submitEl[prop] = button.label;
    } else {
      submitEl[prop] = `${submitEl[prop]}...`;
    }
  }

  // disable all inputs
  form.querySelectorAll('input, select, textarea').forEach((element) => {
    if (element.tagName === 'SELECT' || element.type === 'range') {
      createHiddenInput(element, form);
      element.disabled = !enable;
    } else if (element.type === 'radio' || element.type === 'checkbox') {
      if (element.checked) {
        createHiddenInput(element, form);
      }
      element.disabled = !enable;
    } else {
      element.readOnly = !enable;
    }
  });
};

const submitListeners = {};
const { addEventListener } = Element.prototype;

Element.prototype.addEventListener = function eventListenerHook(type, listener, options) {
  if (this.tagName === 'FORM' && type === 'submit') {
    const key = this.getAttributeNames().join('-');
    submitListeners[key] = {
      listener,
      options,
    };
  }
  addEventListener.call(this, type, listener, options);
};

export default {
  install(Vue/* , options */) {
    Vue.directive('loading', (form, binding) => {
      const submitListener = submitListeners[form.getAttributeNames().join('-')];
      if (submitListener) {
        form.removeEventListener('submit', submitListener.listener, submitListener.options);
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const promise = submitListener.listener(event);
          if (promise instanceof Promise) {
            toggle(false, form, binding);
            promise.finally(toggle.bind(null, true, form, binding));
          }
        });
      }
    });
  },
};
