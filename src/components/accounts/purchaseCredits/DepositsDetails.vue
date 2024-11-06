<script setup>
import { computed, ref } from "vue";
import DepositsDetailsData from "./DepositsDetailsData.vue";

const isFormValid = ref(false);
const updateValidationStatus = (isValid) => {
  isFormValid.value = isValid;
};

const depositDetailsValidation = computed(() => {
  return isFormValid.value;
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the amount of the deposit(s)</div>
    </div>
    <DepositsDetailsData
      @validation-status="updateValidationStatus"
    ></DepositsDetailsData>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="depositDetailsValidation"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
