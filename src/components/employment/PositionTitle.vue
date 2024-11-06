<script setup>
import PositionTitleData from "@/components/employment/positionTitle/PositionTitleData.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const routePrepend = ref("");
const statusType = ref("current");
const route = useRoute();

const nextRoute = computed(() => {
  if (statusType.value === "previous") {
    return "employmentandincome/previous-compensation-details";
  }
  return `employmentandincome/${routePrepend.value}contact-details`;
});

onBeforeMount(() => {
  const { status, classification } = route.meta;
  if (status === "Previous") {
    statusType.value = "previous";
  }
  if (status !== "Current" || classification !== "Primary") {
    routePrepend.value =
      status !== "Current" ? `${status.toLowerCase()}-` : "additional-";
  }
});
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter the details for your {{ statusType }} Position{{
          statusType === "previous" ? "" : "/Title"
        }}
      </div>
    </div>
    <v-form class="fast-fail form-outer-container">
      <v-row class="form-container">
        <PositionTitleData></PositionTitleData>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :RequestedNextPath="nextRoute"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.form-container {
  margin: -10px !important;
}
</style>
