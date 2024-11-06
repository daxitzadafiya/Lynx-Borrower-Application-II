import { defineStore } from 'pinia';
import { useLoanPropertyStore } from '@/stores/loanPropertyStore'

export const useTransactionDetailsStore = defineStore('transactionDetailStore', () => {
    const loanPropertyStore = useLoanPropertyStore();

    const getTransactionDetails = () => {
        return getLenderLoanInformation()?.TransactionDetails || {}
    }

    const getLenderLoanInformation = () => {
        return loanPropertyStore.lenderLoanInformation || {};
    }

    const getMortgageLoanInformation = () => {
        return loanPropertyStore.lenderLoanInformation?.MortgageLoanInformation || {};
    }

    const getOtherNewMortgageLoans = () => {
        return loanPropertyStore.getProperty() && loanPropertyStore.getProperty()?.OtherNewMortgageLoans
            ? loanPropertyStore.getProperty()?.OtherNewMortgageLoans
            : [];
    }

    const getClosingAdjustments = () => {
        return getTransactionDetails().ClosingAdjustments || [];
    }
    
    return { getTransactionDetails,getLenderLoanInformation, getMortgageLoanInformation, getOtherNewMortgageLoans, getClosingAdjustments }
})