import { MaskInput } from 'maska';

export default {
  mounted(el, binding) {
    const input = el.querySelector('input') || el;

    el.mask = new MaskInput(input, {
      mask: binding.value,
      postProcess: (maskedValue) => {
        input.value = maskedValue;
        return maskedValue;
      }
    });

    input.addEventListener('input', function (e) {
      const unmaskedValue = el.mask.items.get(input)?.unmasked(e.target.value);
      input.dataset.unmaskedValue = unmaskedValue; 
    });
  },
  updated(el, binding) {
    if (el.mask) {
      el.mask.update({ mask: binding.value });
    }
  },
  unmounted(el) {
    if (el.mask) {
      el.mask.destroy();
    }
  }
};
