import { defineStore } from 'pinia'
import { useBorrowersStore } from '@/stores/borrowersStore'
import { ref } from 'vue'

export const useEmployMentStore = defineStore('useEmployMentStore', () => {
  const borrowersStore = useBorrowersStore();
  const additionalEmploymentIndex = ref(0)

    const getAdditionalEmployments = () => {
        return borrowersStore.getBorrowerEmployment().filter(
            item => item.EmploymentClassificationType === "Secondary"
        );
    }

    const getAdditionalEmploymentIndex = () => {
        return additionalEmploymentIndex.value
    }

  const setAdditionalEmploymentIndex = (payload) => {
    additionalEmploymentIndex.value = payload
  }

  const getOtherIncome = () => {
    return borrowersStore.Borrower && borrowersStore.Borrower.OtherIncome
      ? borrowersStore.Borrower.OtherIncome
      : []
  }

  return { getAdditionalEmployments, getAdditionalEmploymentIndex, setAdditionalEmploymentIndex, getOtherIncome }
})