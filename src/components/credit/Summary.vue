<script setup>
import { loanPatch } from "@/mixins/loanPatch";
import BorrowerDetails from "./summaries/BorrowerDetails.vue";
import DecisionScore from "./summaries/DecisionScore.vue";
import Liabilities from "./summaries/Liabilities.vue";
import DerogatoryItems from "./summaries/DerogatoryItems.vue";
import OtherLiabilities from "./summaries/OtherLiabilities.vue";
import { computed } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const { saveAndAdvance } = loanPatch();
const borrowerStore = useBorrowersStore();
const derogatories = computed(() => {
  return borrowerStore.Borrower && borrowerStore.Borrower.PublicRecords ? borrowerStore.Borrower.PublicRecords : [];
});
</script>

<template>
  <div class="credit-data">
    <BorrowerDetails />
    <DecisionScore />
    <Liabilities />
    <DerogatoryItems v-if="derogatories != null && derogatories.length !== 0" />
    <OtherLiabilities />
  </div>
  <div class="d-flex w-100 justify-end mt-5 pt-3">
    <CustomButton
      value="Go to next section"
      customClass="primary-button"
      width="auto"
      @onHandleClick="() => saveAndAdvance(true)"
    >
    </CustomButton>
  </div>
</template>

<style lang="scss" scoped>

@media (max-width: $tablet-width) {
  :deep(.summaryCard .header) {
    padding: 30px 20px !important;
  }
  :deep(.summaryCard .summaryCardViewMode) {
    padding: 30px 20px !important;
    padding-bottom: 12px !important;
  }
 
}
@media (max-width: $mobile-width) {
  :deep(.summaryCard .summaryCardViewMode) {
    padding: 30px 10px !important;
    padding-bottom: 12px !important;
  }
  :deep(.summaryCard .header) {
    padding: 30px 10px !important;
  }
}
</style>
