<script setup>
import AddressEditor from "@/components/core-components/AddressEditor.vue";
import { countryHandling } from "@/mixins/countryHandling";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { computed } from "vue";

const { getCountryCode } = countryHandling();
const realEstateStore = useRealEstateStore();
const loanPropertyStore = useLoanPropertyStore();

const updateRealEstateAddressProp = ({ prop, value }) => {
  let updatedRealEstate = {
    ...currentRealEstate.value,
    [prop]: prop !== "ContryCode" ? value : getCountryCode(value),
  };
  if (!updatedRealEstate.OwnershipType) {
    updatedRealEstate.OwnershipType = "Individual";
  }
  let RealEstates = [...realEstateStore.getRealEstate()];
  RealEstates[realEstateStore.getRealEstateEditingIndex()] = updatedRealEstate;
  realEstateStore.setRealEstate(RealEstates);
};

const updateAddress = (value) => {
  let updatedRealEstate = {
    ...currentRealEstate.value,
    ...value,
  };
  if (!updatedRealEstate.OwnershipType) {
    updatedRealEstate.OwnershipType = "Individual";
  }
  let RealEstates = [...realEstateStore.getRealEstate()];
  RealEstates[realEstateStore.getRealEstateEditingIndex()] = updatedRealEstate;
  realEstateStore.setRealEstate(RealEstates);
  checkOwnedPropertySubjectIndicator();
};

const checkOwnedPropertySubjectIndicator = () => {
  const propertyAddress =
    loanPropertyStore.getProperty() && loanPropertyStore.getProperty().AddressLineText;
  const realEstateAddress =
    currentRealEstate.value && currentRealEstate.value.AddressLineText;
  if (!propertyAddress || !realEstateAddress) return;

  const isIndicator = propertyAddress.trim() === realEstateAddress.trim();
  updateRealEstateAddressProp({
    prop: "OwnedPropertySubjectIndicator",
    value: isIndicator,
  });
};

const previousClicked = () => {
  realEstateStore.setRealEstate([]);
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
      <div class="header-text">Please enter the property address</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <AddressEditor
          :addressObj="currentRealEstate"
          @addressUpdated="updateAddress"
          @addressPropUpdated="updateRealEstateAddressProp"
          uniqueInputId="mailing"
        ></AddressEditor>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons @previousClicked="previousClicked()"></NavigationButtons>
    </div>
  </div>
</template>
