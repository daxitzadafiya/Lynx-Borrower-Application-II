<script setup>
import { googleAutoComplete } from "@/mixins/googleAutoComplete.js";
import { watch, defineEmits } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const props = defineProps({
  value: {
    type: String,
    required: false,
  },
  uniqueInputId: {
    type: Number,
    required: false
  },
});

const borrowersStore = useBorrowersStore();

const { inputId, geoLocate } = googleAutoComplete(props.uniqueInputId);
const emit = defineEmits(["setAddressData"]);

watch(
  () => borrowersStore.autoCompleteAddress,
  (newValue) => {
    handleAddressData(newValue.inputId, newValue.value);
  },
  { deep: true }
);

const handleAddressData = (inputId,address) => {
  if (inputId) {
    emit("setAddressData",{inputId,...address})
  }
};
</script>
<template>
  <TextBox
    :id="`${inputId}`"
    @focus="geoLocate"
    placeholder="Address"
    :value="value == null ? '' : value"
    @onChange="(val) => handleAddressData(inputId,val)"
  ></TextBox>
</template>
<style lang="sass" scoped></style>
