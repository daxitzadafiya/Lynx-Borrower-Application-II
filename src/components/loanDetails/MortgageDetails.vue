<script setup>
import { computed, ref } from "vue";
import { useLoanDetailsStore } from "@/stores/loanDetailsStore.js";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { useGeneralStore } from "@/stores/generalStore";
import { useTransactionDetailsStore } from "@/stores/transactionDetailsStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";

const loanDetailsStore = useLoanDetailsStore();
const lenderInfoStore = useLenderInfoStore();
const generalStore = useGeneralStore();
const transactionStore = useTransactionDetailsStore();
const { isOnlyNum } = number();
const regex = ref(/^([1-9][\d]{0,2}|0)(\.\d{1,4})?$/);

const mortgageLoanInformation = computed(() => {
  return transactionStore.getMortgageLoanInformation();
});

const additionalInfo = computed(() => {
  return loanDetailsStore.getAdditionalLoanInformation();
});

const rules = {
  decimals: (value) => {
    if (!value) return "";
    return regex.value.test(value) || "Invalid value.";
  },
};

const negativeAmortizationTypes = ref([
  {
    text: "Potential Negative Amortization",
    value: "PotentialNegativeAmortization",
  },
  {
    text: "Scheduled Negative Amortization",
    value: "ScheduledNegativeAmortization",
  },
]);

const indexSourceTypes = ref([
  {
    text: "Other",
    value: "Other",
  },
]);

const indexSourceTypeOthers = ref([
  {
    text: "11th District COF",
    value: "11thDistrictCOF",
  },
  {
    text: "Daily CD Rate",
    value: "DailyCDRate",
  },
  {
    text: "Fannie Mae 60 Day Required Net Yield",
    value: "FannieMae60DayRequiredNetYield",
  },
  {
    text: "Fannie Mae LIBOR",
    value: "FannieMaeLIBOR",
  },
  {
    text: "Federal Cost Of Funds",
    value: "FederalCostOfFunds",
  },
  {
    text: "Freddie Mac 60 Day Required Net Yield",
    value: "FreddieMac60DayRequiredNetYield",
  },
  {
    text: "Freddie Mac LIBOR",
    value: "FreddieMacLIBOR",
  },
  {
    text: "Monthly Average CMT",
    value: "MonthlyAverageCMT",
  },
  {
    text: "National Average Contract Rate",
    value: "NationalAverageContractRate",
  },
  {
    text: "National Monthly Median Cost Of Funds",
    value: "NationalMonthlyMedianCostOfFunds",
  },
  {
    text: "TBill Daily Value",
    value: "TBillDailyValue",
  },
  {
    text: "Wall Street Journal LIBOR",
    value: "WallStreetJournalLIBOR",
  },
  {
    text: "Weekly Ave Prime Rate",
    value: "WeeklyAvePrimeRate",
  },
  {
    text: "Weekly Average CD Rate",
    value: "WeeklyAverageCDRate",
  },
  {
    text: "Weekly Average CMT",
    value: "WeeklyAverageCMT",
  },
  {
    text: "Weekly Average SMTI",
    value: "WeeklyAverageSMTI",
  },
  {
    text: "Weekly Average TAABD",
    value: "WeeklyAverageTAABD",
  },
  {
    text: "Weekly Average TAAI",
    value: "WeeklyAverageTAAI",
  },
]);

const sectionOfActTypes = ref([
  {
    text: "203B",
    value: "203B",
  },
  {
    text: "203B251",
    value: "203B251",
  },
  {
    text: "203K",
    value: "203K",
  },
  {
    text: "203K251",
    value: "203K251",
  },
  {
    text: "234C",
    value: "234C",
  },
  {
    text: "234C251",
    value: "234C251",
  },
]);

const communitySecondsRepaymentTypes = ref([
  {
    text: "Deferred Fully Forgiven",
    value: "DeferredFullyForgiven",
  },
  {
    text: "Deferred Not Fully Forgiven",
    value: "DeferredNotFullyForgiven",
  },
  {
    text: "Non Deferred",
    value: "NonDeferred",
  },
]);

const loanAmortizationPeriods = ref(["Month"]);

const investorProductPlanIdentifiers = ref([
  "57",
  "251",
  "649",
  "650",
  "651",
  "652",
  "660",
  "661",
  "681",
  "682",
  "710",
  "720",
  "721",
  "750",
  "751",
  "760",
  "761",
  "861",
  "1030",
  "1423",
  "1437",
  "3252",
  "3846",
  "FHAHY",
  "GEN06",
  "GEN10",
  "GEN1A",
  "GEN1B",
  "GEN3",
  "GEN5",
  "GEN7",
  "VAARM",
  "VA1YR",
]);

const communityLendingProductTypes = ref([
  {
    text: "HFA Preferred",
    value: "HFAPreferred",
  },
  {
    text: "HFA Preferred Risk Sharing",
    value: "HFAPreferredRiskSharing",
  },
  {
    text: "Home Ready",
    value: "HomeReady",
  },
]);
</script>
<template>
  <v-card class="pb-1" light>
    <v-card-title class="p-4">Mortgage Details</v-card-title>
    <v-card-text>
      <v-row class="ma-0 pa-0 d-flex flex-wrap">
        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls">Product Name</span>
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            class="mx-1 my-0 input-field"
            variant="underlined"
            dense
            :model-value="mortgageLoanInformation.ProductName || ''"
            @input="
              (e) =>
                lenderInfoStore.updateMortgageLoanInfo({
                  prop: 'ProductName',
                  value: e.target.value,
                })
            "
            placeholder="Product Name"
            style="max-width: 300px"
            hide-details
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >Loan Amortization Period</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            light
            dense
            clearable
            :items="loanAmortizationPeriods"
            placeholder="Loan Amortization Period"
            :model-value="mortgageLoanInformation.LoanAmortizationPeriodType"
            @update:model-value="
              (value) =>
                lenderInfoStore.updateMortgageLoanInfo({
                  prop: 'LoanAmortizationPeriodType',
                  value,
                })
            "
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >Negative Amortization Type</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            light
            dense
            clearable
            :items="negativeAmortizationTypes"
            item-title="text"
            item-value="value"
            placeholder="Negative Amortization Type"
            :model-value="mortgageLoanInformation.NegativeAmortizationType"
            @update:model-value="
              (value) =>
                lenderInfoStore.updateMortgageLoanInfo({
                  prop: 'NegativeAmortizationType',
                  value,
                })
            "
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >Disclosed Index Rate Percent</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.DisclosedIndexRatePercent || ''"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'DisclosedIndexRatePercent',
                  value: +e.target.value,
                })
            "
            placeholder="Disclosed Index Rate Percent"
            style="max-width: 300px"
            prefix="%"
            :rules="[rules.decimals]"
            type="number"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls">Index Source Type</span>
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            light
            dense
            clearable
            :items="indexSourceTypes"
            item-title="text"
            item-value="value"
            placeholder="Index Source Type"
            :model-value="additionalInfo.IndexSourceType"
            @update:model-value="
              (value) =>
                loanDetailsStore.updateAdditionalInfo({ prop: 'IndexSourceType', value })
            "
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >Index Source Type Other Description</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            light
            dense
            clearable
            :items="indexSourceTypeOthers"
            item-title="text"
            item-value="value"
            placeholder="Index Source Type Other Description"
            :model-value="additionalInfo.IndexSourceTypeOtherDescription"
            @update:model-value="
              (value) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'IndexSourceTypeOtherDescription',
                  value,
                })
            "
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls">Margin Rate Percent</span>
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.MarginRatePercent || ''"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'MarginRatePercent',
                  value: +e.target.value,
                })
            "
            placeholder="Margin Rate Percent"
            hide-details
            style="max-width: 300px"
            prefix="%"
            :rules="[rules.decimals]"
            type="number"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >Qualifying Rate Percent</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.QualifyingRatePercent || ''"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'QualifyingRatePercent',
                  value: +e.target.value,
                })
            "
            placeholder="Qualifying Rate Percent"
            hide-details
            style="max-width: 300px"
            prefix="%"
            :rules="[rules.decimals]"
            type="number"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >Government Mortgage Credit Certificate Amount</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="
              getFormattedValue(
                additionalInfo.GovernmentMortgageCreditCertificateAmount
              ) || ''
            "
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'GovernmentMortgageCreditCertificateAmount',
                  value: +e.target.value.replace(/,/g, ''),
                })
            "
            placeholder="Government Mortgage Credit Certificate Amount"
            hide-details
            style="max-width: 300px"
            prefix="$"
            @keypress="(e) => isOnlyNum(e, true)"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls">Section Of Act Type</span>
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            light
            dense
            clearable
            :items="sectionOfActTypes"
            item-title="text"
            item-value="value"
            placeholder="Section Of Act Type"
            :model-value="additionalInfo.SectionOfActType"
            @update:model-value="
              (value) =>
                loanDetailsStore.updateAdditionalInfo({ prop: 'SectionOfActType', value })
            "
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >Community Seconds Repayment Type</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            light
            dense
            clearable
            :items="communitySecondsRepaymentTypes"
            item-title="text"
            item-value="value"
            placeholder="Community Seconds Repayment Type"
            :model-value="additionalInfo.CommunitySecondsRepaymentType"
            @update:model-value="
              (value) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'CommunitySecondsRepaymentType',
                  value,
                })
            "
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >HUD Income Limit Adjustment Percent</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.HUDIncomeLimitAdjustmentPercent || ''"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'HUDIncomeLimitAdjustmentPercent',
                  value: +e.target.value,
                })
            "
            placeholder="HUD Income Limit Adjustment Percent"
            hide-details
            style="max-width: 300px"
            prefix="%"
            :rules="[rules.decimals]"
            type="number"
          />
        </v-col>
        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls">Ceiling Rate Percent</span>
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.CeilingRatePercent || ''"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'CeilingRatePercent',
                  value: +e.target.value,
                })
            "
            placeholder="Ceiling Rate Percent"
            hide-details
            style="max-width: 300px"
            prefix="%"
            :rules="[rules.decimals]"
            type="number"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls">MI Coverage Percent</span>
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.MICoveragePercent || ''"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'MICoveragePercent',
                  value: +e.target.value,
                })
            "
            placeholder="MI Coverage Percent"
            hide-details
            style="max-width: 300px"
            prefix="%"
            :rules="[rules.decimals]"
            type="number"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >HMDA Rate Spread Percent</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="additionalInfo.HMDARateSpreadPercent || ''"
            @input="
              (e) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'HMDARateSpreadPercent',
                  value: +e.target.value,
                })
            "
            placeholder="HMDA Rate Spread Percent"
            hide-details
            style="max-width: 300px"
            prefix="%"
            :rules="[rules.decimals]"
            type="number"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >HMDA HOEPA Loan Status Indicator</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-checkbox
            label=""
            :model-value="additionalInfo.HMDAHOEPALoanStatusIndicator"
            @update:model-value="
              (value) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'HMDAHOEPALoanStatusIndicator',
                  value,
                })
            "
            class="ma-0 pa-0"
            dense
            hide-details
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >Investor Product Plan Identifier</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            light
            dense
            clearable
            :items="investorProductPlanIdentifiers"
            placeholder="Investor Product Plan Identifier"
            :model-value="additionalInfo.InvestorProductPlanIdentifier"
            @update:model-value="
              (value) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'InvestorProductPlanIdentifier',
                  value,
                })
            "
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex label-name" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center ls"
            >Community Lending Product Type</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            light
            dense
            clearable
            :items="communityLendingProductTypes"
            item-title="text"
            item-value="value"
            placeholder="Community Lending Product Type"
            :model-value="additionalInfo.CommunityLendingProductType"
            @update:model-value="
              (value) =>
                loanDetailsStore.updateAdditionalInfo({
                  prop: 'CommunityLendingProductType',
                  value,
                })
            "
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <CustomButton
          class="button"
          value="Save"
          customClass="primary-button"
          @onHandleClick="generalStore.saveLoanPatches"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
.p-4 {
  padding: 16px;
}
:deep(.v-input .v-text-field__prefix) {
  opacity: 1 !important;
  visibility: visible !important;
}
.button {
  margin-top: 31px !important;
}
.font-weight-medium {
  color: #00000099 !important;
}
:deep(.input-field) {
  input {
    padding-top: 4px !important;
    padding-bottom: 3px !important;
    padding-left: 0px !important;
    min-height: 23px;
    font-size: 13px !important;
    letter-spacing: normal !important;
  }
  .v-text-field__prefix {
    padding-top: 4px !important;
    padding-bottom: 0px !important;
    padding-right: 4px !important;
    min-height: 23px;
    font-size: 13px !important;
  }
}
.ls {
  letter-spacing: 0.1px !important;
  line-height: 22px !important;
}
:deep(.v-select) {
  .v-field__input {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    min-height: 26px;
    font-size: 13px !important;
    input{
      letter-spacing: normal !important;
    }
  }
  .v-field__append-inner,
  .v-field__clearable {
    padding-top: 0px !important;
    padding-bottom: 2px !important;
    min-height: 23px;
  }
}
// .label-name {
//     margin-top: -1px;
// }
</style>
