import { defineStore } from 'pinia'
import { getLoan } from '@/api/getLoan'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify';

export const useCurrentLoanStore = defineStore('currentLoan', () => {
  const router = useRouter()

  const currentLoan = ref(null)

  const loanProgress = computed(() => {
    return currentLoan.LoanProgress
  })

  const currentBorrower = computed(() => {
    return currentLoan?.value?.Borrowers[0]
  })

  const currentSectionAndPageData = ref(null)

  const updateCurrentSectionAndPageData = () => {
    const { path } = router.currentRoute.value
    const cleanedPath = path.replace(/^\//, '')

    let filteredCurrentSectionAndPageData = {}
    loanProgress.value?.Sections?.forEach((section, sectionIndex) => {
      section.Pages.forEach((page, pageIndex) => {
        if (page.Route === cleanedPath) {
          filteredCurrentSectionAndPageData = {
            pageRoute: page.Route,
            sectionIndex,
            pageIndex
          }
        }
      })
    })

    currentSectionAndPageData.value = filteredCurrentSectionAndPageData
  }

  const saveLoan = (loan) => {
    currentLoan.value = loan
  }

  const getLoanById = async (id) => {
    try {
      const response = await getLoan(id)
      saveLoan(response.Data)
    } catch (error) {
      toast.error("An error occurred while trying to get loan by id. Please try again.");
    }
  }

  const getCurrentLoan = () => currentLoan.value;

  return {
    currentLoan,
    currentBorrower,
    currentSectionAndPageData,
    updateCurrentSectionAndPageData,
    loanProgress,
    getLoanById,
    getCurrentLoan
  }
})
