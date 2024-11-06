<script setup>
import LoanGrants from "@/components/images/accounts/LoanGrants.vue";
import { computed, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";

const accountAssetsStore = useAccountAndAssetsStore();
const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const utilizingGrant = ref(null);

const setUtilizingGrant = (value) => {
  utilizingGrant.value = value;
  borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, ReceivingGrants: value });
};

const grants = computed(() => {
  return accountAssetsStore.getGiftsOrGrants.filter((item) => item.AssetType === "Grant");
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will you be utilizing a Grant or Down Payment Assistance Program (DPA) for this
        Loan?
      </div>
      <LoanGrants></LoanGrants>
      <v-form class="my-5">
        <AgreeToggle :value="utilizingGrant" @input="setUtilizingGrant"></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="utilizingGrant === null"></NavigationButtons>
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
