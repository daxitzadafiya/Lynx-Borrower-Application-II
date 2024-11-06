<script setup>
import DepositProperty from "@/components/images/accounts/DepositProperty.vue";
import AgreeToggle from "@/components/core-components/AgreeToggle.vue";
import { ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const appRopTransaction = ref(null);
const options = ref([
  { value: "noDepositRequired", label: "No Deposit Required" },
  { value: "depositToBeMade", label: "Deposit to-be Made" },
  { value: "depositMade", label: "Deposit Made" },
]);
const setAppRopTransaction = (value) => {
  appRopTransaction.value = value;
  borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, DepositRequirement: value })
};
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        In a Real Estate purchase transaction, it is customary to place an escrow/earnest
        money deposit to demonstrate your intent to close on the property. Please select
        the option most appropriate to your transaction.
      </div>
      <DepositProperty />
      <v-form class="my-5">
        <AgreeToggle
          :options="options"
          :value="appRopTransaction"
          @input="setAppRopTransaction"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="appRopTransaction === null"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container{
  svg{
    margin: 20px 0px;
    width: auto;
    height: auto;
    max-height: 375px;
    @media (max-width: $mobile-width) {
      width: 100%;
    }
  }
}
:deep(.v-btn-toggle){
  flex-wrap: wrap;
}
</style>
