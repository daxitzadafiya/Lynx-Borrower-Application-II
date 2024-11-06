<script setup>
import { computed, ref } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";
import moment from "moment";

const maxDate = ref(new Date().toISOString().slice(0, 10));
const realEstateStore = useRealEstateStore();

const setRealEstateDate = (date) => {
  const realEstate = {
    ...currentRealEstate.value,
    ClosingDate: moment(new Date(date)).format("YYYY-MM-DD"),
  };
  let realEstates = [...realEstateStore.getRealEstate()];
  realEstates[realEstateStore.getRealEstateEditingIndex()] = realEstate;
  realEstateStore.setRealEstate(realEstates);
};

const clearRealEstateDate = () => {
  const realEstate = {
    ...currentRealEstate.value,
    ClosingDate: null,
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
        Please enter the date of closing for
        {{ currentRealEstate.AddressLineText || "this property" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <DateInput
          placeholder="Closing Date"
          @dateUpdated="setRealEstateDate"
          @dateCleared="clearRealEstateDate"
          :value="currentRealEstate.ClosingDate"
          :maxDate="maxDate"
        ></DateInput>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>


