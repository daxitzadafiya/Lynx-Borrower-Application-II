<script setup>
import ClosingCosts from "@/components/images/accounts/ClosingCosts.vue";
import { computed, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const accountAssetsStore = useAccountAndAssetsStore();
const receivingPurchaseCredits = ref(null);

const setReceivingPurchaseCredits = (value) => {
  receivingPurchaseCredits.value = value;
  borrowersStore.setCurrentLoan({
    ...generalStore.currentLoan,
    ReceivingPurchaseCredits: value,
  });
};

const credits = computed(() => {
  return accountAssetsStore
    .getPurchaseCredits()
    .filter((item) => item.PurchaseCreditType !== "EarnestMoney");
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will you be receiving any Purchase Credits for this Loan, such as a Lease Purchase
        Fund or Sweat Equity?
      </div>
      <ClosingCosts></ClosingCosts>
      <v-form class="my-5">
        <AgreeToggle
          :value="receivingPurchaseCredits"
          @input="setReceivingPurchaseCredits"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="receivingPurchaseCredits === null"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    width: auto;
    height: auto;
    margin: 20px 0;
    @media (max-width: $mobile-width) {
      width: 100%;
    }
  }
}
.v-btn-group--density-default.v-btn-group {
  padding: 0;
  overflow: visible;
}
</style>
