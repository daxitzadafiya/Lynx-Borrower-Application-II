import { defineStore } from 'pinia'
import { ref, computed } from 'vue';
import { useGeneralStore } from "@/stores/generalStore";
import { useBorrowersStore } from '@/stores/borrowersStore';
import { useLenderInfoStore } from '@/stores/lenderInfoStore';
import { useTransactionDetailsStore } from '@/stores/transactionDetailsStore';

import states from "@/helpers/states";

export const useLoanPropertyStore = defineStore('loanPropertyStore', () => {
    const property = ref(null);
    const lenderLoanInformation= ref(null);
    const generalStore = useGeneralStore();
    const borrowersStore = useBorrowersStore();
    const lenderInfoStore = useLenderInfoStore();
    const transactionStore = useTransactionDetailsStore();
    const isModalVisible = ref(false)

    const setInitialLoanAndProperty = (payload) => {
        const { Property, LenderLoanInformation } = payload
          ? payload
          : { Property: null, LenderLoanInformation: null };
          property.value =
        Property && Object.entries(Property).length
            ? JSON.parse(JSON.stringify(Property))
            : Property;
            lenderLoanInformation.value =
        LenderLoanInformation && Object.entries(LenderLoanInformation).length
            ? JSON.parse(JSON.stringify(LenderLoanInformation))
            : LenderLoanInformation;
      };
    const getProperty = () => property.value;

    const getLoanPurposeType = () => {
       if(generalStore.currentLoan && generalStore.currentLoan.LoanPurposeType){
        return generalStore.currentLoan.LoanPurposeType;
       }else{
        return "All"
       }
    }

    const setLoanPurposeType = (payload) => {
      borrowersStore.setCurrentLoan({...generalStore.currentLoan,LoanPurposeType: payload})
    }

    const setLoanProperty = (payload) => {
        property.value = payload;
        generalStore.currentLoan = {...generalStore.currentLoan, Property: payload}
    }

    const setProperty = (payload) => {
      setLoanProperty(payload);
      if(payload.StateCode){
       const indicator = states.getStateIndicator(payload.StateCode, "CommunityProperty");
       lenderInfoStore.updatePropertyAndLoanInfoBoolean({
        prop: "CommunityPropertyStateResidentIndicator",
        value: indicator
       })
      }
      borrowersStore.setCurrentLoan({...generalStore.currentLoan, Property: property.value})
    }
    
    const getPurchasePrice = () => {
      return transactionStore.getTransactionDetails().SalesContractAmount || ""
    }

    const setPurchasePrice = (payload) => {
      const LenderLoanInformation = lenderLoanInformation.value || {};
      let TransactionDetails = LenderLoanInformation.TransactionDetails || {};
      TransactionDetails.SalesContractAmount = payload;
      if (!TransactionDetails.SalesContractAmount) {
        delete TransactionDetails.SalesContractAmount;
      }
      LenderLoanInformation.TransactionDetails = TransactionDetails;
      lenderLoanInformation.value = {
        ...lenderLoanInformation.value,
        ...LenderLoanInformation
      }
      borrowersStore.setCurrentLoan({...generalStore.currentLoan, LenderLoanInformation: lenderLoanInformation.value})
    }
     
    const isVisible = computed(() => {
      return isModalVisible.value
    })

    const onToggle = (val) => {
      isModalVisible.value = val
    }

    const getDownPaymentAmount = () => {
      return generalStore.currentLoan && generalStore.currentLoan.DownPaymentAmount
      ? generalStore.currentLoan.DownPaymentAmount
      : 0;
    }

    const getDownPaymentPercentage = () => {
      return generalStore.currentLoan && generalStore.currentLoan.DownPaymentPercentage
      ? generalStore.currentLoan.DownPaymentPercentage
      : 0;
    }

    const getLoanAmount = () => {
      return generalStore.currentLoan ? generalStore.currentLoan.LoanAmount : "";
    }

    const getBaseLoanAmount = () => {
      return transactionStore.getTransactionDetails().BaseLoanAmount || 0
    }

    const setLoanAmount = (payload) => {
      borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, LoanAmount: payload })
    };

    const getApr = () => {
      return generalStore.currentLoan && generalStore.currentLoan.APR ? generalStore.currentLoan.APR : 0;
    }


  return {
    property,
    lenderLoanInformation,
    setInitialLoanAndProperty,
    getProperty,
    getLoanPurposeType,
    setLoanPurposeType,
    setProperty,
    getPurchasePrice,
    setPurchasePrice,
    isVisible,
    onToggle,
    getDownPaymentAmount,
    getDownPaymentPercentage,
    getLoanAmount,
    getBaseLoanAmount,
    setLoanAmount,
    getApr
  }
})
