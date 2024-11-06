<script setup>
import Assets from "@/components/accounts/summaries/Assets.vue";
import SellerCredits from "@/components/accounts/summaries/SellerCredits.vue";
import Deposits from "@/components/accounts/summaries/Deposits.vue";
import Gifts from "@/components/accounts/summaries/Gifts.vue";
import Grants from "@/components/accounts/summaries/Grants.vue";
import PurchaseCredits from "@/components/accounts/summaries/PurchaseCredits.vue";
import PropertyOwn from "@/components/real-estate/summaries/PropertyOwn.vue";
</script>
<template>
  <div class="accounts-data">
    <Assets></Assets>
    <SellerCredits></SellerCredits>
    <Deposits></Deposits>
    <Gifts></Gifts>
    <Grants></Grants>
    <PurchaseCredits></PurchaseCredits>
    <PropertyOwn></PropertyOwn>
    <div class="d-flex w-100 justify-center mt-5 pt-3">
      <NavigationButtons nextButtonText="Go To Next Section" :hideProgressAndPrevious="true" :isProgressDot="false"
        ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@media (max-width: $tablet-width) {
  :deep(.variableButtonWidth){
    width: auto !important;
}

  :deep(.summaryCard .header) {
    padding: 30px 20px !important;
  }

  :deep(.summaryCard .summaryCardViewMode) {
    padding: 30px 20px !important;
    padding-bottom: 12px !important;
  }

}

@media (max-width: $mobile-width) {

  :deep(.variableButtonWidth){
    width: auto !important;
}

  :deep(.summaryCard .summaryCardViewMode) {
    padding: 15px !important;
    padding-bottom: 12px !important;
  }

  :deep(.summaryCard .header) {
    padding: 30px 10px !important;
  }

  :deep(.p-0) {
    padding-top: 0 !important;
  }
}
</style>