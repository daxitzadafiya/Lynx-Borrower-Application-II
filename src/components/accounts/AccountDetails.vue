<script setup>
import AccountDetailsData from './accountDetails/AccountDetailsData.vue'
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please complete the details for the accounts you have selected
      </div>
    </div>
    <AccountDetailsData></AccountDetailsData>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
