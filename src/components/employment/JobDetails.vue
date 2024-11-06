<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import JobDetailsData from "@/components/employment/JobDetails/JobDetailsData.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const routePrepend = ref("");
const status = ref("current");
const classifications = ref("");
const route = useRoute();
const borrowersStore = useBorrowersStore();

const isFormValid = computed(() => {
  const emp = currentEmployment.value;
  const isBasicInfoValid =
    emp.EmploymentPositionDescription !== "" &&
    emp.EmploymentStartDate !== null &&
    (duration.value.years !== 0 || duration.value.months !== 0) &&
    emp.FullName !== "";
  const isSelfEmployedValid =
    emp.EmploymentBorrowerSelfEmployedIndicator !== null &&
    ((emp.EmploymentBorrowerSelfEmployedIndicator === false &&
      emp.EmployedByFamilyMember !== null &&
      emp.EmployedByPartyToTransaction !== null) ||
      (emp.EmploymentBorrowerSelfEmployedIndicator === true &&
        !isNaN(emp.EmploymentMonthlyIncomeAmount) &&
        emp.EmploymentMonthlyIncomeAmount !== 0 &&
        emp.OwnershipInterestType !== undefined));
  return isBasicInfoValid && isSelfEmployedValid;
});

const currentEmployment = computed(() => {
  if (borrowersStore.getBorrowerEmployment().length) {
    const employment = borrowersStore
      .getBorrowerEmployment()
      .find(
        (item) =>
          item.EmploymentClassificationType === "Primary" &&
          item.EmploymentStatusType === "Current"
      );
    return employment || {};
  }
  return {};
});

const duration = computed(() => {
  let years = 0;
  let months = 0;
  if (currentEmployment.value.EmploymentTimeInLineOfWorkMonthsCount) {
    months = currentEmployment.value.EmploymentTimeInLineOfWorkMonthsCount % 12;
    years = (currentEmployment.value.EmploymentTimeInLineOfWorkMonthsCount - months) / 12;
  }
  return { years, months };
});

onBeforeMount(() => {
  const { status: routeStatus, classification: routeClassification } = route.meta;
  if (routeStatus === "Previous") {
    status.value = "previous";
  } else {
    status.value = routeStatus;
  }

  if (routeStatus !== "Current" || routeClassification !== "Primary") {
    routePrepend.value =
      routeStatus !== "Current" ? `${routeStatus.toLowerCase()}-` : "additional-";
  }

  classifications.value = routeClassification;
});

</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the details for your {{ status }} job</div>
    </div>
    <JobDetailsData
      status="Current"
      classification="Primary"
      :isEmploymentTypeAndPartyTransaction="true"
    ></JobDetailsData>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="!isFormValid"></NavigationButtons>
    </div>
  </div>
</template>
