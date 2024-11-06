<script setup>
import Review from "@/components/Review.vue";
import { loanPatch } from "@/mixins/loanPatch.js";
const { saveAndAdvance } = loanPatch();
const onClick = () => {
  saveAndAdvance(true);
};
</script>
<template>
<Review :onOkClicked="onClick"/>
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
}
</style>
