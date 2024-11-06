<script setup>
import { onMounted, defineEmits } from "vue";
import { useRoute } from "vue-router";

const emit = defineEmits(["setProgressVisibility"]);
const route = useRoute();
const setProgressVisibility = ({ name }) => {
  emit("setProgressVisibility", { name, step: 12 });
};

onMounted(() => {
  setProgressVisibility({ name: route.name });
});
</script>

<template>
  <div class="approved">
    <div class="main-header">
      <img class="main-header__image" src="@/assets/images/declarations/envelope.png" />
      <span class="main-header__title">Underwriting Decision</span>
    </div>
    <router-view />
  </div>
</template>
<style lang="scss" scoped>
.main-header {
  margin-top: 30px;
  align-items: center;
  .main-header__title {
    font-size: 30px;
    margin-left: 10px;
    font-weight: 500;
  }
}
:deep(.variableButtonWidth) {
  width: auto !important;
}

@media (max-width: $desktop-width) {
  .main-header__title {
    font-size: 28px !important;
  }
  .main-header__image{
    width: 42px;
    height: 35px;
  }
}
@media (max-width: $tablet-width) {
  .main-header__title {
    font-size: 24px !important;
  }
  .main-header{
    margin-top: 42px;
  }

}
@media (max-width: $sm-tablet-width) {
  .main-header__title {
    font-size: 16px !important;
  }
  .main-header__image {
    width: 32px !important;
  }
}
@media (max-width: $mobile-width) {
  .main-header{
    margin-top: 24px;
  }
  .main-header__image{
    width: 32px;
    height: 26.66px;
  }
}
</style>
