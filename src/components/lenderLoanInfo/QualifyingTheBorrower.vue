<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { computed, ref, watch } from "vue";
import { useTransactionDetailsStore } from "@/stores/transactionDetailsStore";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";

const { isOnlyNum } = number();
const transactionStore = useTransactionDetailsStore();
const accountAssetsStore = useAccountAndAssetsStore();
const lenderInfoStore = useLenderInfoStore();

const transactionDetails = ref(transactionStore.getTransactionDetails());

const getSum = (arr) => {
  return arr.filter((el) => el != null).reduce((acc, cur) => acc + +cur, 0);
};

const totalDueFromBorrower = computed(() => {
  const valuesForSum = [
    transactionDetails.value.SalesContractAmount,
    transactionDetails.value.AlterationsImprovementsAndRepairsAmount,
    transactionDetails.value.LandOriginalCostAmount,
    transactionDetails.value.TotalSubjectPropertyPayoffsAndPaymentsAmount,
    transactionDetails.value.TotalNonSubjectPropertyDebtsToBePaidOffAmount,
    transactionDetails.value.EstimatedClosingCostsAmount,
    transactionDetails.value.DiscountPointsTotalAmount,
  ];
  return getSum(valuesForSum);
});

const totalLoanAmount = computed(() => {
  const valuesForSum = [
    transactionDetails.value.BaseLoanAmount,
    transactionDetails.value.MIAndFundingFeeFinancedAmount,
  ];
  return getSum(valuesForSum);
});

const totalMortgageLoans = computed(() => {
  const valuesForSum = [
    transactionDetails.value.TotalSubordinateFinancingAmount,
    totalLoanAmount.value,
  ];
  return getSum(valuesForSum);
});

const otherCredits = computed(() => {
  let result = accountAssetsStore.getPurchaseCredits().length
    ? accountAssetsStore
        .getPurchaseCredits()
        .reduce((a, c) => a + (c.PurchaseCreditAmount ? c.PurchaseCreditAmount : 0), 0)
    : 0;
  result += transactionStore.getClosingAdjustments().length
    ? transactionStore
        .getClosingAdjustments()
        .reduce((a, c) => a + c.ClosingAdjustmentItemAmount, 0)
    : 0;
  return result;
});

const totalCredits = computed(() => {
  if (transactionDetails.value.ULADURLATotalSellerCreditsAmount) {
    return otherCredits.value + transactionDetails.value.ULADURLATotalSellerCreditsAmount;
  }
  return otherCredits.value;
});

const lessTotalMortgageLoans = computed(() => {
  return totalMortgageLoans.value + totalCredits.value;
});

const cashFromToTheBorrower = computed(() => {
  const result = totalDueFromBorrower.value - lessTotalMortgageLoans.value;
  return result ? +result.toFixed(2) : 0;
});

watch(cashFromToTheBorrower, (value) => {
  lenderInfoStore.updateTransactionDetails({
    prop: "CashFromBorrowerAtClosingAmount",
    value,
  });
});
</script>

<template>
  <v-row class="flex-wrap mt-3">
    <v-col cols="12" class="pa-0 mb-0 mt-3 d-flex justify-start loan-border-bottom">
      <p
        class="ma-0 px-3 subheader-1 font-weight-bold white--text black loan-border-bottom loan-form-chapter"
      >
        L4. Qualifying the Borrower - Minimum Required Funds or Cash Back
      </p>
    </v-col>

    <v-col cols="12" class="pa-1 loan-border-bottom">
      <span class="font-weight-bold">DUE FROM BORROWER(S)</span>
    </v-col>
    <v-col
      cols="9"
      class="pa-1 loan-border-bottom loan-border-right d-flex contract-price"
    >
      <span class="align-self-center" id="l4-1"> <b>A.</b> Sales Contract Price </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 cashback-inputs"
        :model-value="getFormattedValue(transactionDetails.SalesContractAmount)"
        @input="
          (e) =>
            lenderInfoStore.updateTransactionDetails({
              prop: 'SalesContractAmount',
              value: +e.target.value.replace(/,/g, ''),
            })
        "
        placeholder="Sales Contract Price"
        prefix="$"
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>
    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-2">
        <b>B.</b> Improvements, Renovations and Repairs
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 cashback-inputs"
        :model-value="
          getFormattedValue(transactionDetails.AlterationsImprovementsAndRepairsAmount)
        "
        @input="
          (e) =>
            lenderInfoStore.updateTransactionDetails({
              prop: 'AlterationsImprovementsAndRepairsAmount',
              value: +e.target.value.replace(/,/g, ''),
            })
        "
        placeholder="Improvements, Renovations and Repairs"
        prefix="$"
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>
    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-3">
        <b>C.</b> Land (if acquired seperately)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 cashback-inputs"
        :model-value="getFormattedValue(transactionDetails.LandOriginalCostAmount)"
        @input="
          (e) =>
            lenderInfoStore.updateTransactionDetails({
              prop: 'LandOriginalCostAmount',
              value: +e.target.value.replace(/,/g, ''),
            })
        "
        placeholder="Land"
        prefix="$"
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 d-flex loan-border-bottom loan-border-right" id="l4-4">
      <span class="font-weight-bold align-self-center">D.&nbsp;</span>
      <span class="align-self-center">
        For Refinance: Balance of Mortgage Loans on the Property to be paid off in the
        Transaction (See Table 3a. Property You Own)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 cashback-inputs"
        :model-value="
          getFormattedValue(
            transactionDetails.TotalSubjectPropertyPayoffsAndPaymentsAmount
          )
        "
        @input="
          (e) =>
            lenderInfoStore.updateTransactionDetails({
              prop: 'TotalSubjectPropertyPayoffsAndPaymentsAmount',
              value: +e.target.value.replace(/,/g, ''),
            })
        "
        placeholder="Balance of Mortgage Loans"
        prefix="$"
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 d-flex loan-border-bottom loan-border-right" id="l4-5">
      <span class="align-self-center">
        <b>E.</b>
        Credit Cards and Other Debts Paid Off (See Table 2c. Liabilities — Credit Cards,
        Other Debts, and Leases that You Owe)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 cashback-inputs"
        :model-value="
          getFormattedValue(
            transactionDetails.TotalNonSubjectPropertyDebtsToBePaidOffAmount
          )
        "
        @input="
          (e) =>
            lenderInfoStore.updateTransactionDetails({
              prop: 'TotalNonSubjectPropertyDebtsToBePaidOffAmount',
              value: +e.target.value.replace(/,/g, ''),
            })
        "
        placeholder="Credit Cards and Other Debts Paid Off"
        prefix="$"
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 d-flex loan-border-bottom loan-border-right">
      <span class="align-self-center" id="l4-6">
        <b>F.</b>
        Borrower Closing Costs (including Prepaid and Initial Escrow Payments)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 cashback-inputs"
        :model-value="getFormattedValue(transactionDetails.EstimatedClosingCostsAmount)"
        @input="
          (e) =>
            lenderInfoStore.updateTransactionDetails({
              prop: 'EstimatedClosingCostsAmount',
              value: +e.target.value.replace(/,/g, ''),
            })
        "
        placeholder="Borrower Closing Costs"
        prefix="$"
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 d-flex loan-border-bottom loan-border-right">
      <span class="align-self-center" id="l4-7">
        <b>G.</b>
        Discount Points
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 cashback-inputs"
        :model-value="getFormattedValue(transactionDetails.DiscountPointsTotalAmount)"
        @input="
          (e) =>
            lenderInfoStore.updateTransactionDetails({
              prop: 'DiscountPointsTotalAmount',
              value: +e.target.value.replace(/,/g, ''),
            })
        "
        placeholder="Discount Points"
        prefix="$"
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 d-flex loan-border-bottom loan-border-right">
      <span class="align-self-center" id="l4-8___2">
        <b>H.</b> TOTAL DUE FROM BORROWER(s)
        (Total of A thru G)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 font-weight-bold cashback-inputs"
        :model-value="getFormattedValue(totalDueFromBorrower) || ''"
        readonly
        placeholder="Total Due From Borrower"
        prefix="$"
        hide-details
      ></v-text-field>
    </v-col>

    <v-col cols="12" class="pa-1 loan-border-bottom">
      <span class="font-weight-bold">TOTAL MORTGAGE LOANS</span>
    </v-col>
    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex flex-column">
      <span> <b>I.</b> Loan Amount </span>
      <span class="ml-sm-5 d-flex align-center">
        <span class="align-self-center" id="l4-9-1">
          Loan Amount Excluding Financed Mortgage Insurance
          (or Mortgage Insurance Equivalent)
        </span>
        <v-text-field
          light
          variant="underlined"
          class="pa-0 ma-0 ml-4 mr-4 align-self-bottom cashback-inputs-1"
          style="width: 150px"
          :model-value="getFormattedValue(transactionDetails.BaseLoanAmount)"
          @input="
            (e) =>
              lenderInfoStore.updateTransactionDetails({
                prop: 'BaseLoanAmount',
                value: +e.target.value.replace(/,/g, ''),
              })
          "
          placeholder="Loan Amount Excluding Financed Mortgage Insurance"
          prefix="$"
          hide-details
          @keypress="(e) => isOnlyNum(e, true)"
        ></v-text-field>
      </span>
      <span class="ml-sm-5 d-flex align-center">
        <span class="align-self-center" id="l4-9-2">
          Financed Mortgage Insurance
          (or Mortgage Insurance Equivalent) Amount $
        </span>

        <v-text-field
          light
          variant="underlined"
          class="pa-0 ma-0 ml-4 mr-4 align-self-bottom cashback-inputs-2"
          style="width: 150px"
          :model-value="
            getFormattedValue(transactionDetails.MIAndFundingFeeFinancedAmount)
          "
          @input="
            (e) =>
              lenderInfoStore.updateTransactionDetails({
                prop: 'MIAndFundingFeeFinancedAmount',
                value: +e.target.value.replace(/,/g, ''),
              })
          "
          placeholder="Financed Mortgage Insurance"
          prefix="$"
          hide-details
          @keypress="(e) => isOnlyNum(e, true)"
        ></v-text-field>
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        id="l4-9"
        variant="underlined"
        class="ml-4 align-self-end cashback-inputs"
        :model-value="getFormattedValue(totalLoanAmount) || ''"
        placeholder="Loan Amount"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
    </v-col>
    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex flex-column">
      <span id="l4-10">
        <b>J.</b> Other New Mortgage Loans on the Property the Borrower(s) is Buying or
        Refinancing
        <br />
        <span class="ml-4 font-italic line-height"
          >(See Table 4b. Other New Mortgage Loans on the Property You are Buying or
          Refinancing)</span
        >
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 align-self-end cashback-inputs"
        :model-value="
          getFormattedValue(transactionDetails.TotalSubordinateFinancingAmount)
        "
        @input="
          (e) =>
            lenderInfoStore.updateTransactionDetails({
              prop: 'TotalSubordinateFinancingAmount',
              value: +e.target.value.replace(/,/g, ''),
            })
        "
        placeholder="Other New Mortgage Loans"
        prefix="$"
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-11">
        <b>K.</b> TOTAL MORTGAGE LOANS
        (Total of I and J)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 align-self-end font-weight-bold cashback-inputs"
        :model-value="getFormattedValue(totalMortgageLoans) || ''"
        placeholder="Total Mortgage Loans"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
    </v-col>

    <v-col cols="12" class="pa-1 loan-border-bottom">
      <span class="font-weight-bold">TOTAL CREDITS</span>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-12">
        <b>L.</b> Seller Credits
        (Enter the amount of Borrower(s) costs paid by the property seller)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 align-self-end cashback-inputs"
        :model-value="
          getFormattedValue(transactionDetails.ULADURLATotalSellerCreditsAmount)
        "
        @input="
          (e) =>
            lenderInfoStore.updateTransactionDetails({
              prop: 'ULADURLATotalSellerCreditsAmount',
              value: +e.target.value.replace(/,/g, ''),
            })
        "
        placeholder="Seller Credits"
        prefix="$"
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center d-flex" id="l4-13">
        <b>M.&nbsp;</b>
        <span
          >Other Credits
          (Enter the sum of all other credits — Borrower Paid Fees, Earnest Money,
            Employer Assisted Housing, Lease Purchase Fund, Lot Equity, Relocation Funds,
            Sweat Equity, Trade Equity, Other)
        </span>
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 align-self-end cashback-inputs"
        :model-value="getFormattedValue(otherCredits)"
        placeholder="Other Credits"
        prefix="$"
        readonly
        hide-details
        @keypress="(e) => isOnlyNum(e, true)"
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-14">
        <b>N.</b> TOTAL CREDITS
        (Total of L and M)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 align-self-end font-weight-bold cashback-inputs"
        :model-value="getFormattedValue(totalCredits) || ''"
        placeholder="Total Mortgage Loans"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
    </v-col>

    <v-col cols="12" class="pa-1 loan-border-bottom">
      <span class="font-weight-bold">CALCULATION</span>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center" id="l4-8">
        TOTAL DUE FROM BORROWER(s)
        (Line H)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 align-self-end font-weight-bold cashback-inputs"
        :model-value="getFormattedValue(totalDueFromBorrower) || ''"
        placeholder="Total Due From Borrower(s)"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="align-self-center">
        LESS TOTAL MORTGAGE LOANS
        (Line K) AND TOTAL CREDITS
        (Line N)
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 align-self-end font-weight-bold cashback-inputs"
        :model-value="getFormattedValue(lessTotalMortgageLoans) || ''"
        placeholder="Less Total Mortgage Loans"
        prefix="- $"
        readonly
        hide-details
      ></v-text-field>
    </v-col>

    <v-col cols="9" class="pa-1 loan-border-bottom loan-border-right d-flex">
      <span class="font-weight-bold align-self-center line-height">
        Cash From/To the Borrower
        (Line H minus Line K and Line N)
        <br />
        NOTE: This amount does not include reserves or other funds that may be required by
        the Lender to be verified.
      </span>
    </v-col>
    <v-col cols="3" class="pa-1 loan-border-bottom d-flex">
      <v-text-field
        light
        variant="underlined"
        class="ml-4 align-self-end font-weight-bold cashback-inputs"
        :model-value="getFormattedValue(cashFromToTheBorrower) || ''"
        placeholder="Cash From/To the Borrower"
        prefix="$"
        readonly
        hide-details
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped>
:deep(.v-input .v-text-field__prefix) {
  opacity: 1 !important;
  visibility: visible !important;
}

:deep(.cashback-inputs) {
  margin-bottom: -1px;
  input {
    padding-top: 7.5px !important;
    padding-bottom: 4px !important;
    padding-left: 4px !important;
    min-height: 24px;
    &::placeholder{
      letter-spacing: normal !important;
    }
  }
  .v-text-field__prefix {
    padding-top: 7.5px !important;
    padding-bottom: 0px !important;
    min-height: 24px;
  }
}
:deep(.cashback-inputs-1){
  input {
    padding-top: 2px !important;
    padding-bottom: 4px !important;
    padding-left: 4px !important;
    min-height: 23px;
    &::placeholder{
      letter-spacing: normal !important;
    }
  }
  .v-text-field__prefix {
    padding-top: 2px !important;
    padding-bottom: 0px !important;
    min-height: 23px;
  }
}
:deep(.cashback-inputs-2){
  input {
    padding-top: 3px !important;
    padding-bottom: 4px !important;
    padding-left: 4px !important;
    min-height: 23px;
    &::placeholder{
      letter-spacing: normal !important;
    }
  }
  .v-text-field__prefix {
    padding-top: 3px !important;
    padding-bottom: 0px !important;
    min-height: 23px;
  }
}


.lenderloan .loan-form-chapter{
  padding-bottom: 2px !important;
}

</style>
