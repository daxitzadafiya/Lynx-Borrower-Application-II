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

const isCurrency = (item) => {
  return ["Assets", "Liabilities"].indexOf(item) !== -1;
};

const isPercentage = (item) => {
  return ["DTI", "Housing"].indexOf(item) !== -1;
};
</script>
<template>
  <v-table class="t-table">
    <template v-slot:default>
      <tbody class="t-table__tbody">
        <tr
          v-for="(item, index) in headers"
          :key="index"
          :class="index === 0 ? 'table-header-text table-header-back' : ''"
          class="t-table__tbody-row"
        >
          <td class="t-table__tbody-cell primary-text">{{ item }}</td>

          <template v-for="(info, dataIndex) in tableData" :key="dataIndex">
            <td class="t-table__tbody-cell" v-if="item === 'Borrower'">
              <span>{{ info.name }}</span>
            </td>

            <td
              class="t-table__tbody-cell"
              v-else-if="item !== 'Income/Month' && item !== 'Include' && item !== 'Edit'"
            >
              <span v-if="isCurrency(item)">$</span>
              <span>
                {{
                  info[item.toLowerCase()]
                    ? info[item.toLowerCase()].toLocaleString("en-US")
                    : info[item.toLowerCase()]
                }}
              </span>
              <span v-if="isPercentage(item)">%</span>
            </td>

            <td class="t-table__tbody-cell" v-else-if="item === 'Include'">
              <v-switch
              color="#000"
              hide-details
                :model-value="info.isInclude"
                v-if="info.name !== 'Totals:'"
                @change="emit('toggleInclude', { index: dataIndex })"
              />
            </td>

            <td class="t-table__tbody-cell" v-else-if="item === 'Edit'">
              <v-btn
                icon
                v-if="info.name !== 'Totals:'"
                @click="emit('setBorrowerAndRedirect', { index: dataIndex })"
                elevation="0"
              >
                <v-icon class="icon-color-main">mdi-pencil</v-icon>
              </v-btn>
            </td>

            <td class="t-table__tbody-cell" v-else>
              <span>$</span>
              <span>{{
                info.income >= 0 ? info.income.toLocaleString("en-US") : ""
              }}</span>
            </td>
          </template>
        </tr>
      </tbody>
    </template>
  </v-table>
</template>
<style lang="scss" scoped>
:deep(.icon-color-main) {
  path {
    &[fill] {
      fill: $primary !important;
    }
    &[stroke] {
      stroke: $primary !important;
    }
  }
}
:deep(.table-header-text) {
  td {
    color: $table-header-text-color !important;
  }
}

.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(2){
  font-weight: 400;
} 
.v-table > .v-table__wrapper > table > tbody > tr > td:last-child{
  font-weight: 500;
  font-size: 16px;
} 

.v-table > .v-table__wrapper > table > tbody > tr:not(:first-child) > td:first-child{
  color: $black !important;
} 

.v-table > .v-table__wrapper > table > tbody > tr > td {
  height: 48px !important;
  font-size: 14px;
  font-weight: 500;
}
.v-table > .v-table__wrapper > table > tbody > tr:last-child > td {
  height: 48px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
}

.icon-color-main {
  color: $primary !important;
}

.v-btn--icon.v-btn--density-default {
  width: 36px !important;
  height: 36px !important;
}

:deep(.v-switch .v-selection-control){
  min-height: 48px !important;
}
</style>
