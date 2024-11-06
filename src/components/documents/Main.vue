<script setup>
import Start from '@/components/images/documents/Start.vue';
import { useBrandingStore } from "@/stores/brandingStore";
import { computed } from 'vue';

const brandingStore = useBrandingStore();

const section = computed(() => {
  return brandingStore.getBrandingSection("Documents");
});

const introSlide = computed(() => {
  return brandingStore.getIsHostedMode && section.value && section.value.IntroSlide;
});

const title = computed(() => {
  return introSlide.value && introSlide.value.Title;
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText" v-if="title">{{ title }}</div>
      <div class="titleText" v-else>
        We are almost done!<br />Take your time and upload the documents in this section.
      </div>
      <Start class="start-svg"/>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :RequestedNextPath="'documents/upload'"
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