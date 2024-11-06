<script setup>
import { computed, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";

const borrowerStore = useBorrowersStore();
const headers = ref([
  {
    title: "Liability/Expense",
    key: "ExpenseType",
  },
  { title: "Number of Months", key: "ExpenseRemainingTermMonthsCount" },
  {
    title: "Duration",
    key: "ExpenseRemainingMonthsType",
  },
  {
    title: "Monthly Payment",
    key: "ExpenseMonthlyPaymentAmount",
  },
]);

const otherLiabilities = computed(() => {
  return borrowerStore.Borrower && borrowerStore.Borrower.OtherLiabilitiesAndExpenses
    ? borrowerStore.Borrower.OtherLiabilitiesAndExpenses
    : [];
});

const total = computed(() => {
  if (otherLiabilities.value.length) {
    return otherLiabilities.value.reduce(
      (acc, cur) => acc + cur.ExpenseMonthlyPaymentAmount,
      0
    );
  }
  return 0;
});
</script>
<template>
  <div class="d-contents">
    <v-data-table
      class="content-table"
      :headers="headers"
      :items="otherLiabilities"
      disable-sort
      hide-default-footer
      :mobile-breakpoint="0"
    >
      <template v-slot:[`item.ExpenseType`]="{ item }">
        <span>{{ item.ExpenseType.replace(/([a-z])([A-Z])/g, "$1 $2") }}</span>
      </template>

      <template v-slot:[`item.ExpenseMonthlyPaymentAmount`]="{ item }">
        <span>${{ getFormattedValue(item.ExpenseMonthlyPaymentAmount) || 0 }}</span>
      </template>

      <template v-slot:[`body.append`]="{}">
        <tr class="appended-row">
          <td></td>
          <td></td>
          <td>Totals:</td>
          <td>${{ getFormattedValue(total) || 0 }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-data-table-header__content span) {
  font-size: 12px !important;
  color: $table-header-text-color !important;
}
:deep(.v-table--density-default) {
  --v-table-header-height: 48px !important;
  --v-table-row-height: 48px !important;
}

:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(1)) {
  width: 225.97px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(2)) {
  width: 242.5px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(3)) {
  width: 328.77px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(4)) {
  width: 229.77px !important;
}
</style>
