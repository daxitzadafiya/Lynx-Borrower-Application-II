<script setup>
import { defineEmits, ref, watch } from "vue";
const props = defineProps({
  options: {
    type: Array,
    required: false,
    default: [
      {
        label: "YES",
        value: true,
      },
      {
        label: "NO",
        value: false,
      },
    ],
  },
  value: {
    required: false,
  },
  isOn: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
  },
});

const emit = defineEmits(["change"]);
const selectedOption = ref(props.value);
const onHandleChange = (e) => {
  emit("change", selectedOption.value);
};

watch(
  () => props.value,
  (newValue) => {
    selectedOption.value = newValue;
  },
  { deep: true }
);
</script>

<template>
  <v-radio-group v-model="selectedOption" :label="label" @change="onHandleChange">
    <v-radio
      color="primary"
      v-for="option in options"
      :key="option.label"
      :label="option.label"
      :value="option.value"
      class="options"
    ></v-radio>
  </v-radio-group>

</template>

<style scoped lang="scss">
:deep(.text-primary) {
  color: $primary-input-control !important;
}
:deep(.v-input__details){
  display: none !important;
}
</style>
