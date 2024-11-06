<script setup>
import LoanGiftSorGrants from "@/components/images/accounts/LoanGiftSorGrants.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import { computed, ref } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const accountAssetsStore = useAccountAndAssetsStore();

const receiveGifts = ref(null);
const setReceiveGifts = (value) => {
  borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, ReceivingGifts: value });
  receiveGifts.value = value;
};

const gifts = computed(() => {
  return accountAssetsStore
    .getGiftsOrGrants()
    .filter(
      (item) =>
        item.AssetType === "GiftOfCash" || item.AssetType === "GiftOfPropertyEquity"
    );
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text">
        Have you received or plan to receive any Gifts for this Loan?
      </div>
      <div class="titleSecondaryText">
        A gift can come either in the form of equity in the property being purchased or
        from an asset account owned by a donor.
      </div>
      <LoanGiftSorGrants />
      <v-form class="text-block my-6">
        <AgreeToggle :value="receiveGifts" @input="setReceiveGifts"></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="receiveGifts === null"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    width: auto;
    height: auto;
    @media (max-width: $mobile-width) {
      width: 100%;
    }
  }
}
.v-btn-group--density-default.v-btn-group{
  padding: 0;
  overflow: visible;
}
</style>
