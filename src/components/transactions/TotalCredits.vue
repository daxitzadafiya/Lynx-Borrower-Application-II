<script setup>
import { ref, defineProps } from "vue";
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";

const headers = ref(["Total Credits", "Amount"]);
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
});
</script>
<template>
  <div class=".mortgage-loans-total">
    <TransactionsTable :headers="headers" :tableData="tableData" />
  </div>
</template>
