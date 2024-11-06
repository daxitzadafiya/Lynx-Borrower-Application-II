<script setup>
import Declarations_5 from "@/components/images/declarations/Declarations5.vue";
import { computed } from "vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";

const loanPropertyStore = useLoanPropertyStore();

const setMixedUseProp = (val) => {
  const property = loanPropertyStore.getProperty()
    ? { ...loanPropertyStore.getProperty(), PropertyMixedUsageIndicator: val }
    : { PropertyMixedUsageIndicator: val };
  loanPropertyStore.setProperty(property);
};

const mixedUseValue = computed(() => {
  if (
    loanPropertyStore.getProperty() &&
    loanPropertyStore.getProperty().hasOwnProperty("PropertyMixedUsageIndicator")
  ) {
    return loanPropertyStore.getProperty().PropertyMixedUsageIndicator;
  } else {
    return null;
  }
});
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        If you are occupying this property, will you set aside space within the property
        to operate your own business?
      </div>
      <Declarations_5 />
      <v-form class="my-5">
        <AgreeToggle :value="mixedUseValue" @input="setMixedUseProp"></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    width: auto;
    height: auto;
    margin: 20px 0;
    max-height: 375px;
    @media (max-width: $mobile-width) {
      width: 100%;
    }
  }
}
.v-btn-group--density-default.v-btn-group {
  padding: 0;
  overflow: visible;
}
</style>