import { useGeneralStore } from "../stores/generalStore";

const fields = {
  name: "",
  status: "Completed",
  fico: 0,
  assets: 0,
  income: 0,
  liabilities: 0,
  dti: 0,
  housing: 0,
  isInclude: true
};

async function getTableData() {
  const generalStore = useGeneralStore();
  const { reportDetails, housingExpenses, currentLoan } = generalStore;
  return getDetailsData(currentLoan, reportDetails, housingExpenses);
}

function getDetailsData(currentLoan, reportDetails, housingExpenses) {
  const { Borrowers: borrowers } = currentLoan;
  const filtered = new Array(borrowers.length).fill(fields, 0);
  const binded = filtered.map((item, i) => {
    const name = `${borrowers[i].FirstName || ""} ${borrowers[i].LastName ||
      ""}`;
    const fico = getBorrowerScores(borrowers[i], reportDetails);
    const assets = getAssetsSum(borrowers[i]);
    const income = getIncomeSum(borrowers[i]);
    const liabilities = getLiabilitiesSum(borrowers[i]);
    const dti = income ? +((liabilities / income) * 100).toFixed(2) : 0;
    const housing = income ? getHousingIncome(income, housingExpenses) : 0;
    return { ...item, name, fico, assets, income, liabilities, dti, housing };
  });
  const totalsRow = getTotalsRow(binded, housingExpenses);
  return [...binded, totalsRow];
}

function getBorrowerScores(borrower, reportDetails) {
  if (reportDetails) {
    const details = JSON.parse(JSON.stringify(reportDetails.ApplicantDetails));
    const borrowerScores = details.find(
      item =>
        item.FirstName === borrower.FirstName &&
        item.LastName === borrower.LastName
    );
    const scores = borrowerScores
      ? borrowerScores.CreditScores.sort((a, b) =>
          a.Source < b.Source ? -1 : 1
        )
      : [];
    return scores.length ? scores.map(item => item.Score).sort()[1] : 0;
  }
  return 0;
}

function getAssetsSum(borrower) {
  let assets = borrower && borrower.Assets ? borrower.Assets : [];
  return getCalculatedAssetsAmount(assets);
}

function getCalculatedAssetsAmount(assets) {
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
}

function getHousingIncome(income, housingExpenses) {
  if (!housingExpenses) return 0;
  const expenses = housingExpenses.length
    ? housingExpenses.reduce((acc, cur) => {
        if (cur.HousingExpenseTimingType === "Proposed") {
          acc += +cur.HousingExpensePaymentAmount;
        }
        return acc;
      }, 0)
    : 0;
  return +((expenses / income) * 100).toFixed(2);
}

function getIncomeSum(borrower) {
  let employment = borrower && borrower.Employment ? borrower.Employment : [];
  let otherIncome =
    borrower && borrower.OtherIncome ? borrower.OtherIncome : [];
  return getCalculatedIncome(employment, otherIncome);
}

function getCalculatedIncome(employment, otherIncome) {
  const income = employment.length
    ? employment.reduce((acc, cur) => {
        if (cur.Income && cur.EmploymentStatusType === "Current") {
          return [...acc, ...cur.Income];
        }
        return acc;
      }, [])
    : [];
  const incomeSum = income.length
    ? income.reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
            ? +cur.CurrentIncomeMonthlyTotalAmount
            : 0),
        0
      )
    : 0;
  const otherIncomeSum = otherIncome.length
    ? otherIncome.reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
            ? +cur.CurrentIncomeMonthlyTotalAmount
            : 0),
        0
      )
    : 0;
  return incomeSum + otherIncomeSum;
}

function getLiabilitiesSum(borrower) {
  let liabilities =
    borrower && borrower.Liabilities ? borrower.Liabilities : [];
  return liabilities.length
    ? liabilities.reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.LiabilityMonthlyPaymentAmount)
            ? +cur.LiabilityMonthlyPaymentAmount
            : 0),
        0
      )
    : 0;
}

function getTotalsRow(arr, housingExpenses) {
  return arr.reduce(
    (acc, cur) => {
      const assets = acc.assets || 0;
      const income = acc.income || 0;
      const liabilities = acc.liabilities || 0;
      acc.fico = acc.fico
        ? acc.fico > cur.fico
          ? cur.fico
          : acc.fico
        : cur.fico;
      acc.assets = assets + (cur.isInclude ? cur.assets : 0);
      acc.income = income + (cur.isInclude ? cur.income : 0);
      acc.liabilities = liabilities + (cur.isInclude ? cur.liabilities : 0);
      acc.dti = acc.income
        ? +((acc.liabilities / acc.income) * 100).toFixed(2)
        : 0;
      acc.housing = acc.income
        ? getHousingIncome(acc.income, housingExpenses)
        : 0;
      return acc;
    },
    {
      name: "Totals:",
      fico: 0,
      assets: 0,
      income: 0,
      liabilities: 0,
      dti: 0,
      housing: 0
    }
  );
}

export const handleRouting = (sections, route, next) => {
  const routeBase = route.split("-")[0];
  const sectionIndex = sections.findIndex(
    item => item.Name.toLowerCase() === routeBase
  );
  if (sections[sectionIndex] && sections[sectionIndex].Enable) {
    return next();
  }
  const enabledSection = sections.slice(sectionIndex).find(item => item.Enable);
  return enabledSection
    ? next({ name: enabledSection.Name.toLowerCase() })
    : false;
};

export default {
  async getHostingHeaderData(loan) {
    const {
      Property: property,
      LoanPurposeType: purpose,
      LenderLoanInformation,
      LoanAmount: loanAmount,
      DebtToIncomeRatio: debtToIncome,
      EstimatedClosingDate: date
    } = loan;

    const interestRate =
      LenderLoanInformation && LenderLoanInformation.MortgageLoanInformation
        ? LenderLoanInformation.MortgageLoanInformation.NoteRatePercent
        : "";

    const loanDetailsTableData = await getTableData();

    return {
      property,
      purpose,
      loanAmount,
      interestRate,
      debtToIncome,
      date,
      loanDetailsTableData
    };
  }
};
