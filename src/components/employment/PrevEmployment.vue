<script setup>
import PreviousEmployMent from "@/components/images/employment/PreviousEmployMent.vue";
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text primary-text">
        Since your current employment is less than 2 years, you must provide the details
        of your previous employment.
      </div>
      <PreviousEmployMent />
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    width: auto;
    height: auto;
    max-height: 375px;
    margin: 20px 0;
    @media (max-width: $mobile-width) {
      width: 100%;
    }
  }
}
</style>
