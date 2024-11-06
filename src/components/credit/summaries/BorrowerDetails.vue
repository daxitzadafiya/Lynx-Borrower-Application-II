<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import moment from "moment";
import { computed } from "vue";

const borrowersStore = useBorrowersStore();

const borrower = computed(() => {
  if (!borrowersStore.Borrower.CoBorrower) return borrowersStore.Borrower;
  return borrowersStore.Borrowers.find(
    (item) => item.LinkedBorrowerId === borrowersStore.Borrower.Id && !item.CoBorrower
  );
});

const coBorrower = computed(() => {
  return borrowersStore.Borrowers.length && !borrowersStore.Borrower.CoBorrower
    ? borrowersStore.Borrowers.find(
        (item) => item.CoBorrower && item.LinkedBorrowerId === borrowersStore.Borrower.Id
      )
    : null;
});

const borrowerBirthDate = computed(() => {
  return borrower.value && borrower.value.BorrowerBirthDate
    ? moment(borrower.value.BorrowerBirthDate).format("MMMM DD, YYYY")
    : null;
});

const coBorrowerBirthDate = computed(() => {
  return coBorrower.value && coBorrower.value.BorrowerBirthDate
    ? moment(coBorrower.value.BorrowerBirthDate).format("MMMM DD, YYYY")
    : null;
});

const maskSSN = (ssn) => {
  if (!ssn) return "";
  return ssn.slice(0, -4) + "****";
};
</script>
<template>
  <div class="borrower">
    <NewSummaryControl header="Borrower(s) Details" :isReadOnly="true">
      <template v-slot:displayContent>
        <v-row class="summary-content-container">
          <v-col cols="12" class="summaryItem">
            <div class="summaryValue bold lh-21">
              {{ borrower.FirstName }} {{ borrower.LastName }}
            </div>
          </v-col>
          <v-col sm="6" md="4" cols="12" class="summaryItem">
            <div class="summaryTitle lh-21">Date of Birth:</div>
            <div class="summaryValue lh-21">{{ borrowerBirthDate }}</div>
          </v-col>
          <v-col sm="6" md="4" cols="12" class="summaryItem">
            <div class="summaryTitle lh-21">Social Security Number:</div>
            <div class="summaryValue lh-21">
              {{ maskSSN(borrower.TaxpayerIdentifierValue) }}
            </div>
          </v-col>
          <template v-if="coBorrower != null">
            <v-col class="summaryItem" sm="12" cols="12">
              <div class="summaryValue bold">
                {{ coBorrower.FirstName }} {{ coBorrower.LastName }}
              </div>
            </v-col>
            <v-col class="summaryItem" sm="4" cols="12">
              <div class="summaryTitle">Date of Birth:</div>
              <div class="summaryValue">{{ coBorrowerBirthDate }}</div>
            </v-col>
            <v-col class="summaryItem" sm="4" cols="12">
              <div class="summaryTitle">Social Security Number:</div>
              <div class="summaryValue">
                {{ maskSSN(coBorrower.TaxpayerIdentifierValue) }}
              </div>
            </v-col>
          </template>
        </v-row>
      </template>
    </NewSummaryControl>
  </div>
</template>
<style lang="scss" scoped>
.bold {
  font-weight: 600;
}
:deep(.headerText) {
  line-height: 22.5px !important;
}
.lh-21 {
  line-height: 21px !important;
}
:deep(.v-row) {
  margin: 0 !important;
}
:deep(.summaryCard .summaryCardViewMode) {
  padding-top: 40px !important;
}
:deep(.summary-content-container) {
  padding-left: 5px !important;
}
:deep(.summary-content-container .summaryItem) {
  padding: 0px 20px !important;
}

@media (max-width: $tablet-width) {
  :deep(.summary-content-container) {
    padding-left: 0 !important;
  }
  :deep(.summary-content-container .summaryItem) {
    padding: 0px 20px !important;
  }
}

@media (max-width: $mobile-width) {
  :deep(.summary-content-container .summaryItem) {
    padding: 0px 0px !important;
  }
}
</style>
