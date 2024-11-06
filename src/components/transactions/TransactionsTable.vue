<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
});

const totalAmount = computed(() => {
  return props.tableData[props.tableData.length - 1];
});
</script>
<template>
  <v-expansion-panel>
    <v-expansion-panel-title class="table-header-back" v-slot:default="{ expanded }">
      <v-row class="primary--text t-header">
        <v-col class="table-header-text" cols="7" sm="8">
          {{ headers[0] }}
        </v-col>
        <v-col class="table-header-text ta-center" cols="5" sm="4">
          {{
            !expanded
              ? totalAmount.isNegative
                ? `-$${totalAmount.amount.toLocaleString("en-US")}`
                : `$${totalAmount.amount.toLocaleString("en-US")}`
              : headers[1]
          }}
        </v-col>
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-table class="t-table">
        <template v-slot:default>
          <tbody class="t-table__tbody text-black--text">
            <tr
              class="t-table__tbody-row"
              v-for="{ title, amount, isNegative } in tableData"
              :key="title"
            >
              <td class="t-table__tbody-cell t-table_width-70">{{ title }}</td>
              <td class="t-table__tbody-cell t-table_mobile-pr-18">
                {{
                  isNegative
                    ? `-$${amount.toLocaleString("en-US")}`
                    : `$${amount.toLocaleString("en-US")}`
                }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
<style lang="scss" scoped>

.t-table__tbody-row {
  &:last-child{
    font-weight: 600;
    font-size: 16px;
  }
}
.t-header {
  font-weight: 500;
  align-items: center;
}
:deep(.v-icon) {
  color: $table-header-text-color !important;
}
.t-table__tbody-row:hover {
  background-color: #eeeeee;
  transition: background-color 0.3s ease;
}
:deep(.v-expansion-panel-text__wrapper ){
  padding-top: 0px !important ;
}
:deep(.v-expansion-panel-title ){
  padding: 10px;
}
</style>
