<script setup>
import Start from "@/components/images/rates-offers/Start.vue";
</script>
<template>
  <div>
    <div class="content-container image-content-type mt-0">
      <div class="main-text">
        <p class="mb-3">
          To provide you with out best rates and offers, all steps in the application
          process must be completed first.
        </p>
        <p class="mb-3">
          It’s now time to
          <span class="strong-text">select your loan term and interest rate</span>, and
          see if you are eligible for any special offers or products.
        </p>
      </div>
      <div class="w-100">
        <div class="image-container">
          <Start class="start-svg" />
        </div>
      </div>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        ButtonType="secondary"
        nextButtonText="Ok"
        NextBtnWidth="100px"
        :hideProgressAndPrevious="true"
        :HasDefaultNavigation="false"
        :RequestedNextPath="'ratesandoffers/rate-type'"
        :isProgressDot="false"

      >
      </NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.start-svg {
  height: auto;
  max-height: 375px;
}
@media (max-width: $mobile-width) {
  .start-svg {
    width: 100%;
  }
}
.mb-3 {
  margin-bottom: 16px !important;
}
.main-text {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.image-content-type {
  min-height: fit-content !important;
  justify-content: flex-start;
  align-items: flex-start;
}

.image-container {
  margin: 50px 0px !important;
}

.strong-text {
  font-weight: bold;
}

.content-container {
  padding: 24px 16px 24px 16px;
}

.w-100 {
  width: 100%;
}

.h-100 {
  height: 100%;

  @media (min-width: $mobile-width) {
    height: revert-layer;
  }
}

.navigation-container {
  border: 0 !important;
  text-align: center;
}
:deep(.navButtonsContianer){
    text-align: center !important;
}

:deep(.secondary-button){
  width: 100px !important;
}
</style>
