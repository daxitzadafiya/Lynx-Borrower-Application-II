<script setup>
import { loanPatch } from "@/mixins/loanPatch";
import Current from '@/components/employment/summaries/Current.vue'
import Additional from '@/components/employment/summaries/Additional.vue'
import Previous from '@/components/employment/summaries/Previous.vue'
import OtherIncome from '@/components/employment/summaries/OtherIncome.vue'
const { saveAndAdvance } = loanPatch();
</script>

<template>
  <div class="employment-data">
    <Current />
    <Additional />
    <Previous />
    <OtherIncome />
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
