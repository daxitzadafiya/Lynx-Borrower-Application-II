<script setup>
import { googleAutoComplete } from "@/mixins/googleAutoComplete.js";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, ref, watch } from "vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { countryHandling } from "@/mixins/countryHandling";
import { useTransactionDetailsStore } from "@/stores/transactionDetailsStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";

const { inputId, geoLocate } = googleAutoComplete("autocomplete");
const borrowersStore = useBorrowersStore();
const loanPropertyStore = useLoanPropertyStore();
const { getCountryCode } = countryHandling();
const transactionStore = useTransactionDetailsStore();
const { isOnlyNum } = number();
const accountAssetsStore = useAccountAndAssetsStore();
const costs = ref([
  { title: "Down Payment", value: 0, prop: "downPaymentAmount" },
  { title: "Loan Amount", value: 0, prop: "loanAmount" },
  { title: "Closing Costs", value: 0, prop: "closingCosts" },
  { title: "Deposits", value: 0, prop: "deposits" },
  {
    title: "Cash From/To the Borrower at Closing",
    value: 0,
    prop: "cashAtClosing",
  },
  { title: "-", value: "", isEmpty: true },
]);
const downPaymentAmount = computed(() => loanPropertyStore.getDownPaymentAmount());
const loanAmount = computed(() => loanPropertyStore.getLoanAmount());

watch(
  () => borrowersStore.autoCompleteAddress,
  (newValue) => {
    handleAddressData(newValue.inputId, newValue.value);
  },
  { deep: true }
);

const handleAddressData = (inputId, addressData) => {
  let property = loanPropertyStore.getProperty()
    ? { ...loanPropertyStore.getProperty(), ...addressData }
    : addressData;
  if (property.CountryCode) {
    property.CountryCode = getCountryCode(property.CountryCode);
  }
  loanPropertyStore.setProperty(property);
};

const address = computed(() => {
  let result = "";
  if (loanPropertyStore.getProperty()) {
    const {
      AddressLineText,
      CityName,
      StateCode,
      PostalCode,
    } = loanPropertyStore.getProperty();
    result = `${AddressLineText || ""} ${CityName || ""} ${StateCode || ""} ${
      PostalCode || ""
    }`;
  }
  return result;
});

const closingCosts = computed(() => {
  const {
    TotalNonSubjectPropertyDebtsToBePaidOffAmount = 0,
    EstimatedClosingCostsAmount = 0,
  } = transactionStore.getTransactionDetails();
  return TotalNonSubjectPropertyDebtsToBePaidOffAmount + EstimatedClosingCostsAmount;
});

const deposits = computed(() => {
  const filtered = accountAssetsStore.getPurchaseCredits().length
    ? accountAssetsStore
        .getPurchaseCredits()
        .filter((item) => item.PurchaseCreditType === "EarnestMoney")
    : [];
  return filtered.length
    ? filtered.reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.PurchaseCreditAmount) ? +cur.PurchaseCreditAmount : 0),
        0
      )
    : 0;
});

const cashAtClosing = computed(() => {
  const {
    CashToBorrowerAtClosingAmount = 0,
    CashFromBorrowerAtClosingAmount = 0,
  } = transactionStore.getTransactionDetails();
  return CashToBorrowerAtClosingAmount + CashFromBorrowerAtClosingAmount;
});

const propMap = ref({
  downPaymentAmount,
  loanAmount,
  closingCosts,
  deposits,
  cashAtClosing,
});

const bindedCosts = computed(() => {
  return costs.value.map((item) => {
    item.value = !item.isEmpty ? propMap.value[item.prop] : "";
    return item;
  });
});
</script>
<template>
  <v-card class="review-details" light flat>
    <v-card-title class="review-details__title table-header-back">
      <span class="review-details__title-text table-header-text">Subject Property</span>
    </v-card-title>

    <v-card-text class="text-block">
      <v-row class="text-block__row">
        <v-col class="no-pad-mobile px-0 property-address" sm="7" cols="12">
          <TextBox
          :sm="12"
            :id="inputId"
            @focus="geoLocate"
            placeholder="Property Address"
            :value="address"
            class="pb-0"
          />
        </v-col>
        <v-col class="no-pad-mobile px-0 property-address2" sm="5" cols="12">
          <TextBox
          :sm="12"
            placeholder="Purchase Price"
            :value="getFormattedValue(loanPropertyStore.getPurchasePrice()) || 0"
            prefix="$"
            @input="(e) => loanPropertyStore.setPurchasePrice(+e.target.value.replace(/,/g, ''))"
            @keypress="(e) => isOnlyNum(e, true)"
          />
        </v-col>
      </v-row>

      <v-row
        v-for="(item, index) in bindedCosts"
        :key="index"
        :class="{
          'table-row-colored': index % 2 === 0,
          'table-row-odd-colored': index % 2 === 1,
          'opacity-0 sm-no-display': item.isEmpty,
        }"
        class="text-block__row"
      >
        <v-col v-if="!item.isEmpty" class="text-block__col" sm="8" cols="6">{{ item.title }}</v-col>
        <v-spacer v-if="!item.isEmpty" />
        <v-col v-if="!item.isEmpty" class="text-block__col right-aligned" sm="3" cols="6">
          <span >$</span>
          <span>{{ !item.isEmpty ? getFormattedValue(item.value) || 0 : "" }}</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>


<style lang="scss" scoped>
:deep(.table-header-back){
  padding: 4px 16px !important;
  span{
    line-height: 32px !important;
    font-weight: 600 !important;
  }
}
.review-details__title-text{
  color: $primary !important;
}
:deep(.right-aligned){
  text-align: right !important;
  text-wrap: nowrap !important;
}
:deep(.text-block__col){
  color: #00000099 !important;
  span{
    color: #00000099 !important;
  }
}

:deep(.v-spacer){
  display: none !important;
}
:deep(.text-block__row){
  justify-content: space-between !important;
}
@media(max-width : $lg-mobile-width){
  .property-address{
    padding-bottom: 0 !important;
  }
  .property-address2{
    padding-top: 0 !important;
  }
}
</style>
