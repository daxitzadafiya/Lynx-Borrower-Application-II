<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { computed } from "vue";

const { isOnlyNum } = number();
const realEstateStore = useRealEstateStore();

const setRentalIncome = (value) => {
  const realEstate = {
    ...currentRealEstate.value,
    PropertyRentalIncomeGrossAmount: value,
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
      <div class="header-text">
        Does or will {{ currentRealEstate.AddressLineText || "this property" }} generate
        any rental income?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <v-col class="itemContainer pb-0" sm="12">
          <div>Just click next if you do not or will not receive any rental income.</div>
        </v-col>
        <TextBox
          prefix="$"
          placeholder="Monthly Rental Income"
          :value="getFormattedValue(currentRealEstate.PropertyRentalIncomeGrossAmount)"
          @input="(e) => setRentalIncome(+e.target.value.replace(/,/g, ''))"
          @keypress="(e) => isOnlyNum(e, true)"
        ></TextBox>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

