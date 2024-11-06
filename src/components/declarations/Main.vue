<script setup>
import { computed } from "vue";
import Start from '@/components/images/declarations/Start.vue';
import { useBrandingStore } from "@/stores/brandingStore";

const brandingStore = useBrandingStore();

const section = computed(() => {
  return brandingStore.getBrandingSection("Declarations");
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
        We are almost done!<br /><span class="lg-block"
          >Take your time and answer the questions in this section.</span
        >
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