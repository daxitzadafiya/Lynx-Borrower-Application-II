<script setup>
import { computed, onMounted, ref } from "vue";
import { debtToIncomeAndHousingRatios } from "@/mixins/debtToIncomeAndHousingRatios.js";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useRouter } from "vue-router";
import { useCreditStore } from "@/stores/creditStore";
import { useGeneralStore } from "@/stores/generalStore";
import DesktopQualifyingTable from "@/components/review/DesktopQualifyingTable.vue";
import TabletQualifyingTable from "@/components/review/TabletQualifyingTable.vue";
import MobileQualifyingTable from "@/components/review/MobileQualifyingTable.vue";

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const creditStore = useCreditStore();
const {
  getHousingIncome,
  getIncomeSum,
  getLiabilitiesSum,
} = debtToIncomeAndHousingRatios();
const router = useRouter();
const fields = ref({
  name: "",
  status: "Completed",
  fico: 0,
  assets: 0,
  income: 0,
  liabilities: 0,
  dti: 0,
  housing: 0,
  isInclude: true,
});

const notIncludeIndexes = ref([]);

const getAssetsSum = (borrower) => {
  let assets = borrower && borrower.Assets ? borrower.Assets : [];
  return getCalculatedAssetsAmount(assets);
};

const getCalculatedAssetsAmount = (assets) => {
  if (assets.length) {
    return assets.reduce(
      (acc, cur) =>
        (acc += !isNaN(cur.AssetCashOrMarketValueAmount)
          ? +cur.AssetCashOrMarketValueAmount
          : 0),
      0
    );
  }
  return 0;
};

const getTotalsRow = (arr) => {
  return arr.reduce(
    (acc, cur, index) => {
      if (notIncludeIndexes.value.indexOf(index) === -1) {
        const assets = acc.assets || 0;
        const income = acc.income || 0;
        const liabilities = acc.liabilities || 0;
        acc.fico = acc.fico ? (acc.fico > cur.fico ? cur.fico : acc.fico) : cur.fico;
        acc.assets = assets + (cur.isInclude ? cur.assets : 0);
        acc.income = income + (cur.isInclude ? cur.income : 0);
        acc.liabilities = liabilities + (cur.isInclude ? cur.liabilities : 0);
        acc.dti = acc.income ? +((acc.liabilities / acc.income) * 100).toFixed(2) : 0;
        acc.housing = acc.income ? getHousingIncome(acc.income) : 0;
      }
      return acc;
    },
    {
      name: "Totals:",
      fico: 0,
      assets: 0,
      income: 0,
      liabilities: 0,
      dti: 0,
      housing: 0,
    }
  );
};

const toggleInclude = ({ index }) => {
  const position = notIncludeIndexes.value.indexOf(index);
  if (position === -1) {
    notIncludeIndexes.value.push(index);
  } else {
    notIncludeIndexes.value.splice(position, 1);
  }
  setDebtToIncomeAndHousingRatios();
};

const setBorrowerAndRedirect = ({ index }) => {
  if (borrowersStore.Borrowers.length) {
    const borrowerIndex = borrowersStore.Borrowers.findIndex(
      (item) =>
        `${item.FirstName} ${item.LastName}` === bindedBorrowersData.value[index].name
    );
    borrowersStore.setCurrentBorrower(borrowerIndex);
    router.push("/borrowers/name");
  }
};

const getBorrowerScores = (borrower) => {
  if (creditStore.getCreditReportDetails()) {
    const details = JSON.parse(
      JSON.stringify(creditStore.getCreditReportDetails().ApplicantDetails)
    );
    const borrowerScores = details.find(
      (item) =>
        item.FirstName === borrower.FirstName && item.LastName === borrower.LastName
    );
    const scores = borrowerScores
      ? borrowerScores.CreditScores.sort((a, b) => (a.Source < b.Source ? -1 : 1))
      : [];
    return scores.length ? scores.map((item) => item.Score).sort()[1] : 0;
  }
  return 0;
};

const setDebtToIncomeAndHousingRatios = () => {
  if (borrowersStore.Borrowers.length) {
    const dataObj = borrowersStore.Borrowers.reduce((acc, cur, index) => {
      const isIncluded = notIncludeIndexes.value.indexOf(index) === -1;
      const income = acc.income || 0;
      const liabilities = acc.liabilities || 0;
      acc.income = income + (isIncluded ? getIncomeSum(cur) : 0);
      acc.liabilities = liabilities + (isIncluded ? getLiabilitiesSum(cur) : 0);
      return acc;
    }, {});
    if (dataObj.income) {
      const DebtToIncomeRatio = +(dataObj.liabilities / dataObj.income).toFixed(4);
      const HousingRatio = +(getHousingIncome(dataObj.income) / 100).toFixed(4);
      borrowersStore.setCurrentLoan({
        ...generalStore.currentLoan,
        DebtToIncomeRatio,
        HousingRatio,
      });
    } else {
      borrowersStore.setCurrentLoan({
        ...generalStore.currentLoan,
        DebtToIncomeRatio: 0,
        HousingRatio: 0,
      });
    }
  }
};

const bindedBorrowersData = computed(() => {
  const filtered = new Array(borrowersStore.Borrowers.length).fill(fields.value, 0);
  const binded = filtered.map((item, i) => {
    const name = `${borrowersStore.Borrowers[i].FirstName || ""} ${
      borrowersStore.Borrowers[i].LastName || ""
    }`;
    const fico = getBorrowerScores(borrowersStore.Borrowers[i]);
    const assets = getAssetsSum(borrowersStore.Borrowers[i]);
    const income = getIncomeSum(borrowersStore.Borrowers[i]);
    const liabilities = getLiabilitiesSum(borrowersStore.Borrowers[i]);
    const dti = income ? +((liabilities / income) * 100).toFixed(2) : 0;
    const housing = income ? getHousingIncome(income) : 0;
    return {
      ...item,
      name,
      fico,
      assets,
      income,
      liabilities,
      dti,
      housing,
    };
  });
  const totalsRow = getTotalsRow(binded);
  return [...binded, totalsRow];
});

onMounted(() => {
  setDebtToIncomeAndHousingRatios();
});
</script>
<template>
  <div class="qualifying-borrower">
    <v-card-title class="main__card-title qualifying-borrower-title">
      <h3 class="main__title table-header-text table-header-back">
        Qualifying the Borrower - Minimum Required Funds or Cash Back
      </h3>
    </v-card-title>
    <v-card-text class="text-block">
      <div class="desktop">
        <DesktopQualifyingTable
          :tableData="bindedBorrowersData"
          @toggleInclude="toggleInclude"
          @setBorrowerAndRedirect="setBorrowerAndRedirect"
        />
      </div>
      <div class="tablet">
        <TabletQualifyingTable
          :tableData="bindedBorrowersData"
          @toggleInclude="toggleInclude"
          @setBorrowerAndRedirect="setBorrowerAndRedirect"
        />
      </div>
      <div class="mobile">
        <MobileQualifyingTable
          :tableData="bindedBorrowersData"
          @toggleInclude="toggleInclude"
          @setBorrowerAndRedirect="setBorrowerAndRedirect"
        />
      </div>
    </v-card-text>
  </div>
</template>
<style lang="scss" scoped>
.text-block {
  padding: 0 30px;
}

.qualifying-borrower-title{
  margin: 30px;
  padding: 5px 15px !important;
  background-color: $content-headr-bg !important;
  h3{
    line-height: 32px;
    color: $primary !important;
    @media(max-width :$lg-mobile-width){
      line-height: 22px !important;
      white-space: normal !important;
    }
  }
}
.tablet,
.mobile {
  display: none;
}

@media (max-width: $desktop-width) {
  .desktop {
    display: none;
  }
  .tablet {
    display: block;
  }
  .qualifying-borrower-title{
    margin: 30px 25px;
  }
 
}

@media (max-width: $sm-tablet-width) {
  .tablet {
    display: none;
  }
  .mobile {
    display: block;
  }
  .text-block {
    padding: 0;
  }
  .v-divider {
    margin-top: 15px;
  }
  .qualifying-borrower-title{
    margin: 30px 0px;
  }
 
}
</style>
