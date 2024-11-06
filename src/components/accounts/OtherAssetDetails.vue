<script setup>
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { computed, ref } from "vue";
import OtherAssetDetailsData from "./otherAssetsDetails/OtherAssetDetailsData.vue";

const loanPropertyStore = useLoanPropertyStore();
const loanPurposeType = ref(loanPropertyStore.getLoanPurposeType());

const nextRoute = computed(() => {
  return loanPurposeType.value === "Purchase"
    ? "/accountsandassets/required-deposit"
    : "/accountsandassets/loan-gifts";
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter the Cash or Market Value for these Assets
      </div>
    </div>
    <OtherAssetDetailsData />
    <div class="navigation-container">
      <NavigationButtons :RequestedNextPath="nextRoute" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
