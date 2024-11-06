<script setup>
import JobDetailsData from "@/components/employment/JobDetails/JobDetailsData.vue";
import { computed } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const borrowersStore = useBorrowersStore();

const isFormValid = computed(() => {
  const emp = currentEmployment.value;
  const isBasicInfoValid =
    emp.EmploymentPositionDescription !== "" &&
    emp.EmploymentStartDate !== null &&
    emp.EmploymentEndDate !== null &&
    emp.FullName !== "" &&
    !isNaN(emp.EmploymentMonthlyIncomeAmount);
  return isBasicInfoValid;
});

const currentEmployment = computed(() => {
  if (borrowersStore.getBorrowerEmployment().length) {
    const employment = borrowersStore
      .getBorrowerEmployment()
      .find(
        (item) =>
          item.EmploymentClassificationType === "Primary" &&
          item.EmploymentStatusType === "Previous"
      );
    return employment || {};
  }
  return {};
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter your previously Employment Details</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <JobDetailsData status="Previous" classification="Primary" />
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="!isFormValid"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.form-container {
  margin: -10px !important;
}

@media (max-width: $mobile-width) {
  .form-container {
    padding: 30px 20px;
  }
}
</style>
