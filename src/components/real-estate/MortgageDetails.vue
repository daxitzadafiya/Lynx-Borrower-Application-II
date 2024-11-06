<script setup>
import MortgageDetailsData from "@/components/real-estate/mortgage-details/MortgageDetailsData.vue";
import { computed } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";

const realEstateStore = useRealEstateStore();

const currentRealEstate = computed(() => {
  return (
    realEstateStore.getRealEstate()[realEstateStore.getRealEstateEditingIndex()] || {}
  );
});

</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Mortgage details for
        {{ currentRealEstate.AddressLineText || "this property" }}
      </div>
    </div>
    <MortgageDetailsData></MortgageDetailsData>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
