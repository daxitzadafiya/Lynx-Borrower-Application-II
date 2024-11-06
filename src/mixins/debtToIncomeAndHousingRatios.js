import { useBorrowersStore } from '@/stores/borrowersStore'
import { useGeneralStore } from '@/stores/generalStore'
import { useRealEstateStore } from '@/stores/realEstateStore'

export function debtToIncomeAndHousingRatios() {
  const borrowersStore = useBorrowersStore()
  const generalStore = useGeneralStore()
  const realEstateStore = useRealEstateStore()

  const setDebtToIncomeAndHousingRatios = () => {
    if (borrowersStore.Borrowers.length) {
      const dataObj = borrowersStore.Borrowers.reduce((acc, cur) => {
        const income = acc.income || 0
        const liabilities = acc.liabilities || 0
        acc.income = income + getIncomeSum(cur)
        acc.liabilities = liabilities + getLiabilitiesSum(cur)
        return acc
      }, {})
      if (dataObj.income) {
        const DebtToIncomeRatio = +(dataObj.liabilities / dataObj.income).toFixed(4)
        const HousingRatio = +(getHousingIncome(dataObj.income) / 100).toFixed(4)
        borrowersStore.setCurrentLoan({
          ...generalStore.currentLoan,
          DebtToIncomeRatio,
          HousingRatio
        })
      }
    } else {
      borrowersStore.setCurrentLoan({
        ...generalStore.currentLoan,
        DebtToIncomeRatio: 0,
        HousingRatio: 0
      })
    }
  }

  const getIncomeSum = (borrower) => {
    let employment = borrower && borrower.Employment ? borrower.Employment : []
    let otherIncome = borrower && borrower.OtherIncome ? borrower.OtherIncome : []
    return getCalculatedIncome(employment, otherIncome)
  }

  const getHousingIncome = (income) => {
    const expenses = realEstateStore.getHousingExpenses().length
      ? realEstateStore.getHousingExpenses().reduce((acc, cur) => {
          if (cur.HousingExpenseTimingType === 'Proposed') {
            acc += +cur.HousingExpensePaymentAmount
          }
          return acc
        }, 0)
      : 0
    return +((expenses / income) * 100).toFixed(2)
  }

  const getCalculatedIncome = (employment, otherIncome) => {
    const income = employment.length
      ? employment.reduce((acc, cur) => {
          if (cur.Income && cur.EmploymentStatusType === 'Current') {
            return [...acc, ...cur.Income]
          }
          return acc
        }, [])
      : []
    const monthlyincomeorloss = employment.length
      ? employment.reduce(
          (acc, cur) =>
            (acc += !isNaN(cur.EmploymentMonthlyIncomeAmount)
              ? +cur.EmploymentMonthlyIncomeAmount
              : 0),
          0
        )
      : 0
    const incomeSum = income.length
      ? income.reduce(
          (acc, cur) =>
            (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
              ? +cur.CurrentIncomeMonthlyTotalAmount
              : 0),
          0
        )
      : 0
    const otherIncomeSum = otherIncome.length
      ? otherIncome.reduce(
          (acc, cur) =>
            (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
              ? +cur.CurrentIncomeMonthlyTotalAmount
              : 0),
          0
        )
      : 0
    const otherIncomeMonthlyincomeorloss = otherIncome.length
      ? otherIncome.reduce(
          (acc, cur) =>
            (acc += !isNaN(cur.EmploymentMonthlyIncomeAmount)
              ? +cur.EmploymentMonthlyIncomeAmount
              : 0),
          0
        )
      : 0
    return incomeSum + otherIncomeSum + monthlyincomeorloss + otherIncomeMonthlyincomeorloss
  }

  const getLiabilitiesSum = (borrower) => {
    let liabilities = borrower && borrower.Liabilities ? borrower.Liabilities : []
    return liabilities.length
      ? liabilities.reduce(
          (acc, cur) =>
            (acc += !isNaN(cur.LiabilityMonthlyPaymentAmount)
              ? +cur.LiabilityMonthlyPaymentAmount
              : 0),
          0
        )
      : 0
  }
  return { setDebtToIncomeAndHousingRatios, getIncomeSum, getLiabilitiesSum, getHousingIncome }
}
