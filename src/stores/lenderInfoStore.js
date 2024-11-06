import { defineStore } from 'pinia';
import { useBorrowersStore } from '@/stores/borrowersStore'
import { useGeneralStore } from "@/stores/generalStore";
import { useLoanPropertyStore } from '@/stores/loanPropertyStore'
import { useTransactionDetailsStore } from "@/stores/transactionDetailsStore";

export const useLenderInfoStore = defineStore('lenderInfoStore', () => {
    const borrowersStore = useBorrowersStore();
    const generalStore = useGeneralStore();
    const loanPropertyStore = useLoanPropertyStore();
    const transactionStore = useTransactionDetailsStore();

    const updatePropertyAndLoanInfoBoolean = (payload) => {
        let LenderLoanInformation = loanPropertyStore.lenderLoanInformation || {};
        let PropertyAndLoanInformation =
            LenderLoanInformation.PropertyAndLoanInformation || {};
        if (typeof payload === "string") {
            PropertyAndLoanInformation[payload] = !PropertyAndLoanInformation[payload];
        } else {
            PropertyAndLoanInformation[payload.prop] = payload.value;
        }
        LenderLoanInformation.PropertyAndLoanInformation = PropertyAndLoanInformation;
        loanPropertyStore.lenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            ...LenderLoanInformation
        }
        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    };

    const updateMortgageLoanInfo = (payload) => {
        const { prop, value } = payload;
        let LenderLoanInformation = loanPropertyStore.lenderLoanInformation || {};
        let MortgageLoanInformation =
            LenderLoanInformation.MortgageLoanInformation || {};
        MortgageLoanInformation[prop] = value;
        if (!MortgageLoanInformation[prop]) {
            delete MortgageLoanInformation[prop];
        }
        LenderLoanInformation.MortgageLoanInformation = MortgageLoanInformation;
        loanPropertyStore.lenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            ...LenderLoanInformation
        }
        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    }

    const updatePropertyAndLoanInfo = (payload) => {
        const { prop, value } = payload;
        let LenderLoanInformation = loanPropertyStore.lenderLoanInformation || {};
        let PropertyAndLoanInformation =
            LenderLoanInformation.PropertyAndLoanInformation || {};
        PropertyAndLoanInformation[prop] = value;
        if (!PropertyAndLoanInformation[prop]) {
            delete PropertyAndLoanInformation[prop];
        }
        LenderLoanInformation.PropertyAndLoanInformation = PropertyAndLoanInformation;
        loanPropertyStore.lenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            ...LenderLoanInformation
        };
        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    }

    const updatePropertyAndLoanRadioOption = (payload) => {
        const { prop, value } = payload;
        let LenderLoanInformation = loanPropertyStore.lenderLoanInformation || {};
        let PropertyAndLoanInformation =
            LenderLoanInformation.PropertyAndLoanInformation || {};
        PropertyAndLoanInformation[prop] =
            PropertyAndLoanInformation[prop] === value ? null : value;
        if (!PropertyAndLoanInformation[prop]) {
            delete PropertyAndLoanInformation[prop];
        }
        LenderLoanInformation.PropertyAndLoanInformation = PropertyAndLoanInformation;
        loanPropertyStore.lenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            ...LenderLoanInformation
        };
        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    }

    const getTitleInformation = () => {
        return transactionStore.getLenderLoanInformation().TitleInformation || [];
    }

    const setTitleInformation = (payload) => {
        const LenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            TitleInformation: payload
        };
        loanPropertyStore.lenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            ...LenderLoanInformation
        };
        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    }

    const updateMortgageLoanRadioOption = (payload) => {
        const { prop, value } = payload;
        let LenderLoanInformation = loanPropertyStore.lenderLoanInformation || {};
        let MortgageLoanInformation =
            LenderLoanInformation.MortgageLoanInformation || {};
        MortgageLoanInformation[prop] =
            MortgageLoanInformation[prop] === value ? null : value;
        if (!MortgageLoanInformation[prop]) {
            delete MortgageLoanInformation[prop];
        }
        LenderLoanInformation.MortgageLoanInformation = MortgageLoanInformation;
        loanPropertyStore.lenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            ...LenderLoanInformation
        };
        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    }

    const updateTransactionDetails = (payload) => {
        const { prop, value } = payload;
        let LenderLoanInformation = loanPropertyStore.lenderLoanInformation || {};
        let TransactionDetails = LenderLoanInformation.TransactionDetails || {};
        TransactionDetails[prop] = value;
        if (!TransactionDetails[prop]) {
            delete TransactionDetails[prop];
        }
        LenderLoanInformation.TransactionDetails = TransactionDetails;
        loanPropertyStore.lenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            ...LenderLoanInformation
        };
        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    }

    const updateMortgageLoanInfoBoolean = (payload) => {
        let LenderLoanInformation = loanPropertyStore.lenderLoanInformation || {};
        let MortgageLoanInformation =
            LenderLoanInformation.MortgageLoanInformation || {};
        MortgageLoanInformation[payload] = !MortgageLoanInformation[payload];
        LenderLoanInformation.MortgageLoanInformation = MortgageLoanInformation;
        loanPropertyStore.lenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            ...LenderLoanInformation
        };
        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    }

    const getPropertyAndLoanInformation = () => {
        return loanPropertyStore.lenderLoanInformation.PropertyAndLoanInformation || {}
    }

    const getCounselingParties = () => {
        return transactionStore.getLenderLoanInformation().CounselingParties || [];
    }

    const updateCounselingParties = (payload) => {
        const LenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            CounselingParties: payload
          };
          loanPropertyStore.lenderLoanInformation = {
            ...loanPropertyStore.lenderLoanInformation,
            ...LenderLoanInformation
          };

        borrowersStore.setCurrentLoan({
            ...generalStore.currentLoan,
            LenderLoanInformation: loanPropertyStore.lenderLoanInformation
        });
    }

    return { updatePropertyAndLoanInfoBoolean, updateMortgageLoanInfo, updatePropertyAndLoanInfo, updatePropertyAndLoanRadioOption, getTitleInformation, setTitleInformation, updateMortgageLoanRadioOption, updateTransactionDetails, updateMortgageLoanInfoBoolean, getPropertyAndLoanInformation, getCounselingParties, updateCounselingParties }
})