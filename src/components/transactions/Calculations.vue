<script setup>
import { ref, defineProps } from "vue";
import TransactionsTable from "@/components/transactions/TransactionsTable.vue";

const headers = ref(["Calculation", "Amount"]);
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
});
</script>
<template>
  <div class="calculations">
    <TransactionsTable :headers="headers" :tableData="tableData" />
  </div>
</template>
