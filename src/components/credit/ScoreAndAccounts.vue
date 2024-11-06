<script setup>
import { watch } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import DecisionScore from "./scoreAndAccounts/DecisionScore.vue";
import { useCreditStore } from "@/stores/creditStore";

const borrowerStore = useBorrowersStore();
const creditStore = useCreditStore();

watch(
  () => borrowerStore.Borrower,
  (newVal, oldVal) => {
    if (newVal && newVal.Id !== oldVal.Id) {
      creditStore.getCreditOrders();
    }
  },
  { deep: true }
);
</script>
<template>
  <div class="content-container">
    <DecisionScore></DecisionScore>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<style lang="sass" scoped></style>
