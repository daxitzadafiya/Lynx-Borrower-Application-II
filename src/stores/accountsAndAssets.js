import { defineStore } from "pinia"
import { useBorrowersStore } from "@/stores/borrowersStore";
import { toast } from 'vue3-toastify'
import { searchText } from "@/api/accounts";
import { useGeneralStore } from "@/stores/generalStore";

export const useAccountAndAssetsStore = defineStore('accountAssets', () => {

    const borrowerStore = useBorrowersStore();
    const generalStore = useGeneralStore();

    const setAssets = (payload) => {
        const { assets, AssetTypeId } = payload;
        let allAssets =
            borrowerStore.Borrower && borrowerStore.Borrower.Assets
                ? JSON.parse(JSON.stringify(borrowerStore.Borrower.Assets))
                : [];
        const filtered = allAssets.filter(item => {
            return !AssetTypeId ? item.AssetTypeId : item.AssetTypeId !== AssetTypeId;
        });
        allAssets = [...filtered, ...assets].sort((a, b) => {
            return (
                !b.AssetTypeId - !a.AssetTypeId ||
                -(b.AssetTypeId > a.AssetTypeId) ||
                b.AssetTypeId < a.AssetTypeId
            );
        });
        borrowerStore.updateBorrower({ prop: "Assets", value: allAssets })
    }

    const getRegularAssets = () => {
        return borrowerStore.Borrower && borrowerStore.Borrower.Assets
            ? borrowerStore.Borrower.Assets.filter(item => !item.AssetTypeId)
            : [];
    }

    const getFinancialInstitutions = async (payload) => {
      try{
        const result = await searchText(payload)
        return result.data.Data;
      }catch(err){
        console.log('err: ', err);
        toast.error('An error occurred while trying to search text. Please try again.')
        throw err;
      }
    }

    const getPurchaseCredits = () => {
        return generalStore.currentLoan && generalStore.currentLoan.PurchaseCredits
            ? generalStore.currentLoan.PurchaseCredits
            : [];
    }

    const setPurchaseCredits = (payload) => {
        const currentLoan = { ...generalStore.currentLoan, PurchaseCredits: payload };
        borrowerStore.setCurrentLoan(currentLoan)
    }

    const getSellerCredits = () => {
        return  generalStore.currentLoan && generalStore.currentLoan.SellerCredits
        ? generalStore.currentLoan.SellerCredits
        : [];
    }

    const setSellerCredits = (payload) => {
        const currentLoan = { ...generalStore.currentLoan, SellerCredits: payload };
        borrowerStore.setCurrentLoan(currentLoan)
    }
    
    const getOtherAssets = () => {
       return borrowerStore.Borrower && borrowerStore.Borrower.Assets
            ? borrowerStore.Borrower.Assets.filter(item => item.AssetTypeId === 1)
            : [];
    }

    const getGiftsOrGrants = () => {
        return borrowerStore.Borrower && borrowerStore.Borrower.Assets
        ? borrowerStore.Borrower.Assets.filter(item => item.AssetTypeId === 2)
        : [];
    }

    return {
      setAssets,
      getRegularAssets,
      getFinancialInstitutions,
      getPurchaseCredits,
      setPurchaseCredits,
      getSellerCredits,
      setSellerCredits,
      getOtherAssets,
      getGiftsOrGrants,
    }
})