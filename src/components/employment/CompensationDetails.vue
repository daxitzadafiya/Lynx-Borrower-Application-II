<script setup>
import CompensationDetailsData from "@/components/employment/compensationDetails/CompensationDetailsData.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useRoute } from "vue-router";

const borrowersStore = useBorrowersStore();
const route = useRoute();
const statusType = ref("Current");
const classificationType = ref("Primary");

const currentEmployment = computed(() => {
  if (borrowersStore.getBorrowerEmployment().length) {
    const employment = borrowersStore
      .getBorrowerEmployment()
      .find(
        (item) =>
          item.EmploymentClassificationType === classificationType.value &&
          item.EmploymentStatusType === statusType.value
      );
    return employment || {};
  }
  return {};
});
onBeforeMount(() => {
  const { status, classification } = route.meta;
  statusType.value = status;
  classificationType.value = classification;
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter the gross monthly income for each compensation type you provided
      </div>
    </div>
    <v-form class="fast-fail form-outer-container">
      <CompensationDetailsData></CompensationDetailsData>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
