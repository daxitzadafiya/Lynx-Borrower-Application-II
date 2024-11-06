<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { useEmployMentStore } from "@/stores/employmentStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { ref } from "vue";
import OtherIncomeDetails from "@/components/employment/otherIncomeDetails/OtherIncomeDetails.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";

const employmentStore = useEmployMentStore();
const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();

const headers = ref([
  {
    title: "Source",
    key: "IncomeType",
  },
  {
    title: "Monthly Income",
    key: "CurrentIncomeMonthlyTotalAmount",
  },
  {
    title: "Start Date",
    key: "StartDate",
  },
  {
    title: "Expected End Date",
    key: "EndDate",
  },
]);
const dataBeforeEdit = ref([]);

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(employmentStore.getOtherIncome()));
};

const onCancelClicked = () => {
  borrowersStore.updateBorrower({ prop: "OtherIncome", value: dataBeforeEdit.value });
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};
</script>
<template>
  <NewSummaryControl
    header="Income from Other Sources"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row class="summary-content-container">
        <v-col sm="12" cols="12" class="summaryItem position-relative">
          <v-data-table
            class="content-table"
            :headers="headers"
            :items="employmentStore.getOtherIncome()"
            disable-sort
            disable-pagination
            hide-default-footer
            :mobile-breakpoint="0"
          >
            <template v-slot:[`item.IncomeType`]="{ item }">
              <span>{{ item.IncomeType.replace(/([a-z])([A-Z])/g, "$1 $2") }}</span>
            </template>
            <template v-slot:[`item.CurrentIncomeMonthlyTotalAmount`]="{ item }">
              <span
                >${{ getFormattedValue(item.CurrentIncomeMonthlyTotalAmount) || 0 }}</span
              >
            </template>
            <template v-slot:[`item.StartDate`]="{ item }">
              <span>
                {{
                  item.StartDate
                    ? new Date(item.StartDate)
                        .toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                        .replace(",", "")
                    : ""
                }}
              </span>
            </template>
            <template v-slot:[`item.EndDate`]="{ item }">
              <span v-if="item.Ongoing">Ongoing</span>
              <span v-else-if="item.Unsure">Unsure</span>
              <span v-else>
                {{
                  item.EndDate
                    ? new Date(item.EndDate)
                        .toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                        .replace(",", "")
                    : ""
                }}
              </span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </template>
    <template v-slot:editContent>
      <OtherIncomeDetails />
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
:deep(.v-data-table-header__content span) {
  font-size: 12px !important;
}
:deep(.v-table--density-default) {
  --v-table-header-height: 48px !important;
  --v-table-row-height: 48px !important;
}
.remove-wrapper{
  text-align: end;
  padding: 0px !important;
} 
</style>
