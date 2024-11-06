<script setup>
import Response from "@/components/images/credit/Response.vue";
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Take some time to review the liabilities that we have found on your credit report.
      </div>
      <div class="titleSecondaryText">
        If you see any errors or changes just let us know utilizing the system. Keep in
        mind that in many cases (especially with credit cards) the balances and payments
        may vary slightly from what they actually are, this is due to slight delays in
        reporting. Those changes, unless significant, do not typically need to be
        addressed. We have extracted the important details from your report for you to
        review on the following pages.
      </div>
      <Response />
    </div>
    <div class="navigation-container">
      <NavigationButtons nextButtonText="OK" :SaveOnNextClick="false"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container .titleImage {
  margin: 20px 0px;
  width: auto;
  height: auto;
  max-height: 375px;
}
@media (max-width: $mobile-width) {
  .image-container .titleImage {
    width: 100%;
  }
}
</style>
