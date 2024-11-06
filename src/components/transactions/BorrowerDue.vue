<script setup>
import { ref, defineProps } from "vue";
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";

const headers = ref(["Due From Borrowers", "Amount"]);
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
});

</script>
<template>
  <div class="borrower-due">
    <TransactionsTable :headers="headers" :tableData="tableData" />
  </div>
</template>
