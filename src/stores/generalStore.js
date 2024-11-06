import { defineStore } from 'pinia'
import { ref } from 'vue'
import objectsHandler from '@/helpers/objectsHandler'
import patchHelper from '@/helpers/patchHelper'
import { saveLoan, getLoan, underwritingResult, underwriteLoan, getLoanPatchesById } from '@/api/general'
import hostedModeHelper from '@/helpers/hostedModeHelper'
import { useBrandingStore } from './brandingStore'
import { useBorrowersStore } from './borrowersStore'
import { useLoanPropertyStore } from './loanPropertyStore'
import { useUserStore } from './userStore'
import progressModelHandler from '@/helpers/progressModelHandler'
import { loanStreamingService } from "@/services/LoanStreamingService";
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

export const useGeneralStore = defineStore('generalStore', () => {
  const showNavigation = ref(false)
  const showAnimatedNavigation = ref(false)
  const broadcast = ref(null)
  const isBroadcast = ref(false)
  const currentLoan = ref(null)
  const reportDetails = ref(null)
  const progressModelActive = ref(true)
  const serverLoan = ref(null)
  const progressModel = ref(null)
  const hostedToken = ref(null)
  const hostedLoanId = ref(null)
  const isTestingNav = ref(false)
  const isOnlay = ref(false);
  const onlayComponent = ref("");
  const currentSectionAndPageData = ref({})
  const currentSection = ref({}) 
  const currentPage = ref({}) 
  const currentRuleID = ref(-1) 
  const nextButtonConditionsOverridden = ref(false) 
  const appHistoryLength = ref(0);
  const requestCounter = ref(0);
  const brandingStore = useBrandingStore()
  const borrowersStore = useBorrowersStore()
  const loanPropertyStore = useLoanPropertyStore()
  const userStore = useUserStore()
  const underwriteMessage1 = ref(`If everything looks ok!<br> 
   Please click the button below to submit your loan for approval.`)
  const findingsMessages = ref("")
  const underwriteMessage2 = ref("")
  const router = useRouter();
  const getShowNavigation = () => showNavigation.value
  const getshowAnimatedNavigation = () => showAnimatedNavigation.value
  const loanPatches = ref(null)
  const saveLoanPatches = async () => {
    try {
      if (serverLoan.value && serverLoan.value.Id) {
        const clonedAndCleared = objectsHandler.cleanObj(objectsHandler.clone(currentLoan.value))
        const loanPatches = patchHelper.createJsonPatch(serverLoan.value, clonedAndCleared)
        if (loanPatches.length) {
          try {
            await saveLoan(loanPatches, serverLoan.value.Id)
            serverLoan.value = clonedAndCleared
            if (brandingStore.isHostedMode) {
              const headerData = await hostedModeHelper.getHostingHeaderData(currentLoan.value)
              parent.postMessage(headerData, '*')
            }
          } catch (error) {
            toast.error('An error occurred while trying to save loan patches. Please try again.')
          } finally {
          }
        }
      }
    } catch (err) {
      if (err !== 'Invalid token') {
        toast.error('Internal Server Error')
      }
    }
  }

  const setInitialData = (payload) => {
    serverLoan.value = payload
    const clonedLoan = payload && payload.Id ? JSON.parse(JSON.stringify(payload)) : null
    currentLoan.value = clonedLoan
    const Borrowers =
      serverLoan.value && serverLoan.value.Borrowers ? serverLoan.value.Borrowers : null
    borrowersStore.setInitialBorrowers(Borrowers)
    loanPropertyStore.setInitialLoanAndProperty(payload)
  }

  const getLoanById = async (payload) => {
    try {
      const loan = await getLoan(payload)
      setInitialData(loan.data.Data)
      if (userStore.currentUser.userTypeId != 1) {
        if (loan.data.Data.StatusId > 7) {
          underwrite(true)
        }
      }
      loanStreamingService.unSubscribeAndSubscribe(loan.data.Data.Id);

      if (brandingStore.isHostedMode) {
        const headerData = await hostedModeHelper.getHostingHeaderData(currentLoan.value)
        parent.postMessage(headerData, '*')
      }
      updateSectionAndPageData(window.location.pathname);
      
    } catch (err) {
      if (err !== 'Invalid token') {
        toast.error('An error occurred while trying to get loan details. Please try again.')
      }
    } finally {
    }
  }

  const setHostedData = (payload) => {
    const { token, loanId, isHostedMode } = payload
    hostedToken.value = payload
    brandingStore.setIsHostedMode(isHostedMode)
    hostedLoanId.value = loanId
  }

  const getIsTestingNav = () => isTestingNav.value

  const setShowNavigation = (payload) => (showNavigation.value = payload);

  const setShowAnimatedNavigation = (payload) => (showAnimatedNavigation.value = payload);

  const getCurrentLoan = () => currentLoan.value

  const setBroadcast = (payload) => {
    broadcast.value = payload ? new BroadcastChannel(payload) : null
    if (broadcast.value) {
      broadcast.value.onmessage = message =>{
        if (message.data.type === 'setLoan') {
          currentLoan.value = message.data.loan
        } else if (message.data === 'getLoan') {
          isBroadcast.value = true
          broadcast.value.postMessage({
            type: 'setLoan',
            loan: JSON.parse(JSON.stringify(currentLoan.value))
          })
        } else if (message.data.type === 'setProgressModel') {
          isBroadcast.value = true
          progressModelHandler.setCurrentProgressModel(message.data.progressModel)
        } else if (message.data.type === 'setProgressModelFromLoanTech') {
          progressModel.value = message.data.progressModel
        } else if (message.data === 'close') {
          isBroadcast.value = false
          if (broadcast.value) broadcast.value.close()
            broadcast.value = null
        }
      }
    }
  }

  const toggleIsOnlay = (payload) => {
    isOnlay.value = payload.isOnlay
    onlayComponent.value = payload.onlayComponent || ""
  }

  const setCurrentSections = (payload)=> (currentSection.value = payload);
  const setCurrentSectionAndPageData = (payload)=> (currentSectionAndPageData.value = payload);
  const setCurrentRuleId = (payload)=> (currentRuleID.value = payload);
  const setCurrentPage = (payload)=> (currentPage.value = payload);
  const setNextButtonsConditionsOverridden = (payload)=> (nextButtonConditionsOverridden.value = payload);

  const updateSectionAndPageData = (payload) => {
    let curPath = payload?.replace(/^\/|\/$/g, "");
    if (currentLoan.value != null && currentLoan.value.LoanProgress != null) {
      for (var index = 0; index < currentLoan.value.LoanProgress.Sections.length; index++) {
        let section = currentLoan.value.LoanProgress.Sections[index];
        let pageIndex = section.Pages.findIndex(x => x.Route === curPath);
        if (pageIndex != -1) {
          setCurrentSectionAndPageData({
            Section: section,
            PageIndex: pageIndex,
            SectionIndex: index
          })
          setCurrentSections(section)
          setCurrentPage(section.Pages[pageIndex])
          setCurrentRuleId(section.Pages[pageIndex].RuleId)
          setNextButtonsConditionsOverridden(section.Pages[pageIndex].RuleId === 2 || section.Pages[pageIndex].RuleId === 4)
          return;
        }
      }
    }
    setCurrentSections({})
    setCurrentPage({})
    setCurrentRuleId({})
    setNextButtonsConditionsOverridden(false)
  }

  const setAppHistoryLength = (payload) => (appHistoryLength.value = payload)
  const getAppHistoryLength = () => appHistoryLength.value
  const increaseRequestCount = () => {
     requestCounter.value++
  }
  const decreaseRequestCount = () => {
    requestCounter.value--
    if (requestCounter.value < 0) {
      requestCounter.value = 0;
    }
  }

  const setUnderwriteMessage1 = (payload) => {
    underwriteMessage1.value = payload;
  }

  const getUnderwriteMessage1 = () => {
    return underwriteMessage1.value
  }

  const setUnderwriteMessage2 = (payload) => {
    underwriteMessage2.value = payload;
  }

  const getUnderwriteMessage2 = () => {
    return underwriteMessage2.value
  }

  const setFindingsMessages = (payload) => {
    findingsMessages.value = payload;
  }

  const getFindingsMessages = () => {
    return findingsMessages.value
  }

  const setLoanStatusId = (payload) => {
    borrowersStore.setCurrentLoan({
      ...currentLoan.value,
      StatusId: payload
    })
  }

  const underwrite = async (getResultOnly) => {
    if (!currentLoan.value.Id) return;
    // setMagicSpinner(true)
    try {
      let result = null;
      if (getResultOnly === true) {
        result = await underwritingResult(currentLoan.value.Id);
      } else {
        result = await underwriteLoan(currentLoan.value.Id);
      }
      if (result.StatusId === 1) {
        setUnderwriteMessage1(result.Message1);
        setFindingsMessages(result.FindingsMessages)
        setUnderwriteMessage2(result.Message2)
        if (result.NewLoanStatusId) {
          setLoanStatusId(result.NewLoanStatusId)
        }
        if (router.currentRoute.path !== "/approved") {
          router.push("/approved");
        }
      } else {
        var splitErrorResponse = result.Message1.split("\r\n");
        setUnderwriteMessage1(splitErrorResponse[0]);
        if (splitErrorResponse.length >= 2) {
          setUnderwriteMessage2(splitErrorResponse[1])

        } else {
          setUnderwriteMessage2("")

        }
        if (router.currentRoute.path !== "/error") {
          router.push("/error");
        }
      }
    } catch (err) {
      
      if (err !== "Invalid token") {
        toast.error('Internal Server Error')
      }
    } finally {
      // setMagicSpinner(false)
    }
  }

  const applyPatchesFromStream = (payload) => {
    let CurrentLoan = JSON.parse(JSON.stringify(currentLoan.value));
    let clonedAndCleared = objectsHandler.cleanObj(
      objectsHandler.clone(CurrentLoan)
    );
    patchHelper.applyJsonPatch(clonedAndCleared, payload);
    borrowersStore.setCurrentLoan(clonedAndCleared),
    setServerLoan(JSON.parse(JSON.stringify(clonedAndCleared)));
    const Borrowers = clonedAndCleared.Borrowers || null;
    borrowersStore.setInitialBorrowers(Borrowers)
    loanPropertyStore.setInitialLoanAndProperty(clonedAndCleared)
    if (isBroadcast.value) {
      broadcast.value.postMessage({ type: 'setLoan', loan: clonedAndCleared });
    }
  }

  const setServerLoan = (payload) => {
    serverLoan.value = payload;
  }

  const getCurrentLoanPatches = () => {
    return loanPatches.value
  }

  const getPatchesById = async (payload) => {
    try {
      const patches = await getLoanPatchesById(payload);
      setLoanPatches(patches)
    } catch (err) {
      console.log(err);
    }
  }

  const setLoanPatches = (payload) => {
    loanPatches.value = payload;
  }

  const setProgressModel = (payload) => {
    const obj = JSON.stringify(payload);
    progressModel.value = obj;
  }

  const toggleTestingNav = () => {
    isTestingNav.value = !isTestingNav.value;
  }

  const toggleProgressModelActive = () => {
    progressModelActive.value = !progressModelActive.value;
  }
  return {
    getShowNavigation,
    serverLoan,
    broadcast,
    isBroadcast,
    hostedToken,
    currentLoan,
    progressModelActive,
    reportDetails,
    progressModel,
    loanPatches,
    currentSectionAndPageData,
    currentSection,
    currentPage,
    currentRuleID,
    nextButtonConditionsOverridden,
    requestCounter,
    saveLoanPatches,
    setHostedData,
    getIsTestingNav,
    setShowNavigation,
    getLoanById,
    getCurrentLoan,
    setBroadcast,
    toggleIsOnlay,
    setInitialData,
    getshowAnimatedNavigation,
    setShowAnimatedNavigation,
    setCurrentSections,
    setCurrentSectionAndPageData,
    updateSectionAndPageData,
    getAppHistoryLength,
    setAppHistoryLength,
    increaseRequestCount,
    decreaseRequestCount,
    onlayComponent,
    setUnderwriteMessage1,
    setFindingsMessages,
    underwrite,
    getUnderwriteMessage1,
    getUnderwriteMessage2,
    getFindingsMessages,
    applyPatchesFromStream,
    getCurrentLoanPatches,
    getPatchesById,
    setProgressModel,
    toggleTestingNav,
    toggleProgressModelActive
  }
})
