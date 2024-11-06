<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useGeneralStore } from "@/stores/generalStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { computed, onMounted, ref, watch } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { number } from "@/mixins/onlyNum";

const generalStore = useGeneralStore();
const loanPropertyStore = useLoanPropertyStore();
const Property = ref(loanPropertyStore.getProperty());
const borrowersStore = useBorrowersStore();
const { isOnlyNum } = number();

watch(
  () => loanPropertyStore.property,
  (newValue) => {
    Property.value = newValue;
  },
  { deep: true }
);

watch(
  () => generalStore.currentLoan,
  (newValue, oldValue) => {
    if (newValue.Id && oldValue.Id && newValue.Id !== oldValue.Id) {
      setInitialDownpayments();
    }
  },
  { deep: true }
);

onMounted(() => {
  setInitialDownpayments();
});

const isNextDisabled = computed(() => {
  return loanPropertyStore.getDownPaymentAmount() === 0;
});

const setAmount = (value) => {
  let percentage = loanPropertyStore.getDownPaymentPercentage() || 0;
  let amount = value;
  let loanAmount = loanPropertyStore.getLoanAmount() || 0;
  if (loanPropertyStore.getPurchasePrice()) {
    amount =
      amount > loanPropertyStore.getPurchasePrice()
        ? loanPropertyStore.getPurchasePrice()
        : amount;
    percentage = +((amount / loanPropertyStore.getPurchasePrice()) * 100).toFixed(2);
    loanAmount = loanPropertyStore.getPurchasePrice() - value;
  }
  borrowersStore.setCurrentLoan({
    ...generalStore.currentLoan,
    DownPaymentPercentage: percentage,
    DownPaymentAmount: +value,
  });
  loanPropertyStore.setLoanAmount(loanAmount);
};
const setFixedIncrementPercentage = (value) => {
  let fixedIncrementValues = [0, 3, 3.5, 5];
  if (value <= fixedIncrementValues[fixedIncrementValues.length - 1]) {
    let currentMaxIndex = 0;
    for (var i = 1; i < fixedIncrementValues.length; i++) {
      if (value <= fixedIncrementValues[i]) {
        currentMaxIndex = i;
        break;
      }
    }
    if (
      value <
      (fixedIncrementValues[currentMaxIndex - 1] +
        fixedIncrementValues[currentMaxIndex]) /
        2
    ) {
      setPercentage(fixedIncrementValues[currentMaxIndex - 1]);
    } else {
      setPercentage(fixedIncrementValues[currentMaxIndex]);
    }
  } else {
    if (value % 5 < 2.5) {
      setPercentage(parseInt(value / 5) * 5);
    } else {
      setPercentage(parseInt(value / 5) * 5 + 5);
    }
  }
};

const setPercentage = (value) => {
  const correctValue = value > 100 ? 100 : +value;
  const amount = +((loanPropertyStore.getPurchasePrice() * correctValue) / 100).toFixed(
    2
  );
  const loanAmount = loanPropertyStore.getPurchasePrice() - amount;
  borrowersStore.setCurrentLoan({
    ...generalStore.currentLoan,
    DownPaymentPercentage: correctValue,
    DownPaymentAmount: amount,
  });
  loanPropertyStore.setLoanAmount(loanAmount);
};

const setManualLoanAmount = (value) => {
  const LoanAmount =
    value > loanPropertyStore.getPurchasePrice()
      ? loanPropertyStore.getPurchasePrice()
      : value;
  const amount = +(loanPropertyStore.getPurchasePrice() - LoanAmount).toFixed(2);
  const percentage = +((amount / loanPropertyStore.getPurchasePrice()) * 100).toFixed(2);
  borrowersStore.setCurrentLoan({
    ...generalStore.currentLoan,
    DownPaymentAmount: amount,
    DownPaymentPercentage: percentage,
    LoanAmount,
  });
};

const setInitialDownpayments = () => {
  let percentage = loanPropertyStore.getDownPaymentPercentage() || 20;
  if (
    loanPropertyStore.getPurchasePrice() &&
    loanPropertyStore.getBaseLoanAmount() &&
    !loanPropertyStore.getLoanAmount()
  ) {
    const amount = +(
      loanPropertyStore.getPurchasePrice() - loanPropertyStore.getBaseLoanAmount()
    ).toFixed(2);
    percentage = +((amount / loanPropertyStore.getPurchasePrice()) * 100).toFixed(2);
    const LoanAmount = loanPropertyStore.getBaseLoanAmount() - amount;
    borrowersStore.setCurrentLoan({
      ...generalStore.currentLoan,
      DownPaymentAmount: amount,
      DownPaymentPercentage: percentage,
      LoanAmount,
    });
  } else if (loanPropertyStore.getPurchasePrice() && loanPropertyStore.getLoanAmount()) {
    setManualLoanAmount(loanPropertyStore.getLoanAmount());
  } else if (
    loanPropertyStore.getPurchasePrice() &&
    !loanPropertyStore.getLoanAmount() &&
    !loanPropertyStore.getBaseLoanAmount()
  ) {
    setPercentage(percentage);
  }
};

const checkMaxPercentage = (e) => {
  const { value } = e.target;
  if (value.length === 3 || value > 100) {
    e.preventDefault();
    return false;
  } else {
    return isOnlyNum(e);
  }
};
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter the Down Payment Percent or Amount for this loan.
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <TextBox
          class="disabledInput"
          :placeholder="
            generalStore.currentLoan && generalStore.currentLoan.SalesContract
              ? 'Purchase Price'
              : 'Estimated Purchase Price'
          "
          pattern="[0-9]*"
          inputmode="numeric"
          prefix="$"
          :value="getFormattedValue(loanPropertyStore.getPurchasePrice()) || 0"
          :disabled="true"
        ></TextBox>
        <TextBox
          placeholder="Down Payment %"
          suffix="%"
          ref="percentage"
          type="number"
          min="0"
          max="100"
          :value="loanPropertyStore.getDownPaymentPercentage() || 0"
          @input="(e) => setPercentage(e.target.value)" @keypress="(e) => checkMaxPercentage(e)"
        >
        </TextBox>
        <TextBox
          placeholder="Down Payment Amount"
          pattern="[0-9]*"
          inputmode="numeric"
          prefix="$"
          :value="getFormattedValue(loanPropertyStore.getDownPaymentAmount()) || 0"
          @input="(e) => setAmount(+e.target.value.replace(/,/g, ''))"
        ></TextBox>
        <TextBox
          class="disabledInput"
          placeholder="Loan Amount"
          pattern="[0-9]*"
          inputmode="numeric"
          prefix="$"
          :disabled="true"
          :value="loanPropertyStore.getLoanAmount() ? getFormattedValue(loanPropertyStore.getLoanAmount()) : 0"
        ></TextBox>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(.v-text-field--prefixed.v-text-field .v-field__input) {
  padding: 10px 10px 10px 4px !important;
}
:deep(.v-text-field__prefix) {
  padding: 0 0 0 12px;
}
:deep(.v-field__field) {
  align-items: center !important;
}
:deep(.v-input__control) {
  height: 40px;
}

:deep(.v-field__field) {
  height: 40px;
}
</style>
