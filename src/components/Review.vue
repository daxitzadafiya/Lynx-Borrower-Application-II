<script setup>
import { ref, defineProps } from "vue";
import Review from '@/components/images/borrowers/Review.vue'
const props = defineProps({
  onOkClicked: {
    type: Function,
    required: false
  }
})
const hasCoBorrower = ref(null)
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div>
        <div class="titleText">
          {{ "Let's review the information you just entered" }}
        </div>
        <div class="titleSecondaryText primary-text">
          If you need to make any corrections, you may do so on the following screen.
        </div>
      </div>

      <Review class="titleImage my-5 w-auto h-auto" />
    </div>
    <div class="navigation-container">
      <NavigationButtons :HasDefaultNavigation="false" :NextClicked="onOkClicked" nextButtonText="Ok"
        :isProgressDot="false" :hideProgressAndPrevious="true"></NavigationButtons>
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
    justify-content: flex-start;

    @media (max-width: $mobile-width) {
      padding: 30px 10px;
      ;
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
      max-height: 375px;

      @media (max-width: $mobile-width) {
        width: 100% !important;
      }
    }
  }

  :deep(.variableButtonWidth) {
    width: 200px;

    @media (max-width: $tablet-width) {
      width: 200px !important;
    }
  }
}
</style>
