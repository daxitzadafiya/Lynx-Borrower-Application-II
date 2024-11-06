<script setup>
import { computed, onMounted } from "vue";
import Start from "@/components/images/credit/Start.vue";
import { useBrandingStore } from "@/stores/brandingStore";
import { useCreditStore } from "@/stores/creditStore";

const brandingStore = useBrandingStore();
const creditStore = useCreditStore();

const section = computed(() => {
  return brandingStore.getBrandingSection("Credit");
});

const introSlide = computed(() => {
  return brandingStore.getIsHostedMode() && section.value && section.value.IntroSlide;
});

const title = computed(() => {
  return (
    (introSlide.value && introSlide.value.Title) ||
    "Credit is an important factor in obtaining a mortgage and your score can change often."
  );
});

const content = computed(() => {
  return brandingStore.getIsHostedMode() && introSlide.value && introSlide.value.Content;
});

onMounted(() => {
  creditStore.getCreditOrders(true);
});
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <div class="titleSecondaryText primary-text font-weight-bold" v-if="content">
        {{ content }}
      </div>
      <div class="titleSecondaryText primary-text font-weight-bold">
        With some quick info we can let you know exactly what your credit score is. Don’t
        worry if your score isn’t what you expected, it is only one part of the overall
        decision.
      </div>
      <div class="w-100 start-svg">
        <Start />
      </div>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :RequestedNextPath="'credit/order'"
        :HasDefaultNavigation="false"
      ></NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.w-100 {
  width: 100%;
}

.h-100 {
  height: 100%;
}
.start-svg svg {
  margin: 70px auto;
  width: 309.72px;
  height: 283.23px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: $desktop-width) {
  .start-svg svg {
    margin: 70px auto !important;
    height: 50% !important;
    width: 50% !important;
  }
}
@media (max-width: $tablet-width) {
  .start-svg svg {
    margin: 20px auto !important;
    height: 45% !important;
    width: 45% !important;
  }
}
@media (max-width: $mobile-width) {
  .start-svg svg {
    margin: 50px auto !important;
    height: 78% !important;
    width: 78% !important;
  }
}
</style>
