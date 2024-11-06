<script setup>
import AddressEditor from '@/components/core-components/AddressEditor.vue'
import { computed, ref } from 'vue'
import { useBorrowersStore } from "@/stores/borrowersStore.js";

const { getSpecificResidence,updateResidenceProp, updateResidence } = useBorrowersStore();
const residenceType = ref('Current')
const currentResidence = computed(() => getSpecificResidence(residenceType.value))

const updateAddress = (addressData) => {
  updateResidence({
    type: residenceType.value,
    value: addressData,
  });
};
const updateAddressProp = ({ prop, value }) => {
  updateResidenceProp({
    type: residenceType.value,
    value: value,
    prop: prop,
  })
};

const isNextButtonDisabled = computed(()=>{
  return (
    currentResidence.value == null ||
    currentResidence.value.AddressLineText == null ||
    currentResidence.value.AddressLineText.length === 0 ||
    currentResidence.value.CityName == null ||
    currentResidence.value.CityName.length === 0 ||
    currentResidence.value.StateCode == null ||
    currentResidence.value.StateCode.length === 0 ||
    currentResidence.value.PostalCode == null ||
    currentResidence.value.PostalCode.length === 0
  );
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        You must provide at least 2 years of residency information. Let's start with your current
        residence
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <AddressEditor
          :isAddressRequired="true"
          :addressObj="currentResidence"
          @addressUpdated="updateAddress"
          @addressPropUpdated="updateAddressProp"
          uniqueInputId="residency-address"
        ></AddressEditor>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextButtonDisabled"></NavigationButtons>
    </div>
  </div>
</template>
