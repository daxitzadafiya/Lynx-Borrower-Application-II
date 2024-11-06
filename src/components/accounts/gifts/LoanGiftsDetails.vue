<script setup>
import LoanGiftsData from "./LoanGiftsData.vue"
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter the details for each of the Gift Items you've indicated that you have
        received or will be receiving for this Loan
      </div>
    </div>
    <LoanGiftsData></LoanGiftsData>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
