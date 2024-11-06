import { defineStore } from 'pinia'
import { useTransactionDetailsStore } from '@/stores/transactionDetailsStore'
import { useBorrowersStore } from '@/stores/borrowersStore'
import { computed, ref } from 'vue'

export const useRealEstateStore = defineStore('realEstateStore', () => {
  const transactionStore = useTransactionDetailsStore()
  const borrowerStore = useBorrowersStore()
  const realEstateEditingIndex = ref(0)
  const editingMortgageLoan = ref(null)
  const editingMortgageLoanIndex = ref(0);
  const editingPropertyDetails = ref(null);
  const isModalVisible = ref(false)


  const getHousingExpenses = () => {
    return transactionStore.getMortgageLoanInformation() &&
      transactionStore.getMortgageLoanInformation().HousingExpenses
      ? transactionStore.getMortgageLoanInformation().HousingExpenses
      : []
  }

  const setRealEstateEditingIndex = (payload) => {
    realEstateEditingIndex.value = payload
  }

  const getRealEstate = () => {
    return borrowerStore.Borrower && borrowerStore.Borrower.RealEstate
      ? borrowerStore.Borrower.RealEstate
      : []
  }

  const getRealEstateEditingIndex = () => {
    return realEstateEditingIndex.value
  }

  const setRealEstate = (payload) => {
    borrowerStore.updateBorrower({ prop: 'RealEstate', value: payload })
  }

  const setMortgageLoan = (payload) => {
    const { prop, value, loanIndex } = payload
    const RealEstate = getRealEstate() ? Array.from(getRealEstate()) : []
    const currentRealEstate = RealEstate[realEstateEditingIndex.value] || {}
    let MortgageLoans = currentRealEstate.MortgageLoans || []
    MortgageLoans[loanIndex] = { ...MortgageLoans[loanIndex], [prop]: value }
    setEditingMortgageLoan(MortgageLoans[loanIndex])
    RealEstate[realEstateEditingIndex.value] = { ...currentRealEstate, MortgageLoans }
    setRealEstate(RealEstate)
  }

  const setEditingMortgageLoan = (payload) => {
    editingMortgageLoan.value = null
    editingMortgageLoan.value = payload
  }

  const setEditingMortgageLoanIndex = (payload) => {
    editingMortgageLoanIndex.value = payload
  }

  const setEditingMortgageLoanWithIndex = (payload) => {
    const { loan, loanIndex } = payload;
    setEditingMortgageLoan(loan);
    setEditingMortgageLoanIndex(loanIndex);
  }

  const getEditingMortgageLoan = () => {
    return editingMortgageLoan.value
  }

  const setEditingPropertyDetails = (payload) => {
    editingPropertyDetails.value = payload
  }

  const isVisible = computed(() => {
    return isModalVisible.value
  })

  const onToggle = (val) => {
    isModalVisible.value = val
  }

  const getEditingMortgageLoanIndex = () => {
    return editingMortgageLoanIndex.value
  }

  const getEditingPropertyDetails = () => {
    return editingPropertyDetails.value
  }
  return {
    getHousingExpenses,
    setRealEstateEditingIndex,
    getRealEstate,
    getRealEstateEditingIndex,
    setRealEstate,
    setMortgageLoan,
    setEditingMortgageLoan,
    getEditingMortgageLoan,
    setEditingPropertyDetails,
    setEditingMortgageLoanWithIndex,
    isVisible,
    onToggle,
    getEditingMortgageLoanIndex,
    getEditingPropertyDetails
  }
})
