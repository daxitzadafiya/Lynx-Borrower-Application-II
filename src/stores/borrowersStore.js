import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import progressModelHandler from '@/helpers/progressModelHandler'
import { useGeneralStore } from './generalStore'
import { getLoanInvitations } from '@/api/borrowers'
import { toast } from 'vue3-toastify';
import countries from "@/helpers/countries";
import states from "@/helpers/states";
import objectsHandler from '../helpers/objectsHandler'
import { useUserStore } from './userStore'
import { sendInvitation, resendLoanInvitation, cancelLoanInvitation } from '@/api/borrowers'

export const useBorrowersStore = defineStore('borrowersStore', () => {
  const Borrowers = ref([])
  const Borrower = ref({})
  const currentBorrowerIndex = ref(0)
  const invitations = ref([])
  const realEstateOwned = ref(false)
  const realEstateOwnedExpenses = ref(false)
  const realEstateOwnedMortgage = ref(false)
  const generalStore = useGeneralStore()
  const isModalVisible = ref(false)
  const autoCompleteAddress = ref(null);
  const userStore = useUserStore();

  const getDependents = () => {
    return Borrower.value && Borrower.value.Dependents
      ? Borrower.value.Dependents
      : { Count: 0, Ages: [] }
  }

  const getBorrowerEmployment = () =>
    Borrower.value && Borrower.value.Employment ? Borrower.value.Employment : []

  const getMilitaryServices = () => {
    return Borrower.value && Borrower.value.MilitaryServices ? Borrower.value.MilitaryServices : []
  }

  const getResidences = () => {
    return Borrower.value.Residences ? Borrower.value.Residences : []
  }

  const getSpecificResidence = (type) => {
    return (
      Borrower.value.Residences?.find((item) => item && item.BorrowerResidencyType === type) || {}
    )
  }

  const setInitialBorrowers = (payload) => {
    if (payload) {
      Borrowers.value = [...payload]
    } else {
      Borrowers.value = [{ Id: 1 }]
    }
    setCurrentBorrowerIndex(0)
  }

  const setCurrentBorrowerIndex = (payload) => {
    const index = payload !== undefined ? payload : currentBorrowerIndex.value
    Borrower.value = JSON.parse(JSON.stringify(Borrowers.value[index]))
    currentBorrowerIndex.value = index
  }

  const setCurrentBorrower = (payload) => {
    setCurrentBorrowerIndex(payload)
    // dispatch("updateCurrentLoan");
    const progressModel = localStorage.getItem('progressModel')
    if (progressModel) {
      const routeName = progressModelHandler.getRouteName(
        JSON.parse(progressModel),
        Borrower.value.Id
      )
      if (routeName && routeName !== router.history.current.name) router.push({ name: routeName })
    }
  }

  const updateCurrentLoan = () => {
    if (!generalStore.currentLoan) return
    const currentLoans = { ...generalStore.currentLoan, Borrowers: Borrowers.value }
    setCurrentLoan(objectsHandler.cleanObj(objectsHandler.clone(currentLoans)))
    if (generalStore.isBroadcast) {
      generalStore.setBroadcast(111);
      generalStore.broadcast.postMessage({ type: 'setLoan', loan: JSON.parse(JSON.stringify(generalStore.currentLoan)) })
    }
  }

  const setBroadcast = (state, payload) => {
    generalStore.broadcast = payload ? new BroadcastChannel(payload) : null;
    if (generalStore.broadcast) {
      generalStore.broadcast.onmessage = message => {
        if (message.data.type === "setLoan") {
          generalStore.currentLoan = message.data.loan;
        } else if (message.data === "getLoan") {
          generalStore.isBroadcast = true;
          generalStore.broadcast.postMessage({
            type: "setLoan",
            loan: generalStore.currentLoan
          });
        } else if (message.data.type === "setProgressModel") {
          state.isBroadcast = true;
          progressModelHandler.setCurrentProgressModel(
            message.data.progressModel
          );
        } else if (message.data.type === "setProgressModelFromLoanTech") {
          state.progressModel = message.data.progressModel;
        } else if (message.data === "close") {
          generalStore.isBroadcast = false;
          if (generalStore.broadcast) generalStore.broadcast.close();
          generalStore.broadcast = null;
        }
      };
    }
  };

  const setCurrentLoan = (payload) => {
    generalStore.currentLoan = payload
    if (generalStore.isBroadcast) {
      generalStore.broadcast.postMessage({
        type: 'setLoan',
        loan: JSON.parse(JSON.stringify(generalStore.currentLoan))
      })
    }
  }
  const setInvitations = (payload) => {
    invitations.value = payload
  }
  const getInvitations = async () => {
    try {
      if (!generalStore.currentLoan || !generalStore.currentLoan.Id) return
      const loanId = generalStore.currentLoan.Id
      if (loanId) {
        const result = await getLoanInvitations(loanId)
        if (result !== 'Not found') {
          setInvitations(result.data.Data.filter((x) => x.Status === '0'))
        } else {
          setInvitations([])
        }
      }
    } catch (err) {
      if (err !== 'Invalid token') {
        toast.error("An error occurred while trying to get Invitations. Please try again.");
      }
    } finally {
    }
  }

  const isVisible = computed(() => {
    return isModalVisible.value
  })

  const onToggle = (val) => {
    isModalVisible.value = val
  }

  const getBorrower = () => Borrower.value;

  const updateResidenceProp = (payload) => {
    let { type, prop, value } = payload;
    if (prop === "CountryCode") {
      value = countries.getCountryShortName(value);
    }
    let Residences = Borrower.value.Residences
      ? Array.from(Borrower.value.Residences)
      : [];
    const residencyType = Residences.find(
      item => item && item.BorrowerResidencyType === type
    );
    if (!residencyType) {
      Residences = [
        ...Residences,
        { BorrowerResidencyType: type, [prop]: value }
      ];
    } else {
      Residences = Residences.map(item => {
        if (item.BorrowerResidencyType === type) {
          if (value) {
            item = { ...item, [prop]: value };
          } else {
            delete item[prop];
          }
        }
        return item;
      });
    }
    Residences = Residences.filter(item => Object.keys(item).length > 1);
    Borrower.value = { ...Borrower.value, Residences };
    if (type === "Current" && prop === "StateCode") {
      const CommunityPropertyStateResidentIndicator = states.getStateIndicator(
        value.StateCode,
        "CommunityProperty"
      );
      Borrower.value = {
        ...Borrower.value,
        CommunityPropertyStateResidentIndicator
      };
    }
    Borrowers.value = [
      ...Borrowers.value.map(item =>
        item.Id !== Borrower.value.Id ? item : { ...item, ...Borrower.value }
        )
      ];
    updateCurrentLoan()
  }

  const updateBorrower = (payload) => {
    if (Array.isArray(payload)) {
      let borrower = {
        ...JSON.parse(JSON.stringify(Borrower.value))
      };
      for (var i = 0; i < payload.length; i++) {
        if (payload[i].prop.indexOf("Phone") !== -1 && payload[i].value) {
          payload[i].value = payload[i].value.replace(/[()]|-| /g, "");
        }
        borrower[payload[i].prop] = payload[i].value;
        if (
          payload[i].prop === "CitizenshipResidencyType" &&
          payload[i].value === "USCitizen"
        ) {
          delete borrower.VisaType;
        }
      }
      Borrower.value = { ...borrower }
    } else {
      let { prop, value } = payload;
      if (prop.indexOf("Phone") !== -1) {
        value = value.replace(/[()]|-| /g, "");
      }
      let borrower = {
        ...JSON.parse(JSON.stringify(Borrower.value)),
        [prop]: value
      };
      if (prop === "CitizenshipResidencyType" && value === "USCitizen") {
        delete borrower.VisaType;
      }
      Borrower.value = { ...borrower }
      Borrowers.value = [
        ...Borrowers.value.map(item => item.Id != Borrower.value.Id ? item : { ...item, ...Borrower.value })
      ]
    }
    updateCurrentLoan()
  }

  const updateDependents = (payload) => {
    const { prop, value } = payload;
    let Dependents = Borrower.value.Dependents
      ? JSON.parse(JSON.stringify(Borrower.value.Dependents))
      : {};
    if (prop === "Count" && !value) {
      Dependents = { Count: 0, Ages: [] };
    } else {
      Dependents[prop] = value;
    }
    Borrower.value = { ...Borrower.value, Dependents };
    Borrowers.value = [
      ...Borrowers.value.map(item =>
        item.Id !== Borrower.value.Id ? item : { ...item, ...Borrower.value }
      )
    ];
    updateCurrentLoan()

  }
  
  const updateMilitary = (payload) =>{
    Borrower.value = {...Borrower.value,MilitaryServices:[...payload]};
    Borrowers.value = [...Borrowers.value.map(item=>item.Id !== Borrower.value.Id ? item : { ...item, ...Borrower.value })]
    updateCurrentLoan()
  }

  const updateResidence = (payload) => {
  const { type, value } = payload;
    let Residences = Borrower.value.Residences
    ? Array.from(Borrower.value.Residences)
    : [];
  let residencyType = Residences.find(
    item => item && item.BorrowerResidencyType === type
  );
  if (!residencyType) {
    Residences = [...Residences, { BorrowerResidencyType: type, ...value }];
  } else {
    residencyType = { ...residencyType, ...value };
    Residences = Residences.filter(item => item.BorrowerResidencyType !== type);
    Residences = [
      ...Residences,
      { BorrowerResidencyType: type, ...residencyType }
    ];
  }
  Borrower.value = { ...Borrower.value, Residences };
  if (type === "Current" && value.StateCode) {
    const CommunityPropertyStateResidentIndicator = states.getStateIndicator(
      value.StateCode,
      "CommunityProperty"
    );
    Borrower.value = {
      ...Borrower.value,
      CommunityPropertyStateResidentIndicator
    };
  }
  Borrowers.value = [
    ...Borrowers.value.map(item =>
      item.Id !== Borrower.value.Id ? item : { ...item, ...Borrower.value }
    )
  ];
  updateCurrentLoan()
  }

  const removeResidence = (payload) => {
    let Residences = Borrower.value.Residences ? Array.from(Borrower.value.Residences)
      : [];
    if (Residences.length) {
      Residences = Residences.filter(
        item => item.BorrowerResidencyType !== payload
        );
      Borrower.value = { ...Borrower.value, Residences };
      Borrowers.value = [
        ...Borrowers.value.map(item =>
          item.Id !== Borrower.value.Id ? item : { ...item, ...Borrower.value }
          )
        ];
      }
    updateCurrentLoan()
  } 

  const setInitialMailingResidence = (payload) => {
    const type = payload || "Current";
    let Residences = Borrower.value.Residences
      ? Array.from(Borrower.value.Residences)
      : [];
    const mailingResidence = Residences.find(
      item => item && item.BorrowerResidencyType === "Mailing"
    );
    const donorResidence = Residences.find(
      item => item && item.BorrowerResidencyType === type
    );
    if (mailingResidence || !donorResidence) return;
    const mailingKeys = [
      "CountryCode",
    ];
    let copiedMailingResidence = mailingKeys.reduce((acc, cur) => {
      if (donorResidence[cur]) {
        acc[cur] = donorResidence[cur];
      }
      return { ...acc };
    }, {});
    copiedMailingResidence.BorrowerResidencyType = "Mailing";
    Residences = [...Residences, copiedMailingResidence];
    Borrower.value = { ...Borrower.value, Residences };
    Borrowers.value = [
      ...Borrowers.value.map(item =>
        item.Id !== Borrower.value.Id ? item : { ...item, ...Borrower.value }
      )
    ];
    updateCurrentLoan()
  }
  const setAutoCompleteAddress = (inputId,payload) => {
    autoCompleteAddress.value = {
      inputId: inputId,
      value:payload
    }
  }

  const inviteBorrower = async (payload) => {
   try{
     const { Invitee, Message } = payload;
     const UserId = userStore.currentUser.userId;
     const LoanId = generalStore.serverLoan.Id;
     if (UserId && LoanId) {
      const result = await sendInvitation({ LoanId, Message, Inviter: { UserId }, Invitee });
      const { FirstName, LastName, Email, Phone: MobilePhoneNumber } = result.data.Data.Invitee;
      const InvitationToken = result.data.Data.InvitationToken;
      const Id = Borrowers.value.length + 1;
      let invitedBorrower = {
        Id,
        FirstName,
        LastName,
        Email,
        MobilePhoneNumber,
        InvitationToken
      };
      if (Invitee.BorrowerType === "Spouse") {
        invitedBorrower.CoBorrower = true;
        invitedBorrower.LinkedBorrowerId = Borrower.value.Id;
        updateBorrower({ prop: "LinkedBorrowerId", value: Id });
        const borrowers = [...Borrowers.value, invitedBorrower];
        updateBorrowers(borrowers);
        setCurrentLoan({ ...generalStore.currentLoan, BorrowerCount: Id });
        await generalStore.saveLoanPatches();
        let progressModel = localStorage.getItem("progressModel");
        if (progressModel) {
          // const { Template } = await lynxApi.getProgressModelBorrowerTemplate();
        progressModel = JSON.parse(progressModel);
        progressModel.Borrowers.push({ Id, BorrowerSections });
        // progressModel.Borrowers.push({ ...Template, Id });
        localStorage.setItem("progressModel", JSON.stringify(progressModel));
        // await lynxApi.saveProgressModel(state.currentLoan.Id, progressModel);
        }
      }
     }
   }catch(err){
    toast.error("An error occurred while trying to sent Invitations. Please try again.");
    throw err;
   }
  };

  const updateBorrowers = (payload) => {
    Borrowers.value = payload;
    Borrower.value = Borrowers.value.find(item => item.Id === Borrower.value.Id);
    updateCurrentLoan()
  };
 
  const resendInvitation = async (payload) => {
    try {
      const { Invitee, Message, InvitationToken } = payload;
      const UserId = userStore.currentUser.userId;
      const LoanId = generalStore.serverLoan.Id;
      if(generalStore.serverLoan.Id){
        await resendLoanInvitation({
        LoanId,
        Message,
        Inviter: { UserId },
        Invitee,
        InvitationToken
        });
        toast.success("Invitation has been resent")
      }
    } catch (err) {
      if(err !== "Invalid token"){
        toast.error("An error occurred while trying to resent Invitations. Please try again.")
      }
      throw err;
    }
  };

  const cancelInvitation = async (payload) => {
   try{
    if(generalStore.serverLoan.Id){
      await cancelLoanInvitation(payload);
      await getInvitations();
      toast.success("Invitation cancelled")
    }
   }catch(err){
    toast.error("An error occurred while trying to cancel Invitations. Please try again.")
    throw err;
   }
  };

  const setRealEstateOwned = (payload) => {
    realEstateOwned.value = payload;
  }

  const setRealEstateOwnedExpenses = (payload) => {
    realEstateOwnedExpenses.value = payload;
  }

  const setRealEstateOwnedMortgage = (payload) => {
    realEstateOwnedMortgage.value = payload;
  }

  return {
    Borrowers,
    Borrower,
    currentBorrowerIndex,
    invitations,
    realEstateOwned,
    realEstateOwnedExpenses,
    realEstateOwnedMortgage,
    autoCompleteAddress,
    getDependents,
    getMilitaryServices,
    getResidences,
    getSpecificResidence,
    setInitialBorrowers,
    setCurrentBorrower,
    updateCurrentLoan,
    getBorrowerEmployment,
    getInvitations,
    isVisible,
    onToggle,
    getBorrower,
    updateResidenceProp,
    updateBorrower,
    updateDependents,
    updateMilitary,
    updateResidence,
    removeResidence,
    setInitialMailingResidence,
    setAutoCompleteAddress,
    inviteBorrower,
    resendInvitation,
    cancelInvitation,
    setCurrentLoan,
    updateBorrowers,
    setRealEstateOwned,
    setRealEstateOwnedExpenses,
    setRealEstateOwnedMortgage,
    setBroadcast
  }
})
