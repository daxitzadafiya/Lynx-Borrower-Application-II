import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoanProducts } from '@/api/ratesAndOffers'
import { useGeneralStore } from '@/stores/generalStore'
import { toast } from 'vue3-toastify'

export const useRatesAndOffersStore = defineStore('ratesOffersStore', () => {
  const RatesOffers = ref(null)
  const filterProducts = ref({})
  const selectedProduct = ref(null)
  const generalStore = useGeneralStore()

  const getRatesOffers = () => {
    return RatesOffers.value
  }
  const getRateType = () => {
    return RatesOffers.value && RatesOffers.value.RateType ? RatesOffers.value.RateType : null
  }

  const getRepaymentTerms = () => {
    return RatesOffers.value && RatesOffers.value.RepaymentTerms
      ? RatesOffers.value.RepaymentTerms
      : []
  }

  const getMonthlyPayments = () => {
    return RatesOffers.value ? RatesOffers.value.MonthlyPayment : null
  }

  const getLoanProductsList = () => {
    return RatesOffers.value ? RatesOffers.value.LoanProductsData : []
  }

  const setRateType = (payload) => {
    if (RatesOffers.value && RatesOffers.value.RateType !== payload) {
      setRepaymentTerms(null)
    }
    updateRatesOffers({ prop: 'RateType', value: payload })
  }

  const setRepaymentTerms = (payload) => {
    updateRatesOffers({ prop: 'RepaymentTerms', value: payload })
  }

  const setMonthlyPayment = (payload) => {
    updateRatesOffers({ prop: 'MonthlyPayment', value: payload })
  }

  const setLoanProductsData = (payload) => {
    updateRatesOffers({ prop: 'LoanProductsData', value: payload })
  }

  const updateRatesOffers = (payload) => {
    let { prop, value } = payload
    let ratesOffers = {
      ...JSON.parse(JSON.stringify(RatesOffers.value)),
      [prop]: value
    }
    RatesOffers.value = {
      ...ratesOffers
    }
  }

  const getSelectedProduct = () => {
    return selectedProduct.value
  }

  const getLoanProductsData = async (payload) => {
    try {
      const origination = generalStore.currentLoan.Origination || {}
      let obj = {
        ...payload,
        emailAddress: origination.ContactPointEmailValue,
        pmiCompany: '-999',
        noMI: '0',
        ltv: generalStore.currentLoan.LoanToValueRatio,
        loan_amount: generalStore.currentLoan.LoanAmount,
        downPayment: generalStore.currentLoan.DownPaymentAmount,
        targetPrice: '-999',
        maxQuotes: 10
      }

      const propertyTypeMapping = {
        SingleFamilyDetached: '0',
        'Two-to-fourunitproperty': '1',
        'Co-operative': '4',
        'Manufactured/Mobile': '5',
        Condominium: '12',
        Townhouse: '15',
        Multifamily: '3'
      }

      const propertyType =
        propertyTypeMapping[generalStore.currentLoan?.Property?.PropertyType] || null
      if (propertyType) {
        obj.proptype = propertyType
      }

      const result = await getLoanProducts(obj)
      let data = []
      result.Data.Results.forEach((result) => {
        data.push(...result.Quote)
      })
      if (result !== 'Not found') {
        setLoanProductsData(data)
      } else {
        setLoanProductsData([])
      }
    } catch (err) {
      if (err !== 'Invalid token') {
        toast.error('An error occurred while get loan products. Please try again.')
        throw err
      }
    }
  }

  const setFilterProducts = ({ prop, value }) => {
    const { currentLoan } = generalStore
    const {
      LenderLoanInformation,
      Property
    } = currentLoan
    const { HousingExpenses } = LenderLoanInformation.MortgageLoanInformation || {}

    let filter = {}

    if (prop === 'insuranceTaxAndInsurance' && value) {
      filter = {
        ...filter,
        ...(Property && Property.PropertyDetail && Property.PropertyDetail.Taxes
          ? {
              taxes: Property.PropertyDetail.Taxes
            }
          : {}),
        insurance: HousingExpenses?.filter(
          (expense) =>
            expense.HousingExpenseTimingType === 'Proposed' &&
            expense.HousingExpenseType === 'HomeownersInsurance'
        ).reduce((sum, expense) => sum + expense.HousingExpensePaymentAmount, 0)
      }
    }

    if (prop === 'RepaymentTerm') {
      const keysToDelete = Object.keys(filterProducts.value).filter((key) =>
        key.startsWith('loanProduct')
      )

      for (const key of keysToDelete) {
        delete filterProducts.value[key]
      }

      if (value.length) {
        value.forEach((product, index) => {
          filter[`loanProduct${index + 1}`] = product
        })
      }
    }

    filterProducts.value = {
      ...filterProducts.value,
      ...filter
    }
  }

  const getFilterProducts = () => {
    return filterProducts.value
  }

  const setSelectedProduct = (payload) => {
    if(payload){
      if (payload.hasOwnProperty('isExpanded')) {
        delete payload.isExpanded;
      }
    }
    selectedProduct.value = payload
  }

  return {
    RatesOffers,
    getRatesOffers,
    getRateType,
    setRateType,
    setRepaymentTerms,
    setMonthlyPayment,
    getRepaymentTerms,
    getMonthlyPayments,
    getLoanProductsData,
    getSelectedProduct,
    setFilterProducts,
    getFilterProducts,
    setSelectedProduct,
    getLoanProductsList
  }
})
