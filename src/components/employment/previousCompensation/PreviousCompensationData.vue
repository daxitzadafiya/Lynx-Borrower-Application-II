<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { computed } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const { isOnlyNum } = number();
const borrowersStore = useBorrowersStore();

const setIncomeAmount = (val) => {
  if (currentEmployment.value.EmploymentClassificationType) {
    const employments = borrowersStore.getBorrowerEmployment().map((item) => {
      return item.EmploymentStatusType === "Previous"
        ? { ...item, EmploymentMonthlyIncomeAmount: val }
        : item;
    });
    return borrowersStore.updateBorrower({ prop: "Employment", value: employments });
  }
  borrowersStore.updateBorrower({
    prop: "Employment",
    value: [
      ...borrowersStore.getBorrowerEmployment(),
      {
        EmploymentStatusType: "Previous",
        EmploymentMonthlyIncomeAmount: val,
      },
    ],
  });
};

const currentEmployment = computed(() => {
    if (borrowersStore.getBorrowerEmployment().length) {
        const employment = borrowersStore
        .getBorrowerEmployment()
        .find((item) => item.EmploymentStatusType === "Previous");
        return employment || {};
    }
    return {};
});
</script>
<template>
  <TextBox
    placeholder="Monthly Income"
    prefix="$"
    :value="getFormattedValue(currentEmployment.EmploymentMonthlyIncomeAmount) || ''"
    @input="(e) => setIncomeAmount(+e.target.value.replace(/,/g, ''))"
    @keypress="(e) => isOnlyNum(e, true)"
  ></TextBox>
</template>
