<script setup>
import { loanPatch } from "@/mixins/loanPatch";
import AboutProperty from '@/components/declarations/summaries/AboutProperty.vue';
import AboutFinances from '@/components/declarations/summaries/AboutFinances.vue';
import DemographicsInfo from '@/components/declarations/summaries/DemographicsInfo.vue';

const { saveAndAdvance } = loanPatch();


</script>
<template>
  <div class="declarations-data">
    <AboutProperty></AboutProperty>
    <AboutFinances></AboutFinances>
    <DemographicsInfo></DemographicsInfo>
    <div class="d-flex w-100 justify-end mt-5 pt-3">
      <CustomButton
        value="Go to next section"
        width="auto"
        customClass="primary-button"
        @onHandleClick="() => saveAndAdvance(true)"
      ></CustomButton>
    </div>
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
    padding: 10px !important;
    padding-bottom: 12px !important;
    padding-top: 30px !important;
  }

  :deep(.summaryCard .header) {
    padding: 30px 10px !important;
  }

  :deep(.p-0) {
    padding-top: 0 !important;
  }
}
</style>