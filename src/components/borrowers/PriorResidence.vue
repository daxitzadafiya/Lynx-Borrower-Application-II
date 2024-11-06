<script setup>
import { computed, ref } from 'vue';
import AddressEditor from "@/components/core-components/AddressEditor.vue";
import { useBorrowersStore } from "@/stores/borrowersStore.js";
const { getSpecificResidence,updateResidenceProp, updateResidence } = useBorrowersStore();
const residenceType = ref("Prior");

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
const priorResidence = computed(() => {
  return getSpecificResidence("Prior");
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Since you have not lived at your current residence for at least 2 years, please enter your
        previous residence.</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <AddressEditor uniqueInputId="prior-residence" :addressObj="priorResidence" @addressPropUpdated="updateAddressProp" @addressUpdated="updateAddress"> </AddressEditor>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

