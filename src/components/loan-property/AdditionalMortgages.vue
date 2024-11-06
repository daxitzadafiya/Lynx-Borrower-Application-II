<script setup>
import AdditionalMortgages from "../images/loan-property/AdditionalMortgages.vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { computed, ref, watch } from "vue";

const loanPropertyStore = useLoanPropertyStore();

const Property = ref(loanPropertyStore.getProperty());

watch(
  () => loanPropertyStore.property,
  (newValue) => {
    Property.value = newValue;
  },
  { deep: true }
);

const additionalMortgagesValue = computed(() => {
  if (
    Property.value.HasAdditionalMortgages === null ||
    Property.value.HasAdditionalMortgages === undefined
  ) {
    return null;
  } else {
    return Property.value.HasAdditionalMortgages;
  }
});

const isNextDisabled = computed(() => {
  return additionalMortgagesValue.value === null;
});

const setAdditionalMortgage = (bool) => {
  loanPropertyStore.setProperty({ ...Property.value, HasAdditionalMortgages: bool });
};
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will you be taking out any additional mortgages on the property you are
        purchasing?
      </div>
      <div class="mortages-img">
        <AdditionalMortgages />
      </div>
      <v-form class="my-5">
        <AgreeToggle
          :value="additionalMortgagesValue"
          @input="setAdditionalMortgage"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mortages-img {
  margin: 70px 0;
  @media(max-width: $mobile-width) {
    margin:  30px 0;
  }
}

.image-content-type {
  .image-container {
    .mortages-img {
      svg {
        height: 245px;
        width: 436px;
        @media(max-width: $mobile-width) {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

</style>
