<script setup>
import BorrowerDue from "@/components/transactions/BorrowerDue.vue";
import TotalMortgageLoans from "@/components/transactions/TotalMortgageLoans.vue";
import TotalCredits from "@/components/transactions/TotalCredits.vue";
import Calculations from "@/components/transactions/Calculations.vue";
import { computed, ref } from "vue";
import { useTransactionDetailsStore } from "@/stores/transactionDetailsStore";
import { useAccountAndAssetsStore } from "../../stores/accountsAndAssets";

const transactionStore = useTransactionDetailsStore();
const accountAssetsStore = useAccountAndAssetsStore();

const borrowerDueData = ref([
  {
    title: "Sales Contract Price",
    amount: 0,
    prop: "SalesContractAmount",
  },
  {
    title: "Improvements, Renovations, Repairs",
    amount: 0,
    prop: "AlterationsImprovementsAndRepairsAmount",
  },
  {
    title: "Land (if acquired separately)",
    amount: 0,
    prop: "LandOriginalCostAmount",
  },
  {
    title:
      "For Refinance: Balance of Mortgage Loans on the Property to be paid off in the Transaction",
    amount: 0,
    prop: "TotalSubjectPropertyPayoffsAndPaymentsAmount",
  },
  {
    title: "Credit Cards and Other Debts Paid Off",
    amount: 0,
    prop: "TotalNonSubjectPropertyDebtsToBePaidOffAmount",
  },
  {
    title: "Borrower Closing Costs (including Prepaid and Initial Escrow Payments)",
    amount: 0,
    prop1: "TotalNonSubjectPropertyDebtsToBePaidOffAmount",
    prop2: "EstimatedClosingCostsAmount",
  },
  {
    title: "Discount Points",
    amount: 0,
    prop: "DiscountPointsTotalAmount",
  },
]);

const mortgageData = ref([
  {
    title:
      "Loan Amount Excluding Financed Mortgage Insurance (or Mortgage Insurance Equivalent)",
    amount: 0,
    prop: "BaseLoanAmount",
  },
  {
    title: "Financed Mortgage Insurance (or Mortgage Insurance Equivelant)",
    amount: 0,
    prop: "MIAndFundingFeeFinancedAmount",
  },
  {
    title:
      "Other New Mortgage Loans on the Property the Borrower(s) is Buying or Refinancing",
    amount: 0,
    prop: "TotalSubordinateFinancingAmount",
  },
]);

const creditsData = ref([
  {
    title: "Seller Credits",
    amount: 0,
    prop: "ULADURLATotalSellerCreditsAmount",
  },
  { title: "Other Credits", amount: 0, prop: "PurchaseCreditAmount" },
]);

const calculations = ref([
  { title: "Total Due From Borrowers", amount: 0 },
  {
    title: "Less Total Mortgage Loans and Total Credits",
    amount: 0,
    isNegative: true,
  },
  { title: "Cash From/To the Borrower at Closing", amount: 0 },
]);

const borrowerDueBinded = computed(() => {
  const allData = borrowerDueData.value.reduce((acc, cur) => {
    const { prop, prop1, prop2 } = cur;
    let amount = transactionStore.getTransactionDetails()[prop] || 0;
    if (prop1 && prop2) {
      amount =
        (transactionStore.getTransactionDetails()[prop1] || 0) +
        (transactionStore.getTransactionDetails()[prop2] || 0);
    }
    acc.push({ ...cur, amount });
    return acc;
  }, []);
  const total = allData.reduce((acc, cur) => acc + +cur.amount, 0);
  return [...allData, { title: "Total due from borrower", amount: total }];
});

const mortgageBinded = computed(() => {
  const allData = mortgageData.value.reduce((acc, cur) => {
    const { prop } = cur;
    let amount = transactionStore.getTransactionDetails()[prop] || 0;
    if (prop === "NoteAmount" && transactionStore.getOtherNewMortgageLoans().length) {
      amount = transactionStore
        .getOtherNewMortgageLoans()
        .reduce((a, c) => a + (c.NoteAmount ? c.NoteAmount : 0), 0);
    }
    acc.push({ ...cur, amount });
    return acc;
  }, []);
  const total = allData.reduce((acc, cur) => acc + +cur.amount, 0);
  return [...allData, { title: "Total mortgage loans", amount: total }];
});

const creditsBinded = computed(() => {
  const allData = creditsData.value.reduce((acc, cur) => {
    const { prop } = cur;
    let amount = transactionStore.getTransactionDetails()[prop] || 0;
    if (
      prop === "PurchaseCreditAmount" &&
      accountAssetsStore.getPurchaseCredits().length
    ) {
      amount = accountAssetsStore
        .getPurchaseCredits()
        .reduce((a, c) => a + (c.PurchaseCreditAmount ? c.PurchaseCreditAmount : 0), 0);
      amount += transactionStore.getClosingAdjustments().length
        ? transactionStore
            .getClosingAdjustments()
            .reduce((a, c) => a + c.ClosingAdjustmentItemAmount, 0)
        : 0;
    }
    acc.push({ ...cur, amount });
    return acc;
  }, []);
  const total = allData.reduce((acc, cur) => acc + +cur.amount, 0);
  return [...allData, { title: "Total credits", amount: total }];
});

const calculationsBinded = computed(() => {
  return calculations.value.map((item) => {
    const borrowerTotal =
      borrowerDueBinded.value[borrowerDueBinded.value.length - 1].amount;
    const mortgageAndCreditsTotal =
      mortgageBinded.value[mortgageBinded.value.length - 1].amount +
      creditsBinded.value[creditsBinded.value.length - 1].amount;
    if (item.title === "Total Due From Borrowers") {
      item.amount = borrowerTotal;
    } else if (item.title === "Less Total Mortgage Loans and Total Credits") {
      item.amount = mortgageAndCreditsTotal;
    } else {
      item.amount = borrowerTotal - mortgageAndCreditsTotal;
    }
    return item;
  });
});
</script>
<template>
  <div class="qualifying-borrower">
    <v-card-title class="main__card-title">
      <h3 class="main__title table-header-text table-header-back">
        Details of Transaction
      </h3>
    </v-card-title>
    <v-expansion-panels class="panels mb-5">
      <v-card-text class="text-block">
        <BorrowerDue class="mb-1" :tableData="borrowerDueBinded" />
        <TotalMortgageLoans class="mb-1 light" :tableData="mortgageBinded" />
        <TotalCredits class="mb-1" :tableData="creditsBinded" />
        <Calculations class="mb-1" :tableData="calculationsBinded" />
      </v-card-text>
    </v-expansion-panels>
  </div>
</template>
<style lang="scss" scoped>
.main__card-title {
  margin: 30px;
  padding: 5px 15px !important;
  background-color: $content-headr-bg !important;
  h3 {
    line-height: 32px;
    color: $primary !important;
  }
}
.text-block {
  padding: 0 30px;
}
:deep(.v-expansion-panel-title){
  color: $primary !important;
}
.tablet {
  display: none;
}

@media (max-width: $desktop-width) {
  .desktop {
    display: none;
  }
  .tablet {
    display: block;
  }
}

@media (max-width: $sm-tablet-width) {
  .text-block {
    padding: 0;
  }
  .v-divider {
    margin-top: 15px;
  }
  .main__card-title {
    margin: 30px 0px !important;
  }
}
</style>
