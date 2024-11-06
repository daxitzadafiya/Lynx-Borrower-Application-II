<script setup>
import { computed } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";

const realEstateStore = useRealEstateStore();
const { isOnlyNum } = number();

const setRealEstateValue = (value) => {
  const realEstate = {
    ...currentRealEstate.value,
    PropertyEstimatedValueAmount: value,
  };
  let realEstates = [...realEstateStore.getRealEstate()];
  realEstates[realEstateStore.getRealEstateEditingIndex()] = realEstate;
  realEstateStore.setRealEstate(realEstates);
};

const currentRealEstate = computed(() => {
  return (
    realEstateStore.getRealEstate()[realEstateStore.getRealEstateEditingIndex()] || {}
  );
});
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div
        class="header-text"
        v-if="currentRealEstate.PropertyDispositionStatusType === 'Sold'"
      >
        What is the Sales Price for
        {{ currentRealEstate.AddressLineText || "this property" }}?
      </div>
      <div class="header-text" v-else>
        What is the value of {{ currentRealEstate.AddressLineText || "this property" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <TextBox
          prefix="$"
          placeholder="Property Value"
          :value="getFormattedValue(currentRealEstate.PropertyEstimatedValueAmount)"
          @input="(e) => setRealEstateValue(+e.target.value.replace(/,/g, ''))"
          @keypress="(e) => isOnlyNum(e, true)"
        ></TextBox>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

