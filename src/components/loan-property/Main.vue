<script setup>
import { ref } from 'vue'
import Start from '../images/loan-property/Start.vue'

const title = ref(
  'Please provide us with some details about the Property and Loan you are applying for'
)
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container justify-space-between">
      <div class="titleText">{{ title }}</div>
      <div class="start-img">
        <Start />
      </div>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-content-type .image-container .titleText {
  color: $content-black;
}
.image-content-type .image-container .start-img{
  margin: 20px 0;
}
@media (max-width:$mobile-width) {
  .image-content-type .image-container .start-img svg{
    width: 100%;
    height: 100%;
  }
}
</style>