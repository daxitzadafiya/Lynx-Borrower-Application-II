<script setup>
import { useGeneralStore } from "@/stores/generalStore";
import { useUserStore } from "@/stores/userStore";
import CreditOrder from "@/components/images/credit/CreditOrder.vue";

const generalStore = useGeneralStore();
const userStore = useUserStore();
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        <pre
          class="approve"
          v-html="generalStore.getUnderwriteMessage1()"
          style="word-wrap: break-word; white-space: pre-wrap; font-family: inherit"
        ></pre>
      </div>
      <br />
      <div class="titleSecondaryText primary-text font-weight-bold;">
        <pre
          v-html="generalStore.getUnderwriteMessage2()"
          style="word-wrap: break-word; white-space: pre-wrap; font-family: inherit"
        ></pre>
      </div>
      <CreditOrder class="start-svg" />
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
  margin: 32px 0px;
  height: auto;
  max-height: 375px;
}
@media (max-width: $mobile-width) {
  .start-svg {
    width: 100%;
  }
}
:deep(.variableButtonWidth) {
  min-width: 152px !important;
  @media (max-width: $mobile-width) {
    min-width: 75px !important;
  }
}
.approve {
  margin: 20px 0px;
}
.image-container .titleText {
  margin: 0;
}

.image-container .start-svg {
  margin: 20px 0px 20px 0px;
  width: auto;
  height: auto;
  max-height: 375px;

  @media (max-width: $mobile-width) {
    width: 100%;
    margin: 35px 0px 20px 0px;
  }
}

@media (max-width: $mobile-width) {
  .approve {
    margin: 0px;
  }
}
</style>
