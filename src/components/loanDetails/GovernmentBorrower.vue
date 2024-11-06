<script setup>
import { defineProps } from "vue";
import { useGeneralStore } from "@/stores/generalStore.js";
import { useBorrowersStore } from "@/stores/borrowersStore.js";
import { useLoanDetailsStore } from "@/stores/loanDetailsStore.js";

const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const loanDetailsStore = useLoanDetailsStore();

const props = defineProps({
  governmentBorrower: {
    type: Object,
    default: () => {
      return {};
    },
  },
  additionalInfo: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const updateGovernmentBorrower = ({ prop, value }) => {
  const govBorrower = { ...props.governmentBorrower, [prop]: value };
  borrowersStore.updateBorrower({ prop: "GovernmentBorrower", value: govBorrower });
};
</script>
<template>
  <v-card light>
    <v-card-title class="p-4">Government Borrower Details</v-card-title>
    <v-card-text>
      <v-row class="ma-0 pa-0 d-flex flex-wrap">
        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="font-weight-medium align-self-center ls">VA Federal Tax Amount</span>
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="governmentBorrower.VAFederalTaxAmount"
            @input="
              (e) =>
                updateGovernmentBorrower({
                  prop: 'VAFederalTaxAmount',
                  value: e.target.value,
                })
            "
            placeholder="VA Federal Tax Amount"
            hide-details
            type="number"
            style="max-width: 300px"
            prefix="$"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="font-weight-medium align-self-center ls">VA State Tax Amount</span>
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="governmentBorrower.VAStateTaxAmount"
            @input="
              (e) =>
                updateGovernmentBorrower({
                  prop: 'VAStateTaxAmount',
                  value: e.target.value,
                })
            "
            placeholder="VA State Tax Amount"
            hide-details
            type="number"
            style="max-width: 300px"
            prefix="$"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="font-weight-medium align-self-center ls">VA Local Tax Amount</span>
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="governmentBorrower.VALocalTaxAmount"
            @input="
              (e) =>
                updateGovernmentBorrower({
                  prop: 'VALocalTaxAmount',
                  value: e.target.value,
                })
            "
            placeholder="VA Local Tax Amount"
            hide-details
            type="number"
            style="max-width: 300px"
            prefix="$"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="font-weight-medium align-self-center ls"
            >VA Social Security Tax Amount</span
          >
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="governmentBorrower.VASocialSecurityTaxAmount"
            @input="
              (e) =>
                updateGovernmentBorrower({
                  prop: 'VASocialSecurityTaxAmount',
                  value: e.target.value,
                })
            "
            placeholder="VA Social Security Tax Amount"
            hide-details
            type="number"
            style="max-width: 300px"
            prefix="$"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls"
            >VA Co-Borrower Non Taxable Income Amount</span
          >
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="governmentBorrower.VACoBorrowerNonTaxableIncomeAmount"
            @input="
              (e) =>
                updateGovernmentBorrower({
                  prop: 'VACoBorrowerNonTaxableIncomeAmount',
                  value: e.target.value,
                })
            "
            placeholder="VA Co-Borrower Non Taxable Income Amount"
            hide-details
            type="number"
            style="max-width: 300px"
            prefix="$"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls"
            >VA Co-Borrower Taxable Income Amount</span
          >
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="governmentBorrower.VACoBorrowerTaxableIncomeAmount"
            @input="
              (e) =>
                updateGovernmentBorrower({
                  prop: 'VACoBorrowerTaxableIncomeAmount',
                  value: e.target.value,
                })
            "
            placeholder="VA Co-Borrower Taxable Income Amount"
            hide-details
            type="number"
            style="max-width: 300px"
            prefix="$"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls"
            >VA Maintenance Expense Monthly Amount</span
          >
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.VAMaintenanceExpenseMonthlyAmount"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'VAMaintenanceExpenseMonthlyAmount',
                  value: e.target.value,
                })
            "
            placeholder="VA Maintenance Expense Monthly Amount"
            hide-details
            type="number"
            style="max-width: 300px"
            prefix="$"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls"
            >VA Utility Expense Monthly Amount</span
          >
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.VAUtilityExpenseMonthlyAmount"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'VAUtilityExpenseMonthlyAmount',
                  value: e.target.value,
                })
            "
            placeholder="VA Utility Expense Monthly Amount"
            hide-details
            type="number"
            style="max-width: 300px"
            prefix="$"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls"
            >VA Entitlement Amount</span
          >
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.VAEntitlementAmount"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'VAEntitlementAmount',
                  value: e.target.value,
                })
            "
            placeholder="VA Entitlement Amount"
            hide-details
            type="number"
            style="max-width: 300px"
            prefix="$"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="3" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls"
            >VA Borrower Co Borrower Married Indicator</span
          >
        </v-col>
        <v-col class="pa-1" lg="7" cols="6">
          <v-checkbox
            label=""
            :model-value="additionalInfo.VABorrowerCoBorrowerMarriedIndicator"
            @update:model-value="
              (value) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'VABorrowerCoBorrowerMarriedIndicator',
                  value,
                })
            "
            class="ma-0 pa-0"
            dense
            hide-details
          />
        </v-col>
      </v-row>
      <CustomButton
        value="Save"
        class="button"
        customClass="primary-button"
        @onHandleClick="generalStore.saveLoanPatches"
      />
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
:deep(.v-input .v-text-field__prefix) {
  opacity: 1 !important;
  visibility: visible !important;
}

:deep(.input-field) {
  input {
    padding-top: 3px !important;
    padding-bottom: 4px !important;
    padding-left: 4px !important;
    min-height: 23px;
    font-size: 13px !important;
  }
  .v-text-field__prefix {
    padding-top: 3px !important;
    padding-bottom: 0px !important;
    min-height: 23px;
    font-size: 13px !important;
  }
}
.p-4 {
  padding: 16px;
}
.font-weight-medium {
  color: #00000099 !important;
  list-style: 22px !important;
}
.ls{
  letter-spacing: 0.1px !important;
}
.button{
  margin: 15px;
}
</style>
