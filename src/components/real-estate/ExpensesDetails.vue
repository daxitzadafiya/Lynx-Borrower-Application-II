<script setup>
import ExpensesDetailsData from "@/components/real-estate/expense-details/ExpensesDetailsData.vue";

</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter the monthly amount of each housing expense
      </div>
    </div>
    <ExpensesDetailsData></ExpensesDetailsData>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>


