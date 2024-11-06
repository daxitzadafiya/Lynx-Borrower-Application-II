
<script setup>
import { ref, computed } from 'vue'
import SalesContract from '../images/loan-property/SalesContract.vue';
import { useGeneralStore } from '@/stores/generalStore';
import { useBorrowersStore } from '@/stores/borrowersStore'

const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();

const propertyAddress = computed(() => {
  return generalStore.currentLoan && generalStore.currentLoan.Property
    ? generalStore.currentLoan.Property.AddressLineText
    : "";
});

const salesContractValue = computed(() => {
  if (generalStore.currentLoan.SalesContract === null) {
    return null;
  } else {
    return generalStore.currentLoan.SalesContract
  }
});

const canGoNextPage = computed(() => {
  return (
    generalStore.currentLoan == null ||
    generalStore.currentLoan.SalesContract === undefined ||
    generalStore.currentLoan.SalesContract === null
  );
});

const setFoundPropertyAndRedirect = (val) => {
  borrowersStore.setCurrentLoan({...generalStore.currentLoan, SalesContract: val})
};
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container justify-space-between">
      <div class="titleText">
        Do you have sales contract on {{ propertyAddress }}?
      </div>
      <div class="sales-img">
        <SalesContract/>
      </div>
      <AgreeToggle
        class="my-5"
        :value="salesContractValue"
        @input="setFoundPropertyAndRedirect"
      ></AgreeToggle>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="canGoNextPage"
      ></NavigationButtons>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.v-btn-group--density-default.v-btn-group {
    padding: 5px 10px;
    gap: 20px;
}
.image-content-type .image-container .titleText {
    color: $content-black;
}
@media (max-width: $mobile-width) {
  .image-content-type .image-container .sales-img svg {
    width: 100%;
    height: 100%;
  }
}
</style>
