<script setup>
import CreditOrder from "@/components/images/credit/CreditOrder.vue";
import { onMounted, ref } from "vue";
import { useGeneralStore } from "@/stores/generalStore";

const generalStore = useGeneralStore();

const message = ref(`<br>
                Please click the button below to submit your loan for approval.`);

onMounted(() => {
  generalStore.setUnderwriteMessage1(message.value);
  generalStore.setFindingsMessages("");
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText" v-html="generalStore.getUnderwriteMessage1()"></div>
      <CreditOrder class="start-svg" />
    </div>
    <div class="navigation-container">
      <NavigationButtons
        nextButtonText="Submit Application"
        :hideProgressAndPrevious="true"
        :HasDefaultNavigation="false"
        :NextClicked="generalStore.underwrite"
        :isProgressDot="false"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.start-svg {
  margin: 32px 0px;
  height: auto;
  max-height: 375px;
}
@media (max-width: $mobile-width) {
  .start-svg {
    width: 100%;
  }
}
:deep(.variableButtonWidth){
  min-width: 152px !important;
}
</style>
