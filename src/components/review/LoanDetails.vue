<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { computed, ref } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useTransactionDetailsStore } from "@/stores/transactionDetailsStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";

const realEstateStore = useRealEstateStore();
const transactionStore = useTransactionDetailsStore();
const loanPropertyStore = useLoanPropertyStore();

const details = ref([
  {
    title: "Homeowners Association Fees",
    value: 0,
    prop: "associationFees",
  },
  { title: "Mortgage Insurance", value: 0, prop: "mortgageInsurance" },
  { title: "Flood Insurance", value: 0, prop: "foodInsurance" },
  {
    title: "Homeowners Insurance",
    value: 0,
    prop: "homeOwnersInsurance",
  },
  { title: "Taxes", value: 0, prop: "taxes" },
  {
    title: "Principle and Interest",
    value: 0,
    prop: "principleAndInterest",
  },
]);

const getExpensesSum = (type) => {
  let result = 0;
  if (realEstateStore.getHousingExpenses().length) {
    result = realEstateStore.getHousingExpenses().reduce((acc, cur) => {
      if (
        cur.HousingExpenseTimingType === "Proposed" &&
        cur.HousingExpenseType === type &&
        !isNaN(cur.HousingExpensePaymentAmount)
      ) {
        acc += +cur.HousingExpensePaymentAmount;
      }
      return acc;
    }, 0);
  }
  return result;
};

const proposedMonthlyPayment = computed(() => {
  let result = 0;
  if (realEstateStore.getHousingExpenses().length) {
    result = realEstateStore.getHousingExpenses().reduce((acc, cur) => {
      if (
        cur.HousingExpenseTimingType === "Proposed" &&
        !isNaN(cur.HousingExpensePaymentAmount)
      ) {
        acc += +cur.HousingExpensePaymentAmount;
      }
      return acc;
    }, 0);
  }
  return result;
});

const loanProgramYears = computed(() => {
  const {
    LoanAmortizationPeriodCount = 0,
    AmortizationType = "",
  } = transactionStore.getMortgageLoanInformation();
  const years = LoanAmortizationPeriodCount ? LoanAmortizationPeriodCount / 12 : 0;
  return `${years} Years ${AmortizationType}`;
});

const loanProgramRate = computed(() => {
  const { NoteRatePercent = 0 } = transactionStore.getMortgageLoanInformation();
  return NoteRatePercent;
});

const associationFees = computed(() => {
  return getExpensesSum("HomeownersAssociationDuesAndCondominiumFees");
});
const mortgageInsurance = computed(() => {
  return getExpensesSum("MIPremium");
});
const foodInsurance = computed(() => {
  return getExpensesSum("SupplementalPropertyInsurance");
});
const homeOwnersInsurance = computed(() => {
  return getExpensesSum("HomeownersInsurance");
});
const taxes = computed(() => {
  return getExpensesSum("RealEstateTax");
});
const principleAndInterest = computed(() => {
  return getExpensesSum("FirstMortgagePrincipalAndInterest");
});

const apr = computed(() => {
  return loanPropertyStore.getApr();
});

const propMap = ref({
  associationFees,
  mortgageInsurance,
  foodInsurance,
  homeOwnersInsurance,
  taxes,
  principleAndInterest,
});
const bindedDetails = computed(() => {
  return details.value.map((item) => {
    item.value = propMap.value[item.prop];
    return item;
  });
});
</script>
<template>
  <v-card class="review-details" light flat>
    <v-card-title class="table-header-back review-details__title">
      <span class="review-details__title-text table-header-text">Loan Details</span>
    </v-card-title>
    <v-card-text class="text-block">
      <v-row class="text-block__row font-16">
        <v-col class="text-block__col" sm="7"> Proposed Monthly Payment </v-col>
        <v-col class="text-block__col right-aligned" sm="5">
          <span>$</span>
          <span>{{ getFormattedValue(proposedMonthlyPayment) || 0 }}</span>
        </v-col>
      </v-row>
      <v-row class="text-block__row primary-text pad-bot-2">
        <v-col class="v-col-6 order-1" sm="4"> Loan Program </v-col>
        <v-col class="center-sm-aligned left-aligned no-padding v-col-6 order-sm-2 order-3" sm="4">
          {{ loanProgramYears }}
        </v-col>
        <v-col class="right-sm-aligned right-aligned text-wrap v-col-6 order-sm-3 order-2" sm="4">
          {{
            (loanProgramRate / 100 || 0).toLocaleString("en-US", {
              style: "percent",
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            })
          }}
          Rate - {{ apr * 100 }} APR
        </v-col>
      </v-row>
      <v-row class="text-block__row data-row" v-for="(item, index) in bindedDetails" :key="index"
        :class="index % 2 === 0 ? 'table-row-colored' : 'table-row-odd-colored'">
        <v-col class="text-block__col" sm="8" cols="6">
          {{ item.title }}
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="text-block__col right-aligned" sm="3" cols="6">
          <span v-if="!item.isEmpty">$</span>
          <span>{{ getFormattedValue(item.value) || 0 }}</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>


<style lang="scss" scoped>

:deep(.review-details__title) {
  padding: 4px 16px !important;

  span {
    color: $primary !important;
    line-height: 32px !important;
    font-weight: 600 !important;
  }
}
.primary-text {
    color: $primary !important;
}
.text-wrap {
  text-wrap: wrap !important;
}

:deep(.right-aligned) {
  text-align: right !important;
  text-wrap: nowrap;
}

:deep(.center-aligned) {
  text-align: center !important;
}

:deep(.text-block) {
  margin-top: 20px !important;
}

:deep(.text-block__col) {
  color: #00000099 !important;

  span {
    color: #00000099 !important;
  }
}

@media (min-width: $tablet-width) {
  .no-padding {
    padding: 12px 0;
  }
}

@media (max-width: $sm-tablet-width) {
  .data-row {
    &:last-child {
      height: 50px;
    }
  }
}

@media (min-width: $lg-mobile-width) {
  .center-sm-aligned {
    text-align: center !important;
  }

  .right-sm-aligned {
    text-align: end !important;
  }
}
</style>
