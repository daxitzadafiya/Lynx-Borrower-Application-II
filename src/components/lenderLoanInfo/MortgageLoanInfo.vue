<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { computed, ref, watch } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { useTransactionDetailsStore } from "@/stores/transactionDetailsStore";
import { number } from "@/mixins/onlyNum";

const realEstateStore = useRealEstateStore();
const lenderInfoStore = useLenderInfoStore();
const transactionStore = useTransactionDetailsStore();
const { isOnlyNum } = number();

const mortgageTypes = ref([
  {
    text: "Conventional",
    value: "Conventional",
  },
  {
    text: "FHA",
    value: "FHA",
  },
  {
    text: "USDA Rural Development",
    value: "USDARuralDevelopment",
  },
  {
    text: "VA",
    value: "VA",
  },
  {
    text: "Other",
    value: "Other",
  },
]);
const amortizationTypes = ref([
  {
    text: "Adjustable Rate",
    value: "AdjustableRate",
  },
  {
    text: "Fixed",
    value: "Fixed",
  },
  {
    text: "GEM",
    value: "GEM",
  },
  {
    text: "GPM",
    value: "GPM",
  },
  {
    text: "Other",
    value: "Other",
  },
]);
const housingExpenseTypes = ref([
  {
    text: "First Mortgage Principal And Interest",
    value: "FirstMortgagePrincipalAndInterest",
  },
  {
    text: "Homeowners Association Dues And Condominium Fees",
    value: "HomeownersAssociationDuesAndCondominiumFees",
  },
  {
    text: "Homeowners Insurance",
    value: "HomeownersInsurance",
  },
  {
    text: "M I Premium",
    value: "MIPremium",
  },
  {
    text: "Other",
    value: "Other",
  },
  {
    text: "Other Mortgage Loan Principal And Interest",
    value: "OtherMortgageLoanPrincipalAndInterest",
  },
  {
    text: "Real Estate Tax",
    value: "RealEstateTax",
  },
  {
    text: "Rent",
    value: "Rent",
  },
  {
    text: "Supplemental Property Insurance",
    value: "SupplementalPropertyInsurance",
  },
]);

const mortgageLienType = ref([
  {
    label: "First Lien",
    value: "FirstLien",
  },
  {
    label: "Subordinate Lien",
    value: "SecondLien",
  },
]);
const housingExpenseValue = (type) => {
  const expense = realEstateStore
    .getHousingExpenses()
    .find((item) => item && item.HousingExpenseType === type);
  return expense ? getFormattedValue(expense.HousingExpensePaymentAmount) : "";
};

const updateHousingExpense = (index, value) => {
  const type = housingExpenseTypes.value[index].value;
  let HousingExpenses = [...realEstateStore.getHousingExpenses()];
  const expenseIndex = HousingExpenses.findIndex(
    (item) => item.HousingExpenseType === type
  );
  if (expenseIndex !== -1) {
    HousingExpenses = !value
      ? HousingExpenses.filter((item, i) => expenseIndex !== i)
      : (HousingExpenses = HousingExpenses.map((item, i) =>
          expenseIndex !== i ? item : { ...item, HousingExpensePaymentAmount: value }
        ));
  } else {
    HousingExpenses.push({
      HousingExpenseTimingType: "Proposed",
      HousingExpenseType: type,
      HousingExpensePaymentAmount: value,
    });
  }
  lenderInfoStore.updateMortgageLoanInfo({
    prop: "HousingExpenses",
    value: HousingExpenses,
  });
};

const totalExpenses = computed(() => {
  if (realEstateStore.getHousingExpenses().length) {
    const result = realEstateStore
      .getHousingExpenses()
      .reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.HousingExpensePaymentAmount)
            ? +cur.HousingExpensePaymentAmount
            : 0),
        0
      );
    return result ? +result.toFixed(2) : 0;
  }
  return "";
});

const mortgageLoanInformation = ref(transactionStore.getMortgageLoanInformation());

const toggleRadioOption = (prop, value) => {
  if (mortgageLoanInformation.value.MortgageType === value) {
    lenderInfoStore.updateMortgageLoanRadioOption({ prop, value: "" });
  } else {
    lenderInfoStore.updateMortgageLoanRadioOption({ prop, value });
  }
};

watch(
  () => transactionStore.getMortgageLoanInformation().LoanAmortizationPeriodCount,
  (val) => {
    if (val) {
      lenderInfoStore.updateMortgageLoanInfo({
        prop: "LoanAmortizationPeriodType",
        value: "Month",
      });
    } else {
      lenderInfoStore.updateMortgageLoanInfo({
        prop: "LoanAmortizationPeriodType",
        value: "",
      });
    }
  }
);

watch(realEstateStore.getHousingExpenses(), () => {
  setDebtToIncomeAndHousingRatios();
});
</script>
<template>
  <v-row class="flex-wrap flex-column flex-sm-row mt-sm-3 mt-1">
    <v-col :sm="12" class="pa-0 mb-0 mt-3 d-flex justify-start loan-border-bottom">
      <p
        class="ma-0 px-3 subheader-1 font-weight-bold white--text black loan-border-bottom loan-form-chapter"
      >
        L3. Mortgage Loan Information
      </p>
    </v-col>
    <v-col :sm="6" class="pa-1 loan-border-bottom loan-border-right">
      <p class="mortgage-title">Mortgage Type Applied For</p>
      <div
        class="pa-0 ma-0 mx-0 d-flex flex-wrap type-checkbox-main flex-column flex-sm-row"
      >
        <div
          class="d-flex flex-column flex-sm-row"
          v-for="(status, index) in mortgageTypes"
          :key="status.value"
          :style="{ width: index == 1 ? '70%' : '' }"
        >
          <span :id="'l3-1___' + index">
            <v-radio
              :label="status.text"
              :value="status.value"
              :model-value="mortgageLoanInformation.MortgageType"
              density="compact"
              class="type-checkbox"
              hide-details
              @click="toggleRadioOption('MortgageType', status.value)"
            />
          </span>

          <v-text-field
            light
            variant="underlined"
            class="my-0 ml-sm-4 mortgage-type"
            placeholder="Other Mortgage Type"
            hide-details
            v-if="status.value == 'Other'"
          ></v-text-field>
        </div>
      </div>
    </v-col>
    <v-col :sm="6" class="pa-1 loan-border-bottom">
      <v-row class="pa-0 ma-0 flex-column flex-sm-row">
        <v-col :sm="7" class="pa-0 d-flex flex-column">
          <b>Terms of Loan</b>
          <div class="d-flex align-center">
            <span class="align-self-center" id="l3-2">Note Rate</span>
            <v-text-field
              light
              variant="underlined"
              class="my-0 ml-4 note-rate"
              :model-value="mortgageLoanInformation.NoteRatePercent"
              @input="
                (e) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'NoteRatePercent',
                    value: +e.target.value,
                  })
              "
              placeholder="Note Rate"
              hide-details
              style="max-width: 120px"
              type="number"
            ></v-text-field>
            <span class="align-self-center">%</span>
          </div>
          <div class="d-flex align-center">
            <span class="align-self-center" id="l3-3">Loan Term</span>
            <v-text-field
              light
              variant="underlined"
              class="my-0 ml-4 loan-term"
              :model-value="mortgageLoanInformation.LoanAmortizationPeriodCount"
              @input="
                (e) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'LoanAmortizationPeriodCount',
                    value: +e.target.value,
                  })
              "
              placeholder="Loan Term"
              hide-details
              style="max-width: 120px"
              type="number"
            ></v-text-field>
            <span class="font-italic align-self-center">(months)</span>
          </div>
        </v-col>
        <v-col :sm="5" class="pa-0">
          <b>Mortgage Lien Type</b>
          <div class="pa-0 ma-0 mx-0 d-flex flex-wrap">
            <Radio
              class="mortgage-lien-radio pb-0"
              :options="mortgageLienType"
              :value="mortgageLoanInformation.LienPriorityType"
              @change="
                (val) =>
                  lenderInfoStore.updateMortgageLoanRadioOption({
                    prop: 'LienPriorityType',
                    value: val,
                  })
              "
            ></Radio>
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-col :sm="6" class="pa-1 loan-border-bottom loan-border-right d-flex flex-column">
      <b>Amortization type</b>
      <div class="pa-0 ma-0 mx-0 d-flex flex-wrap">
        <v-row class="pa-0 ma-0">
          <v-col :sm="6" class="pa-0">
            <v-select
              class="mx-1 my-0 pt-1 adjustable-rate"
              light
              variant="underlined"
              :items="amortizationTypes"
              item-title="text"
              item-value="value"
              placeholder="Amortization type"
              :model-value="mortgageLoanInformation.AmortizationType"
              @update:model-value="
                (value) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'AmortizationType',
                    value,
                  })
              "
              :menu-props="{ light: true }"
              style="max-width: 300px; max-height: 33px"
            >
            </v-select>
          </v-col>
          <v-col
            cols="6"
            class="pa-0"
            v-if="mortgageLoanInformation.AmortizationType === 'Other'"
          >
            <v-text-field
              light
              variant="underlined"
              class="mx-1 my-0 pt-1"
              :model-value="mortgageLoanInformation.AmortizationTypeOtherDescription"
              @input="
                (e) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'AmortizationTypeOtherDescription',
                    value: e.target.value,
                  })
              "
              placeholder="Other Explanation"
              hide-details
            >
            </v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="ml-sm-10">
        <span class="font-weight-bold">If Adjustable Rate:</span>
        <div class="d-flex flex-column flex-sm-row">
          <span id="l3-6">Initial Period Prior to First Adjustment</span>
          <div class="d-flex align-center">
            <v-text-field
              light
              variant="underlined"
              class="my-0 ml-2 initial-period"
              :model-value="
                mortgageLoanInformation.InitialFixedPeriodEffectiveMonthsCount
              "
              @input="
                (e) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'InitialFixedPeriodEffectiveMonthsCount',
                    value: +e.target.value,
                  })
              "
              placeholder="Initial Period"
              hide-details
              type="number"
            ></v-text-field>
            <span class="font-italic align-self-center">(months)</span>
          </div>
        </div>
        <div class="d-flex flex-column flex-sm-row">
          <span id="l3-7">Subsequent Adjustment Period</span>
          <div class="d-flex align-center">
            <v-text-field
              light
              variant="underlined"
              class="my-0 ml-sm-4 adjustment-period"
              :model-value="
                mortgageLoanInformation.PerChangeRateAdjustmentFrequencyMonthsCount
              "
              @input="
                (e) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'PerChangeRateAdjustmentFrequencyMonthsCount',
                    value: +e.target.value,
                  })
              "
              placeholder="Initial Period"
              hide-details
              type="number"
            ></v-text-field>
            <span class="font-italic align-self-center">(months)</span>
          </div>
        </div>
      </div>
      <span class="loan-features pt-3 pt-sm-0">Loan Features</span>

      <div class="loan-features-box ">
        <div class="d-flex h-26 flex-column flex-sm-row mt-2 mt-sm-0">
          <span id="l3-8">
            <v-checkbox
              light
              label="Balloon / Balloon Term"
              :model-value="mortgageLoanInformation.BalloonIndicator"
              @change="lenderInfoStore.updateMortgageLoanInfoBoolean('BalloonIndicator')"
              class="ma-0 pa-0"
              dense
              hide-details
            ></v-checkbox>
          </span>
          <div class="d-flex align-center">
            <v-text-field
              light
              variant="underlined"
              class="my-0 ml-2 balloon-term"
              :model-value="mortgageLoanInformation.BalloonLoanMaturityPeriodCount"
              @input="
                (e) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'BalloonLoanMaturityPeriodCount',
                    value: +e.target.value,
                  })
              "
              placeholder="Balloon Term"
              hide-details
              type="number"
            ></v-text-field>
            <span class="font-italic align-self-center">(months)</span>
          </div>
        </div>

        <div class="d-flex h-26 flex-column flex-sm-row mt-2 mt-sm-0">
          <span id="l3-9">
            <v-checkbox
              light
              label="Interest Only / Interest Only Term"
              :model-value="mortgageLoanInformation.InterestOnlyIndicator"
              @change="
                lenderInfoStore.updateMortgageLoanInfoBoolean('InterestOnlyIndicator')
              "
              class="ma-0 pa-0"
              dense
              hide-details
            ></v-checkbox>
          </span>
          <div class="d-flex align-center">
            <v-text-field
              light
              variant="underlined"
              class="my-0 ml-2 interest-only"
              :model-value="mortgageLoanInformation.InterestOnlyTermMonthsCount"
              @input="
                (e) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'InterestOnlyTermMonthsCount',
                    value: +e.target.value,
                  })
              "
              placeholder="Interest Only Term"
              hide-details
              type="number"
            ></v-text-field>
            <span class="font-italic align-self-center">(months)</span>
          </div>
        </div>

        <div class="d-flex h-26">
          <span id="l3-10">
            <v-checkbox
              light
              label="Negative Amortization"
              :model-value="mortgageLoanInformation.NegativeAmortizationIndicator"
              @change="
                lenderInfoStore.updateMortgageLoanInfoBoolean(
                  'NegativeAmortizationIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details
            ></v-checkbox>
          </span>
        </div>

        <div class="d-flex h-26 flex-column flex-sm-row mt-2 mt-sm-0">
          <span id="l3-11">
            <v-checkbox
              light
              label="Prepayment Penalty / Prepayment Penalty Term"
              :model-value="mortgageLoanInformation.PrepaymentPenaltyIndicator"
              @change="
                lenderInfoStore.updateMortgageLoanInfoBoolean(
                  'PrepaymentPenaltyIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details
            ></v-checkbox>
          </span>
          <div class="d-flex align-center">
            <v-text-field
              light
              variant="underlined"
              class="my-0 ml-2 prepayment-penalty-term"
              :model-value="
                mortgageLoanInformation.PrepaymentPenaltyExpirationMonthsCount
              "
              @input="
                (e) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'PrepaymentPenaltyExpirationMonthsCount',
                    value: +e.target.value,
                  })
              "
              placeholder="Prepayment Penalty Term"
              hide-details
              type="number"
            ></v-text-field>
            <span class="font-italic align-self-center">(months)</span>
          </div>
        </div>

        <div class="d-flex h-26 flex-column flex-sm-row mt-2 mt-sm-0">
          <span id="l3-12">
            <v-checkbox
              light
              label="Temporary Interest Rate Buydown / Initial Buydown Rate"
              :model-value="
                mortgageLoanInformation.BuydownTemporarySubsidyFundingIndicator
              "
              @change="
                lenderInfoStore.updateMortgageLoanInfoBoolean(
                  'BuydownTemporarySubsidyFundingIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details
            ></v-checkbox>
          </span>
          <div class="d-flex align-center">
            <v-text-field
              light
              variant="underlined"
              class="my-0 ml-2 initial-buydown-rate"
              :model-value="
                mortgageLoanInformation.BuydownInitialEffectiveInterestRatePercent
              "
              @input="
                (e) =>
                  lenderInfoStore.updateMortgageLoanInfo({
                    prop: 'BuydownInitialEffectiveInterestRatePercent',
                    value: +e.target.value,
                  })
              "
              placeholder="Initial Buydown Rate"
              hide-details
              type="number"
            ></v-text-field>
            <span class="font-italic align-self-center">%</span>
          </div>
        </div>

        <div class="d-flex h-26 mt-2 mt-sm-0 align-center">
          <span id="l3-13">
            <v-checkbox
              light
              label="Other (explain):"
              class="ma-0 pa-0"
              dense
              hide-details
            ></v-checkbox>
          </span>
          <v-text-field
            light
            variant="underlined"
            class="my-0 ml-4 mr-6 other"
            :model-value="mortgageLoanInformation.ProductDescription"
            @input="
              (e) =>
                lenderInfoStore.updateMortgageLoanInfo({
                  prop: 'ProductDescription',
                  value: e.target.value,
                })
            "
            placeholder="Other"
            hide-details
          ></v-text-field>
        </div>
      </div>
    </v-col>
    <v-col :sm="6" class="pa-1 loan-border-bottom d-flex flex-column">
      <span class="mb-2 font-weight-bold">Proposed Monthly Payment for Property</span>

      <div class="payment-for-property-main">
        <v-row
          class="ma-0 pa-0 h-30 mt-3 mt-sm-0 flex-column flex-sm-row"
          v-for="(item, index) in housingExpenseTypes"
          :key="item.value"
        >
          <v-col class="ma-0 pa-0 d-flex" :sm="7">
            <span class="align-self-center" :id="'l3-14-' + (index + 1)">{{
              item.text
            }}</span>
          </v-col>
          <v-col class="ma-0 pa-0" :sm="5">
            <v-text-field
              light
              variant="underlined"
              class="ml-sm-4 payment-for-property"
              :model-value="housingExpenseValue(item.value)"
              @input="
                (e) => updateHousingExpense(index, +e.target.value.replace(/,/g, ''))
              "
              :placeholder="item.text"
              prefix="$"
              hide-details
              @keypress="(e) => isOnlyNum(e, true)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="ma-0 pa-0 h-30 mt-3 mt-sm-0 flex-column flex-sm-row">
          <v-col class="pa-0 d-flex" :sm="7">
            <span class="font-weight-bold align-self-center" id="l3-14">TOTAL</span>
          </v-col>
          <v-col class="pa-0" :sm="5">
            <v-text-field
              light
              variant="underlined"
              class="ml-sm-4 font-weight-bold total-amount"
              :model-value="getFormattedValue(totalExpenses) || ''"
              placeholder="total"
              prefix="$"
              readonly
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped>
:deep(.v-input .v-text-field__prefix) {
  opacity: 1 !important;
  visibility: visible !important;
}
:deep(.mortgage-lien-radio) {
  .v-selection-control {
    gap: 10px;
    .v-label {
      white-space: nowrap !important;
      letter-spacing: normal;
    }
  }
  .v-selection-control--density-default {
    --v-selection-control-size: 24px !important;
  }
}

.mortgage-title {
  font-size: 16px !important;
  line-height: 24px !important;
  margin: 0 !important;
}
.subheader-1 {
  padding-bottom: 2px !important;
}
:deep(.type-checkbox) {
  height: 24px !important;
  @media (max-width: $lg-mobile-width) {
    height: auto !important;
  }
}
:deep(.type-checkbox-main) {
  margin-top: -2px !important;
}

:deep(.mortgage-type) {
  .v-input__control {
    min-width: 165px !important;
  }
  input {
    padding: 0 !important;
    min-height: 24px !important;
  }
}
:deep(.note-rate) {
  input {
    padding: 0 !important;
    min-height: 24px !important;
  }
}

:deep(.loan-term) {
  input {
    padding-bottom: 0 !important;
    padding-top: 0px !important;
    min-height: 24px !important;
  }
}

.mortgage-lien-radio {
  margin-top: -2px;
  margin-bottom: 6px !important;
}

:deep(.adjustable-rate) {
  .v-field__input {
    padding-bottom: 0 !important;
    letter-spacing: normal !important;
    padding-top: 3px !important;
    min-height: 24px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
  }
  .v-field__append-inner {
    padding: 0 !important;
  }
}
:deep(.initial-period),
:deep(.adjustment-period) {
  input {
    padding-bottom: 2px !important;
    padding-top: 4px !important;
    min-height: 24px !important;
  }
}
:deep(.balloon-term),
:deep(.interest-only),
:deep(.prepayment-penalty-term),
:deep(.initial-buydown-rate),
:deep(.other) {
  input {
    padding-bottom: 0px !important;
    padding-top: 0px !important;
    min-height: 24px !important;
  }
}

.loan-features {
  margin-top: 1px;
}
.h-26 {
  min-height: 26px !important;
}
.loan-features-box {
  margin-top: -1px !important;
  @media(max-width:$lg-mobile-width){
    margin-left: -4px;
  }
}

:deep(.payment-for-property),
:deep(.total-amount) {
  input {
    padding-bottom: 2px !important;
    padding-top: 2px !important;
    min-height: 24px !important;
  }
  .v-text-field__prefix {
    padding-bottom: 2px !important;
    padding-top: 2px !important;
    min-height: 24px !important;
  }
}

.h-30 {
  min-height: 30px !important;
}
.align-self-center {
  line-height: 19.5px !important;
}

.payment-for-property-main {
  margin-top: -1px;
}

@media (max-width: $desktop-width) {
  :deep(.v-checkbox .v-selection-control) {
    min-height: 100% !important;
    margin-left: -8px;
    height: 100% !important;
  }
}
:deep(.v-checkbox .v-selection-control) {
    min-height: 33px !important;
    height: auto !important;
}
</style>

