<script setup>
import { onMounted, ref, watch } from "vue";
import AgreeToggle from "@/components/core-components/AgreeToggle.vue";
import CoBorrowers  from '@/components/images/borrowers/CoBorrowers.vue'
import { useBorrowersStore } from "@/stores/borrowersStore";
import { loanPatch } from "@/mixins/loanPatch.js";
import { useGeneralStore } from '@/stores/generalStore';

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const hasCoBorrower = ref(null);
const { saveAndAdvance } = loanPatch();

onMounted(() => {
  hasCoBorrower.value =
    borrowersStore.Borrowers.findIndex(x => x.CoBorrower === true) !== -1
      ? borrowersStore.Borrowers.findIndex(x => x.CoBorrower === true) !== -1
      : null;
});

const openAddCoBorrowerPopup = async () => {
  await borrowersStore.getInvitations();
  borrowersStore.onToggle(true);
  generalStore.toggleIsOnlay({
    onlayComponent: "borrower",
    isOnlay: true
  });
};

const onNextClicked = async () =>{
  if(hasCoBorrower.value){
    openAddCoBorrowerPopup()
  }else{
   await saveAndAdvance(true)
  }
};

const setHasCoBorrower = (value) => {
  hasCoBorrower.value = value
};

watch(
  () => useBorrowersStore().isVisible,
  async (newValue) => {
    if(newValue == false && generalStore.onlayComponent != "borrower"){
      await saveAndAdvance(true)
    }
  },
  { deep: true }
);
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will there be a Co-Borrower on this loan with you?
      </div>
      <CoBorrowers class="titleImage my-5 w-auto h-auto" />
      <AgreeToggle
        class="my-5"
        :value="hasCoBorrower"
        @input="setHasCoBorrower"
      ></AgreeToggle>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="onNextClicked"
      ></NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-container {
  background: $white;
  margin-top: 15px;
  margin-bottom: 5px;
  border: $container-border;
  border-radius: $container-border-radius;

  .image-container {
    padding: $page-padding;
    @media (max-width: $mobile-width) {
      justify-content: flex-start;
      padding: 30px 10px;
    }
    .titleText {
        font-size: 26px;
        line-height: 39px;
        max-width: 800px;
        color: $content-black;
        @media (max-width: $mobile-width) {
            font-size: 16px;
            line-height: 28px;
            margin: 0px 0px 15px 0px;
        }
    }
    .titleImage {
        height: 350px !important;
        width: 354px !important;
        @media (max-width: $mobile-width) {
            width: 100% !important;
            height: 100% !important;
        }
    }
  }
  .navigation-container{
    border-top: 1px solid $light-blue;
  }
  .v-btn-group--density-default.v-btn-group {
    width: 100% !important;
  }
}
</style>
