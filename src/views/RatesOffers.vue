<script setup>
import { ref } from "vue";

const headerIcon = ref(null);
let icon = await import("@/assets/images/rates-offers/rates-offers_1.svg");
headerIcon.value = icon.default;
</script>

<template>
    <div class="rates-offers">
      <div class="main-header">
        <inline-svg class="header-icon" :src="headerIcon"></inline-svg>
        <div class="header-title">Rates, Terms and Special Offers</div>
      </div>
      <!-- @saveAndRedirect="({route}) => saveAndAdvance(true, route)" -->
      <router-view ></router-view>
    </div>
</template>
<style lang="scss" scoped>
.rates-offers{
  display: flex;
  flex-direction: column;
  gap:24px;
  .subtitle{
    font-weight: 500;
  }
  .main-header{
    .header-title{
      font-weight: 500;
      margin-left: 8px;
    }
  }
}
.header-icon{
  height: 25px;
  width: 22px;
  color: $primary !important;
}
</style>