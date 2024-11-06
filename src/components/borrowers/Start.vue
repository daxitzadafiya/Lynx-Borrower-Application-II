<script setup>
import { computed } from 'vue'
import { useBrandingStore } from '../../stores/brandingStore'
import StartBorrowers  from '@/components/images/borrowers/Start.vue'

const brandingStore = useBrandingStore()
const section = computed(() => brandingStore.getBrandingSection('Borrowers'))
const introSlide = computed(() => brandingStore.getIsHostedMode() && section.value && section.value.IntroSlide)
const title = computed(
  () =>
    (introSlide && introSlide.Title) ||
    'Please tell us about yourself so we can get started customizing YOUR mortgage!'
)
</script>

<template>
  <div class="content-container image-content-type d-flex flex-column w-100">
    <div class="image-container d-flex justify-center align-center flex-grow-1 flex-column">
      <div class="titleText font-weight-medium my-5 text-center">{{ title }}</div>
      <StartBorrowers class="titleImage my-5 w-auto h-auto" />
    </div>
    <div class="navigation-container">
      <NavigationButtons
      ></NavigationButtons>
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
    @media (max-width: $mobile-width) {
      justify-content: flex-start;
      padding: 30px 10px;
    }
    .titleText {
        font-size: 26px;
        line-height: 39px;
        max-width: 800px;
        color: $content-black;
        @media (max-width: $mobile-width) {
            font-size: 16px;
            line-height: 28px;
            margin: 0px 0px 15px 0px !important;
        }
    }
    .titleImage {
        max-height: 375px;        
        @media (max-width: $mobile-width) {
            width: 100% !important;
        }
    }
  }
  .navigation-container{
    border-top: 1px solid $light-blue;
  }
}
</style>
