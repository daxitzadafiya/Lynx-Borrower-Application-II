<script setup>
import Table from "@/components/credit/liabilities/Table.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed } from "vue";

const borrowersStore = useBorrowersStore();

const nextRoute = computed(() => {
  if (borrowersStore.Borrower.PublicRecords == null || borrowersStore.Borrower.PublicRecords.length === 0) {
    return "/credit/other-liabilities";
  } else {
    return "/credit/derogatory-items";
  }
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please take a moment to review the liabilities we've obtained from your credit
        report
      </div>
    </div>
    <div class="inner-content-container">
      <Table></Table>
    </div>
    <div class="navigation-container">
      <NavigationButtons :RequestedNextPath="nextRoute"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss"></style>
