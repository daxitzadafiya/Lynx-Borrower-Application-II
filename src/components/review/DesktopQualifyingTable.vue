<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["toggleInclude", "setBorrowerAndRedirect"]);
const headers = ref([
  "Borrower",
  "Status",
  "Fico",
  "Assets",
  "Income/Month",
  "Liabilities",
  "DTI",
  "Housing",
  "Include",
  "Edit",
]);
</script>
<template>
  <v-table class="t-table">
    <template v-slot:default>
      <thead class="t-table__thead">
        <tr class="t-table__thead-row">
          <th
            v-for="header in headers"
            :key="header"
            class="t-table__thead-cell table-header-text table-header-back"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="t-table__tbody">
        <tr v-for="(item, index) in tableData" :key="index" class="t-table__tbody-row">
          <td class="t-table__tbody-cell">{{ item.name }}</td>
          <td class="t-table__tbody-cell">{{ item.status }}</td>
          <td class="t-table__tbody-cell">{{ item.fico }}</td>

          <td class="t-table__tbody-cell">
            <span v-if="item.assets >= 0">$</span>
            <span>{{ item.assets ? item.assets.toLocaleString("en-US") : 0 }}</span>
          </td>

          <td class="t-table__tbody-cell">
            <span v-if="item.income >= 0">$</span>
            <span>{{ item.income ? item.income.toLocaleString("en-US") : 0 }}</span>
          </td>

          <td class="t-table__tbody-cell">
            <span v-if="item.liabilities >= 0">$</span>
            <span>{{
              item.liabilities ? item.liabilities.toLocaleString("en-US") : 0
            }}</span>
          </td>

          <td class="t-table__tbody-cell">{{ item.dti || 0 }}%</td>
          <td class="t-table__tbody-cell">{{ item.housing || 0 }}%</td>

          <td class="t-table__tbody-cell">
            <v-switch
              color="#000"
              v-if="item.name !== 'Totals:'"
              :model-value="item.isInclude"
              @change="emit('toggleInclude', { index })"
              hide-details
            />
          </td>

          <td class="t-table__tbody-cell t-table_mobile-pr-18">
            <v-btn
              icon
              v-if="item.name !== 'Totals:'"
              @click="emit('setBorrowerAndRedirect', { index })"
              elevation="0"
            >
              <v-icon class="icon-color-main">mdi-pencil</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-table>
</template>
<style lang="scss" scoped>
.icon-color-main, .table-header-text {
  color: $primary !important;
}
.v-table > .v-table__wrapper > table > thead > tr > th {
  height: 49px !important;
  border-bottom: 1px solid #00000003 !important;
  color:$primary !important;
}
.table-header-text{
  td{
    color: $table-header-text-color !important;
  }
}
.v-table > .v-table__wrapper > table > tbody > tr > td {
  height: 67px !important;
}
.v-table > .v-table__wrapper > table > tbody > tr:last-child > td {
  height: 48px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
}

.v-btn--icon.v-btn--density-default {
  width: 36px !important;
  height: 36px !important;
}

</style>
