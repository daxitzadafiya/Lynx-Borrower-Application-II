<script setup>
import CreditOrder from "@/components/images/credit/CreditOrder.vue";
import { onMounted, ref } from "vue";
import { useGeneralStore } from "@/stores/generalStore";
import { useUserStore } from "@/stores/userStore";

const generalStore = useGeneralStore();
const userStore = useUserStore();

const message = ref("Nice work completing your loan application!");

onMounted(() => {
  generalStore.setUnderwriteMessage1(message.value);
  generalStore.setFindingsMessages("");
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText" v-html="message"></div>
      <div class="titleSecondaryText primary-text font-weight-bold">
        Our processors are already hard at work gathering the remaining details to
        finalize your loan application. We'll send you a link via email shortly so that
        you may review your application details and submit your loan application for an
        approval.
      </div>
      <CreditOrder class="start-svg"/>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        nextButtonText="Log Out"
        :hideProgressAndPrevious="true"
        :HasDefaultNavigation="false"
        :NextClicked="userStore.logOut"
        :isProgressDot="false"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.start-svg {
  margin: 20px 0px;
  height: auto;
  max-height: 375px;
}
@media (max-width: $mobile-width) {
  .start-svg {
    width: 100%;
  }
}
</style>
