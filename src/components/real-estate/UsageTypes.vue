<script setup>
import { useRealEstateStore } from "@/stores/realEstateStore";
import { computed } from "vue";
import UsageTypesData from "@/components/real-estate/usage-types/UsageTypesData.vue";
const realEstateStore = useRealEstateStore();

const currentRealEstate = computed(() => {
  return (
    realEstateStore.getRealEstate()[realEstateStore.getRealEstateEditingIndex()] || {}
  );
});

const isNextDisabled = computed(() => {
  return (
    (currentRealEstate.value.PropertyDispositionStatusType === "Retain" &&
      !currentRealEstate.value.PropertyIntendedUsageType) ||
    !currentRealEstate.value.PropertyCurrentUsageType
  );
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please indicate your current and intended usage of
        {{ currentRealEstate.AddressLineText || "this property" }}?
      </div>
    </div>
    <v-form class="fast-fail form-outer-container">
      <v-row class="form-container">
        <UsageTypesData></UsageTypesData>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>
