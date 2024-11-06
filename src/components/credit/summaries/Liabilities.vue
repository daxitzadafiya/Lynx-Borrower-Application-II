<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import Table from "@/components/credit/liabilities/Table.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed } from "vue";

const borrowersStore = useBorrowersStore();
const liabilities = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Liabilities
    ? borrowersStore.Borrower.Liabilities
    : [{}];
});
</script>
<template>
  <div class="liabilities">
    <NewSummaryControl header="Liabilities">
      <template v-slot:displayContent>
        <div class="display-table">
          <v-row
            class="summary-content-container"
            v-if="liabilities == null || liabilities.length === 0"
          >
            <v-col class="summaryItem" sm="12" cols="12">
              <div class="summaryValue">No Liabilities.</div>
            </v-col>
          </v-row>
        <Table :editable="false"></Table>
        </div>
      </template>
      <template v-slot:editContent>
        <div class="edit-content inner-content-container">
          <Table></Table>
        </div>
      </template>
    </NewSummaryControl>
  </div>
</template>
<style lang="scss" scoped>
:deep(.display-table .v-table > .v-table__wrapper > table > thead > tr th:nth-child(1)) {
  width: 178.17px !important;
}
:deep(.display-table .v-table > .v-table__wrapper > table > thead > tr th:nth-child(2)) {
  width: 221.73px !important;
}
:deep(.display-table .v-table > .v-table__wrapper > table > thead > tr th:nth-child(3)) {
  width: 217.92px !important;
}
:deep(.display-table .v-table > .v-table__wrapper > table > thead > tr th:nth-child(4)) {
  width: 213.34px !important;
}
:deep(.display-table .v-table > .v-table__wrapper > table > thead > tr th:nth-child(5)) {
  width: 195.83px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(1)) {
  width: 242.11px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(2)) {
  width: 182.05px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(3)) {
  width: 178.92px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(4)) {
  width: 175.16px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(5)) {
  width: 160.77px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(6)) {
  width: 85px !important;
}
:deep(.display-table
    .v-table
    > .v-table__wrapper
    > table
    > tbody
    > tr:not(:last-child)
    td:last-child) {
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
:deep(.summaryCard .summaryCardViewMode) {
  padding-bottom: 11px !important;
}
:deep(.text-subtitle-1) {
  color: $content-black !important;
}
:deep(.v-btn__content) {
  margin-top: -1px !important;
}
:deep(.infoText) {
  margin-top: 19px !important;
}
:deep(.inner-content-container) {
  padding-bottom: 28px !important;
}
</style>
