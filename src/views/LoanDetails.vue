<script setup>
import { computed, ref } from "vue";
import GeneralInfo from "@/components/loanDetails/GeneralInfo.vue";
import PropertyAndLoanInfo from "@/components/loanDetails/PropertyAndLoanInfo.vue";
import MortgageDetails from "@/components/loanDetails/MortgageDetails.vue";
import ClosingAdjustments from "@/components/loanDetails/ClosingAdjustments.vue";
import Origination from "@/components/loanDetails/Origination.vue";
import DemographicsCollectionMethod from "@/components/loanDetails/DemographicsCollectionMethod.vue";
import GovernmentBorrower from "@/components/loanDetails/GovernmentBorrower.vue";
import Counseling from "@/components/loanDetails/Counseling.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useLoanDetailsStore } from "@/stores/loanDetailsStore.js";

const borrowersStore = useBorrowersStore();
const loanDetailsStore = useLoanDetailsStore();

const tabs = ref([
  "General Info",
  "Property & Loan",
  "Mortgage Details",
  "Closing Adjustments",
  "Origination",
  "Demographics Collection",
  "Government Borrower",
  "Counseling",
]);
const currentTab = ref("");

const governmentBorrower = computed(() => {
  return borrowersStore.Borrower.GovernmentBorrower || {};
});

const additionalInfo = computed(() => {
  return loanDetailsStore.getAdditionalLoanInformation();
});
</script>
<template>
  <div class="loan-details fill-height">
    <v-row>
      <v-col class="d-flex justify-start flex-wrap">
        <v-tabs v-model="currentTab" grow height="30px" color="primary" rounded>
          <v-tab
            v-for="(tab, index) in tabs"
            :key="index"
            class="text-capitalize px-2"
            active-class="current-tab"
            :value="index"
          >
            {{ tab }}
          </v-tab>
        </v-tabs>
        <v-tabs-window v-model="currentTab" style="width: 100%">
          <v-tabs-window-item> <GeneralInfo /> </v-tabs-window-item>
          <v-tabs-window-item> <PropertyAndLoanInfo /> </v-tabs-window-item>
          <v-tabs-window-item> <MortgageDetails /> </v-tabs-window-item>
          <v-tabs-window-item> <ClosingAdjustments /> </v-tabs-window-item>
          <v-tabs-window-item> <Origination /> </v-tabs-window-item>
          <v-tabs-window-item> <DemographicsCollectionMethod /> </v-tabs-window-item>
          <v-tabs-window-item>
            <GovernmentBorrower
              :governmentBorrower="governmentBorrower"
              :additionalInfo="additionalInfo"
            />
          </v-tabs-window-item>
          <v-tabs-window-item> <Counseling /> </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.loan-details {
  :deep(.v-slide-group__prev),
  :deep(.v-slide-group__next) {
    display: none !important;
  }
  .v-tab {
    border: 0.5px solid rgba(0, 0, 0, 0.3);
    border-bottom: none;
    border-right: none;
    border-top-right-radius: 15px !important;
    background-color: #eee;
    font-size: 12px !important;
    color: #00000099 !important;
    &:last-child {
      border-right: 0.5px solid rgba(0, 0, 0, 0.3);
    }
  }
  .v-tab-item--selected{
      color: $primary !important;
    }
  .current-tab {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      height: 2px;
      width: 100%;
      background: $primary;
    }
  }
 
  @media (max-width: $tablet-width) {
    margin-top: 12px !important;
  }
}

@media (max-width: $tablet-width) {
  :deep(.loan-details) {
    margin-top: 88px !important;
  }
}
</style>
