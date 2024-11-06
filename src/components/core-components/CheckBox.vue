<script setup>
import { defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  isChecked: {
    type: Boolean,
    required: false,
    default: false
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  id: {
    type: String,
    required: false,
  },
  hideDetails: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emit = defineEmits(['toggle']);
const toggle = (value) => {
  emit("toggle", value);
};

</script>

<template>
  <div class="form-checkbox">
    <v-checkbox
      :label="props.label"
      :hide-details="props.hideDetails"
      :id="props.id"
      :model-value="props.isChecked"
      @click="(e) => toggle(e.target.checked)"
      :disabled="disabled"
    ></v-checkbox>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-checkbox .v-selection-control.v-selection-control--dirty .v-selection-control__input) {
  color: $primary-input-control !important;
}
:deep(.v-checkbox .v-selection-control) {
  min-height: 40px ;
}
</style>
