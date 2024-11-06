<script setup>
import { ref, computed } from "vue";
import { useGeneralStore } from "@/stores/generalStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";

const generalStore = useGeneralStore();
const loanPropertyStore = useLoanPropertyStore();
const currentLoan = ref(generalStore.currentLoan);
const { isOnlyNum } = number();

const correctLabel = computed(() => {
  return currentLoan.value && currentLoan.value?.SalesContract
    ? "Sales Contract Amount"
    : "Estimated Sales Price";
});

const title = computed(() => {
  if (currentLoan.value && currentLoan.value?.SalesContract) {
    return "What is the Sales Contract Amount for this Purchase?";
  }
  return "What is the Estimated Sales Price of the Property you are Purchasing?";
});

const isNextButtonDisabled = computed(() => {
  return (
    loanPropertyStore.getPurchasePrice() == null ||
    loanPropertyStore.getPurchasePrice().length === 0
  );
});
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">{{ title }}</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <TextBox
          prefix="$"
          :isRequired="true"
          :placeholder="correctLabel"
          :value="getFormattedValue(loanPropertyStore.getPurchasePrice())"
          @input="(e) => loanPropertyStore.setPurchasePrice(+e.target.value.replace(/,/g, ''))"
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
