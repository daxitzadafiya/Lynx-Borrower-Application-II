import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useBorrowersStore } from '@/stores/borrowersStore'
import { useGeneralStore } from "@/stores/generalStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { useTransactionDetailsStore } from "@/stores/transactionDetailsStore";

export const useLoanDetailsStore = defineStore('loanDetails', () => {
    const borrowersStore = useBorrowersStore();
    const generalStore = useGeneralStore();
    const loanPropertyStore = useLoanPropertyStore();
    const transactionStore = useTransactionDetailsStore();

    const updateAdditionalInfo = (payload) => {
        let LenderLoanInformation = loanPropertyStore.lenderLoanInformation || {};
        let AdditionalInformation = LenderLoanInformation.AdditionalInformation || {};
        AdditionalInformation[payload.prop] = payload.value;
        LenderLoanInformation.AdditionalInformation = AdditionalInformation;
        loanPropertyStore.lenderLoanInformation = {
          ...loanPropertyStore.lenderLoanInformation,
          ...LenderLoanInformation
        };
        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    }

    const getAdditionalLoanInformation = () => {
        return transactionStore.getLenderLoanInformation().AdditionalInformation || {};
    }

    return { updateAdditionalInfo, getAdditionalLoanInformation }
})