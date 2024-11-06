<script setup>
import { ref, onMounted, computed } from 'vue'
import NeighborHood  from '@/components/images/sign-in/NeighborHood.vue'
const logo = ref('');
onMounted(async () => {
    logo.value = await import(`@/assets/images/${import.meta.env.VITE_BRAND}/logo.png`);
})
const title = computed(()=>{
   return import.meta.env.VITE_SLOGAN;
});
</script>

<template>
  <div class="page-container">
    <h1 class="app-title">{{ title }}</h1>
    <div class="card-wrapper">
      <div class="form-header">
        <img :src="logo.default" />
      </div>
      <div class="form-wrapper">
        <RouterView />
      </div>
    </div>
    <div class="bg-neighborhood">
      <NeighborHood />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  max-width: $max-page-width;
  padding: $page-padding;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
  @media (max-width: $mobile-width) {
    padding: $mobile-page-padding;
  }
}
.bg-neighborhood{
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: $width;
  margin: 0 auto;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: -1;
}

.app-title {
  font-weight: $font-weight;
  font-size: $heading;
  line-height: 120%;
  text-align: center;
  margin: 0;
  color: $primary;
  @media (max-width: $mobile-width) {
    font-size: 26px;
  }
}

.card-wrapper {
  border: 1px solid #eaeaea;
  box-shadow:
    0px 2px 9px rgba(0, 0, 0, 0.05),
    0px 0px 7px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  margin-top: 30px;
  margin-left:auto;
  margin-right:auto;
  margin-bottom: 60px;
  max-width: 400px;
  width: 100%;
  background-color: white;
  // overflow: hidden;
}

.form-header {
  background-color: $primary;
  width: calc(100% + 4px);
  margin-left: -2px;
  display: flex;
  justify-content: center;
  padding-top: 12px;
  padding-bottom: 20px;
  border-radius: 10px 10px 0 0;
  img {
    max-height: 70px;
  }
}

.form-wrapper {
  padding: 16px 30px 16px 30px;
  width: 100%;
  :deep() {
    .title {
      font-size: 20px;
      line-height: 32px;
      font-weight: 500;
      letter-spacing: 0.25px;
      margin: 0;
      text-align: center;
    }
    .subtitle {
      font-weight: 400;
      line-height: 24px;
      font-size: 16px;
      color: $gray3;
      margin-bottom: 25px;
      text-align: center;
    }
    .v-input {
      margin-bottom: 5px;
      .v-field__input {
        padding: 10px;
        min-height: auto;
      }
    }
    .v-btn {
      margin-top: 20px;
      text-transform: none;
    }
    a {
      color: $primary;
      text-decoration: none;
      transition: opacity 0.3s ease-in-out;
      &:hover {
        opacity: 0.7;
      }
    }
    .bottom-info {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      gap: 4px;
      color: $gray2;
    }
    .v-input--density-default {
      --v-input-control-height: auto;
      --v-input-padding-top: 16px;
    }
    .v-row {
      margin-top: 8px;
    }
    .v-checkbox-btn {
      .v-label {
        color: $primary;
        opacity: 1;
      }
    }
    .v-selection-control__wrapper {
      height: auto;
    }
    .error-message {
      margin: 0;
      font-size: 12px;
      margin-bottom: 12px;
      color: #b00020;
      text-align: center;
    }
  }
}
</style>
