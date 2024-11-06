<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { computed } from "vue";
import { useBorrowersStore } from "../../../stores/borrowersStore";
import Table from "./OtherLiabilitiesTable.vue";
import OtherLiabilityDetailsData from "@/components/credit/otherLiabilityDetails/OtherLiabilityDetailsData.vue";
const borrowerStore = useBorrowersStore();

const otherLiabilities = computed(() => {
  return borrowerStore.Borrower && borrowerStore.Borrower.OtherLiabilitiesAndExpenses
    ? borrowerStore.Borrower.OtherLiabilitiesAndExpenses
    : [];
});
</script>
<template>
  <div class="other-liabilities">
    <NewSummaryControl header="Other Liabilities">
      <template v-slot:displayContent>
        <v-row
          class="summary-content-container"
          v-if="otherLiabilities == null || otherLiabilities.length === 0"
        >
          <v-col class="summaryItem" sm="12" cols="12">
            <div class="summaryValue">No Other Liabilities.</div>
          </v-col>
        </v-row>
        <Table v-else></Table>
      </template>
      <template v-slot:editContent>
        <OtherLiabilityDetailsData></OtherLiabilityDetailsData>
      </template>
    </NewSummaryControl>
  </div>
</template>
<style lang="scss" scoped>
@media (max-width: $mobile-width) {
  :deep(.form-container.addItemBtnContainer) {
    padding-top: 0px !important;
  }
  :deep(.addItemBtnContainer .itemContainer){
    padding: 0 !important;
  }
}
</style>
