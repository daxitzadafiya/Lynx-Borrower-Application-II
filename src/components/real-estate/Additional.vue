<script setup>
import Start from "@/components/images/real-estate/Start.vue";
import { computed, ref } from "vue";
import { loanPatch } from "@/mixins/loanPatch.js";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";

const loanPropertyStore = useLoanPropertyStore();
const { saveAndAdvance } = loanPatch();
const additionalRealEstate = ref(null);
const realEstateStore = useRealEstateStore();

const setIndexAndRedirect = () => {
  if (additionalRealEstate.value) {
    realEstateStore.setRealEstateEditingIndex(realEstateStore.getRealEstate().length);
    saveAndAdvance(true, "/accountsandassets/address");
  } else {
    saveAndAdvance(true, "/accountsandassets/review");
  }
};

const setAdditionalRealEstate = (bool) => {
  additionalRealEstate.value = bool;
};

const title = computed(() => {
  if (loanPropertyStore.getLoanPurposeType() == "Purchase") {
    if (realEstateStore.getRealEstate().length == 0) {
      return "Do you currently own any Real Estate?";
    } else {
      return "Do you own any additional Real Estate?";
    }
  } else {
    return "Do you own any additional Real Estate?";
  }
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <Start />
      <v-form class="my-5">
        <AgreeToggle
          :value="additionalRealEstate"
          @input="setAdditionalRealEstate"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="setIndexAndRedirect"
        :ConditionsMet="additionalRealEstate === null"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    width: auto;
    height: auto;
    margin: 20px 0;
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
