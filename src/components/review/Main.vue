<script setup>
import Review from "@/components/images/borrowers/Review.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();

const updateAndRedirect = () => {
  router.push("/review/details");
};
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">We've completed our review of your loan application!</div>
      <div class="titleSecondaryText primary-text font-weight-bold">
        Take a moment to look over everything that you have entered in the previous
        sections, as well as the information regarding closing costs and other details of
        the transaction.
      </div>
      <Review class="start-svg"/>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        nextButtonText="OK"
        :hideProgressAndPrevious="true"
        :HasDefaultNavigation="false"
        :NextClicked="updateAndRedirect"
        :isProgressDot="false"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.start-svg {
  height: auto;
  max-height: 375px;
}
@media (max-width: $mobile-width) {
  .start-svg {
    width: 100%;
  }
}
</style>
