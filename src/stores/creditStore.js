import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useGeneralStore } from '@/stores/generalStore'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import {
  getLoanCreditOrders,
  getLoanCreditOrderReportDetails,
  createCreditOrder
} from '@/api/creditScore'
import { useBorrowersStore } from '@/stores/borrowersStore'

export const useCreditStore = defineStore('creditStore', () => {
  const orders = ref(null)
  const creditOrderId = ref(null)
  const reportDetails = ref(null)
  const generalStore = useGeneralStore()
  const route = useRoute();
  const router = useRouter();
  const borrowerStore = useBorrowersStore()
  const isModalVisible = ref(false)
  const editingLiability = ref(null)
  const editingLiabilityIndex = ref(-1)
  const editingDerogatoryItem = ref(-1)
  const editingDerogatoryItemIndex = ref(-1)

  const getLoadedCreditOrders = () => orders.value

  const getCreditOrders = async (payload) => {
    const isNotRedirect = payload
    if (!generalStore.currentLoan || !generalStore.currentLoan.Id) {
      return route.name !== 'credit-order' && !isNotRedirect ? router.push('/credit/order') : true
    }
    try {
      const result = await getLoanCreditOrders(generalStore.currentLoan.Id)
      if (!result.data.Data) {
        setDefaultsOfCreditOrderData()
        return route.name !== 'credit-order' && !isNotRedirect
          ? router.push('/credit/order')
          : true
      }
      setCreditOrders(result.data.Data)
      const matched = result.data.Data.find((item) => {
        return (
          item.StatusCode === 'COMPLETED' &&
          (item.BorrowerId === borrowerStore.Borrower.Id ||
            (item.BorrowerId === borrowerStore.Borrower.LinkedBorrowerId &&
              borrowerStore.Borrower.CoBorrower))
        )
      })
      if (!matched) {
        setDefaultsOfCreditOrderData()
        if (route.fullPath !== '/credit/summary' && !isNotRedirect) {
          if (route.name !== 'credit-order') router.push('/credit/order')
        }
      } else {
        setCreditOrdersId(matched.Id)
        getOrderReportDetails(matched.Id)
        if ((route.fullPath === '/credit' || route.fullPath === '/credit/') && !isNotRedirect) {
          router.push('/credit/response')
        }
      }
    } catch (err) {
      console.log('err: ', err)
      if (err !== 'Invalid token') {
        toast.error('An error occurred while trying to get Credit scores. Please try again.')
      }
    }
  }

  const setDefaultsOfCreditOrderData = () => {
    setCreditOrders(null)
    setCreditOrdersId(undefined)
    setReportDetails(null)
  }

  const setCreditOrders = (payload) => {
    orders.value = payload
  }

  const setCreditOrdersId = (payload) => {
    creditOrderId.value = payload
  }

  const setReportDetails = (payload) => {
    reportDetails.value = payload
  }

  const getOrderReportDetails = async (payload) => {
    try {
      const result = await getLoanCreditOrderReportDetails(payload)
      setReportDetails(result.data.Data)
    } catch (err) {
      if (err !== 'Invalid token') {
        toast.error('An error occurred while trying to get Order Report Details. Please try again.')
      }
    }
  }

  const isVisible = computed(() => {
    return isModalVisible.value
  })

  const onToggle = (val) => {
    isModalVisible.value = val
  }

  const sendOrderRequest = async () => {
    try{
      let PrimaryBorrowerId = borrowerStore.Borrower.Id;
      let JointRequest = borrowerStore.Borrower.CoBorrower || false;
      if (borrowerStore.Borrower.CoBorrower) {
        const borrower = borrowerStore.Borrowers.find(
          (item) => item.LinkedBorrowerId === borrowerStore.Borrower.Id && !item.CoBorrower
        )
        PrimaryBorrowerId = borrower ? borrower.Id : PrimaryBorrowerId
      } else {
        JointRequest = !!borrowerStore.Borrowers.find(
          (item) => item.LinkedBorrowerId === PrimaryBorrowerId && item.CoBorrower
        )
      }
      const data = {
        LoanId: generalStore.currentLoan.Id,
        PrimaryBorrowerId,
        JointRequest
      }
      const result = await createCreditOrder(data)
      if (!result) {
        // return router.push("/credit/order");
      }
      setCreditOrdersId(result.data.Data.CreditOrderId)
      const currentBorrowerIndex = borrowerStore.currentBorrowerIndex
      await generalStore.getLoanById(generalStore.currentLoan.Id)
      borrowerStore.setCurrentBorrower(currentBorrowerIndex)
      getOrderReportDetails(result.data.Data.CreditOrderId)
      router.push('/credit/score-and-accounts-review')
    } catch (err) {
      if (err !== 'Invalid token') {
        toast.error('An error occurred while trying to set Order Request. Please try again.')
      }
    }
  }

  const getCreditOrderId = () => {
    return creditOrderId.value
  }
  const getCreditReportDetails = () => {
    return reportDetails.value
  }

  const setEditingLiability = (payload) => {
    if (payload) {
      const { liability, index } = payload
      editingLiability.value = liability
      editingLiabilityIndex.value = index
    } else {
      editingLiability.value = null
      editingLiabilityIndex.value = -1
    }
  }

  const setEditingDerogatoryItem = (payload) => {
    const { derogatoryItem, index } = payload
    editingDerogatoryItem.value = derogatoryItem
    editingDerogatoryItemIndex.value = index
  }
  return {
    orders,
    getLoadedCreditOrders,
    getCreditOrders,
    isVisible,
    onToggle,
    sendOrderRequest,
    getCreditOrderId,
    getCreditReportDetails,
    setEditingLiability,
    editingLiability,
    editingLiabilityIndex,
    setEditingDerogatoryItem,
    editingDerogatoryItem,
    editingDerogatoryItemIndex
  }
})
