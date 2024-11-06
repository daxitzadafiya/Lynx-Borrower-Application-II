<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import ContactDetailsData from "@/components/employment/contactDetails/ContactDetailsData.vue";
const statusType = ref("current");
const routePrepend = ref("");
const route = useRoute();

const nextRoute = computed(() => {
  return `employmentandincome/${routePrepend.value}compensation-types`;
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
        Please provide the contact information for your {{ statusType }} employer
      </div>
    </div>
    <v-form class="fast-fail form-outer-container">
      <v-row class="form-container">
        <ContactDetailsData></ContactDetailsData>
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