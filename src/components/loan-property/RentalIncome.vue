<script setup>
import { ref } from "vue";
import RentalIncome from "../images/loan-property/RentalIncome.vue";
import { useGeneralStore } from '@/stores/generalStore';
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { loanPatch } from "@/mixins/loanPatch";

const loanPropertyStore = useLoanPropertyStore();
const { toggleIsOnlay } = useGeneralStore()
const rentalIncomeExpectation = ref(null);
const { saveAndAdvance } = loanPatch();

const nextClicked = () => {
  if (rentalIncomeExpectation.value) {
    loanPropertyStore.onToggle(true)
    toggleIsOnlay({ isOnlay: true, onlayComponent: "rentalIncome" });
  } else {
    saveAndAdvance(true,"/loanandproperty/review");
  }
};

const setRentalIncomeExpectation = (value) => {
    rentalIncomeExpectation.value = value
};

</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Do you expect to receive any rental income on the property you are purchasing?
      </div>
    </div>
    <div class="image-container">
      <div class="titleSecondaryText primary-text font-weight-bold">
        This is only necessary if the subject property is a 2 to 4 Unit Primary Residence
        or an Investment Property.
      </div>
      <div class="rental-income-img">
        <RentalIncome />
      </div>
      <v-form class="text-block my-5">
        <AgreeToggle
          :value="rentalIncomeExpectation"
          @input="setRentalIncomeExpectation"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="nextClicked"
        :ConditionsMet="rentalIncomeExpectation === null"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style scoped lang="scss">
.rental-income-img {
  margin: 70px 0;
  @media(max-width: $mobile-width) {
    margin:  30px 0;
  }
}
.image-content-type {
  .image-container {
    .rental-income-img {
      svg {
        height: 245px;
        width: 436px;
        @media(max-width: $mobile-width) {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
