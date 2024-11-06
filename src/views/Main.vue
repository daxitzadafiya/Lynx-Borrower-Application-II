<script setup>
import PageHeader from '@/components/UI/PageHeader.vue'
</script>
<template>
  <PageHeader />
  <div class="main-container">
    <RouterView />
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  height: 100%;
}
</style>
