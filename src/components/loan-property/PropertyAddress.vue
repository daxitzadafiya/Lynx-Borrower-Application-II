<script setup>
import { ref, computed, watch } from 'vue'
import AddressEditor from "@/components/core-components/AddressEditor.vue";
import { useLoanPropertyStore } from '@/stores/loanPropertyStore'
import { useGeneralStore } from '@/stores/generalStore';

const loanPropertyStore = useLoanPropertyStore();
const loanPurposeType = ref(loanPropertyStore.getLoanPurposeType());
const Property = ref(loanPropertyStore.getProperty());
const generalStore = useGeneralStore();

watch(
  () => loanPropertyStore.property,
  (newValue) => {
    Property.value = newValue;
  },
  { deep: true }
);

const title = computed(() => {
  return isCityAndStateOnly.value ? "Please enter the city and state where you are searching for a new property." : loanPurposeType.value === "Purchase" ? "Great News! Please enter the property address" : "Please, enter the address for the property you would like to Refinance.";
});

const isNextDisabled = computed(() => {
  if (isCityAndStateOnly.value) {
    return (
      Property.value == null ||
      Property.value?.CityName == "" ||
      Property.value?.CityName?.length === 0 ||
      Property.value?.StateCode == "" ||
      Property.value?.StateCode?.length === 0
    );
  } else {
    return (
      Property.value == null ||
      Property.value?.AddressLineText == "" ||
      Property.value?.AddressLineText?.length === 0 ||
      Property.value?.CityName == "" ||
      Property.value?.CityName?.length === 0 ||
      Property.value?.StateCode == "" ||
      Property.value?.StateCode?.length === 0 ||
      Property.value?.PostalCode == "" ||
      Property.value?.PostalCode?.length === 0
    );
  }
});

const updateAddress = (addressData) =>{
  let property = Property.value ? {...Property.value , ...addressData} : addressData;
  loanPropertyStore.setProperty(property)
};

const updateAddressProp = ({ prop, value }) => {
  loanPropertyStore.setProperty({...Property.value, [prop]: value})
};

const isCityAndStateOnly = computed(()=>{
  return !generalStore.currentLoan.FoundProperty
});

const inputText = computed(()=>{
  return isCityAndStateOnly.value ? "City and State" : "Address"
});
</script>


<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">{{ title }}</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <AddressEditor :addressObj="Property" :mainAddressInputText="inputText" :cityAndStateOnly="isCityAndStateOnly" :isAddressRequired="!isCityAndStateOnly" @addressUpdated="updateAddress"
          @addressPropUpdated="updateAddressProp" uniqueInputId="loan-property-address" :USOnly="true"></AddressEditor>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-container {
  padding: 30px;

  @media(max-width : $tablet-width) {
    padding: 30px 20px;
  }
}

@media(max-width:$mobile-width) {
  .form-container {
    padding: 30px 10px;
  }
}
</style>