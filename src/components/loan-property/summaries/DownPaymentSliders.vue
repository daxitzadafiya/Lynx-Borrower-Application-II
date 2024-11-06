<script setup>
import { onMounted, ref, watch } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { number } from "@/mixins/onlyNum";
import { getFormattedValue } from "@/mixins/currencyFormat.js";


const downPaymentAmountBeforeEdit = ref(12);
const downPaymentPercentageBeforeEdit = ref(12);
const generalStore = useGeneralStore();
const loanPropertyStore = useLoanPropertyStore();
const borrowersStore = useBorrowersStore();
const { isOnlyNum } = number();

watch(
  () => generalStore.currentLoan,
  (newValue, oldValue) => {
    if (newValue.Id && oldValue.Id && newValue.Id !== oldValue.Id) {
      setInitialDownPayments();
    }
  },
  { deep: true }
);

onMounted(() => {
  setInitialDownPayments();
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

const clickedAmount = (e) => {
  const value = e.target.childNodes[0] ? e.target.childNodes[0].value : 0;
  if (value) {
    setAmount(value);
  }
};

const clickedPercentage = (e) => {
  const value = e.target.childNodes[0] ? e.target.childNodes[0].value : 0;
  if (value) {
    setPercentage(value);
  }
};

const setInitialDownPayments = () => {
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
  if (value > 100) {
    e.preventDefault();
    return false;
  } else {
    return isOnlyNum(e, true);
  }
};

const checkMaxLoanAmount = (e) => {
  const { value } = e.target;
  if (value.replace(/,/g, "") >= loanPropertyStore.getPurchasePrice()) {
    e.preventDefault();
    return false;
  } else {
    return isOnlyNum(e, true);
  }
};

const generateOnCancelData = () => {
  downPaymentAmountBeforeEdit.value = loanPropertyStore.getDownPaymentAmount();
  downPaymentPercentageBeforeEdit.value = loanPropertyStore.getDownPaymentPercentage();
};

const onCancelClicked = () => {
  setAmount(downPaymentAmountBeforeEdit.value);
  setPercentage(downPaymentPercentageBeforeEdit.value);
};

defineExpose({
  generateOnCancelData,
  onCancelClicked,
});
</script>

<template>
  <div class="d-flex slider-main">
    <Slider
      inputTitle="Down Payment Amount $"
      :inputValue="'$' + (getFormattedValue(loanPropertyStore.getDownPaymentAmount()) || 0)"
      :value="loanPropertyStore.getDownPaymentAmount() || 0"
      @onSlideEnd="(e) => setAmount(+e.replace(/[$,]/g, ''))"
      @keypress="(e) => isOnlyNum(e, true)"
      :maxValue="loanPropertyStore.getPurchasePrice()"
      @onClick="clickedAmount"
    />
    <Slider inputTitle="Down Payment %" :inputValue="loanPropertyStore.getDownPaymentPercentage() + '%'" :value="loanPropertyStore.getDownPaymentPercentage()
    " :maxValue="100" @onSlideEnd="setPercentage" @onClick="clickedPercentage"/>
  </div>
</template>

<style lang="scss" scoped>
@media (max-width: $lg-mobile-width) {
  .slider-main {
    flex-wrap: wrap;
  }
}
</style>
