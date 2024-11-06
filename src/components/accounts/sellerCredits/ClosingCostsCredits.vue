<script setup>
import ClosingCosts from "@/components/images/accounts/ClosingCosts.vue";
import { ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";

const receivingAnyCredit = ref(null);
const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();

const setReceivingAnyCredit = (value) => {
  (receivingAnyCredit.value = value),
    borrowersStore.setCurrentLoan({
      ...generalStore.currentLoan,
      ReceivingSellerCredits: value,
    });
};
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Are you receiving any credit towards closing costs from the Seller, Builder or
        Real Estate Agent?
      </div>
      <ClosingCosts />
      <v-form class="text-block my-5">
        <AgreeToggle
          :value="receivingAnyCredit"
          @input="setReceivingAnyCredit"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="receivingAnyCredit === null"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    margin: 20px 0px;
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
