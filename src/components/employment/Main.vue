<script setup>
import Start from "@/components/images/employment/Start.vue";
import { computed } from "vue";
import { useBrandingStore } from "@/stores/brandingStore";

const brandingStore = useBrandingStore();

const section = computed(() => {
  return brandingStore.getBrandingSection("EmploymentAndIncome");
});

const introSlide = computed(() => {
  return brandingStore.getIsHostedMode() && section.value && section.value.IntroSlide;
});

const title = computed(() => {
  return (
    (introSlide.value && introSlide.value.Title) ||
    "Let us know about your employment and income."
  );
});

const content = computed(() => {
  return brandingStore.getIsHostedMode() && introSlide.value && introSlide.value.Content;
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <div class="titleSecondaryText primary-text font-weight-bold" v-if="content">
        {{ content }}
      </div>
      <div class="titleSecondaryText primary-text font-weight-bold" v-else>
        Remember, your income isn’t just money received from your job; it could be social
        security, child support, alimony, or many other sources as long as you have been
        receiving it and will keep receiving it.
      </div>
      <Start class="start-svg" />
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
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
