<script setup>
import Start from '../images/loan-property/Start.vue';
import { useBorrowersStore } from '@/stores/borrowersStore'
import { useGeneralStore } from '@/stores/generalStore';
import { computed, ref } from 'vue';

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();


const canGoNextPage = computed(() => {
  return (
    generalStore.currentLoan === null || generalStore.currentLoan.FoundProperty === undefined 
    )
  });

const foundPropertyValue = computed(() => {
  if(generalStore.currentLoan.FoundProperty === null){
    return null;
  }else{
    return generalStore.currentLoan.FoundProperty
  }
});

const setFoundProperty = (val) => {
    borrowersStore.setCurrentLoan({...generalStore.currentLoan, FoundProperty: val})
};
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container justify-space-between">
      <div class="titleText">Have you found a property yet?</div>
      <div class="start-img">
        <Start />
      </div>
      <AgreeToggle class="mb-5 mt-3" :value="foundPropertyValue" @input="setFoundProperty"></AgreeToggle>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="canGoNextPage"></NavigationButtons>
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-content-type {
  .image-container {
    .titleText {
      color: $content-black;
    }

    .start-img {
      margin: 70px 0;

      @media (max-width: $mobile-width) {
        margin: 10px 0;
      }

      svg {
        height: 250px;
        width: 350px;

        @media (max-width: $mobile-width) {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>