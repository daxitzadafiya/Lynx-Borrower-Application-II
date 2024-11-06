<script setup>
import { computed, ref } from 'vue'
import { useLoanPropertyStore } from '@/stores/loanPropertyStore'
import { useGeneralStore } from '@/stores/generalStore';
import { useBorrowersStore } from '@/stores/borrowersStore'
import { number } from "@/mixins/onlyNum";
import { getFormattedValue } from "@/mixins/currencyFormat.js";

const loanPropertyStore = useLoanPropertyStore();
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const loanPurposeType = ref(loanPropertyStore.getLoanPurposeType());
const Property = ref(loanPropertyStore.getProperty());
const { isOnlyNum } = number();

const title = computed(()=> {
  let result =
        "What is the Estimated Purchase Price of the Property you are Buying";
  if(loanPurposeType.value === "Refinance"){
    result =
          "What is the Estimated value of the property you are Refinancing";
  }
  return result;
});

const isNextButtonDisabled = computed(() => {
  return loanPurposeType.value === "Refinance" && Property.value ?
    Property.value.PropertyEstimatedValueAmount == null || Property.value.PropertyEstimatedValueAmount == 0 :
    generalStore.currentLoan.EstimatedPurchasePrice == null || generalStore.currentLoan.EstimatedPurchasePrice === 0
});

const getCorrectValue = () => {
  if (generalStore.currentLoan) {
    return loanPurposeType.value === "Refinance" && Property.value ? getFormattedValue(Property.value.PropertyEstimatedValueAmount) : getFormattedValue(generalStore.currentLoan.EstimatedPurchasePrice)
  }
};

const setEstimatedValue = (e) => {
  let prop = "EstimatedPurchasePrice";
  prop =
    loanPurposeType.value === "Refinance"
      ? "PropertyEstimatedValueAmount"
      : prop;
  if (prop === "PropertyEstimatedValueAmount") {
    const property = Property.value ? { ...Property.value, [prop]: e } : { [prop]: e };
    loanPropertyStore.setProperty(property)
  } else {
    borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, [prop]: e })
  }
};
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">{{ title }}?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <TextBox
          prefix="$"
          :isRequired="true"
          :placeholder="loanPurposeType === 'Refinance' ? 'Estimated Property Value' : 'Estimated Purchase Price'"
          :value="getCorrectValue()"
          @input="(e) => setEstimatedValue(+e.target.value.replace(/,/g, ''))"
          @keypress="(e) => isOnlyNum(e, true)"
        ></TextBox>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextButtonDisabled"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.form-container) {
  margin: -10px -10px;
}
:deep(.v-field__field) {
  align-items: center !important;
  height: 40px;
}
:deep(.v-text-field--prefixed.v-text-field .v-field__input ){
  padding: 10px 10px 10px 4px !important;
}
:deep(.v-text-field__prefix){
  padding: 0 0 0 12px
} 
:deep(.v-field__field){
    align-items: center !important;
}
</style>