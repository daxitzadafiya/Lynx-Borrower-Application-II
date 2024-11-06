<script setup>
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { useEmployMentStore } from "@/stores/employmentStore";

const route = useRoute();

const percentages = ref([
  {
    title: "My Ownership Share is < 25%",
  },
  {
    title: "My Ownership Share is 25% or Greater",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/employment/ownership-share.svg"),
  import("@/assets/images/employment/ownership-share.svg"),
]);

percentages.value.map((type, index) => (type.src = imageList[index].default));

const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const statusType = ref("Current");
const classificationType = ref("Primary");
const routePrepend = ref("");

const setPercentage = (percentage) => {
  const interest =
    percentage === "My Ownership Share is 25% or Greater"
      ? "GreaterThanOrEqualTo25Percent"
      : "LessThan25Percent";
  if (currentEmployment.value.EmploymentClassificationType === "Secondary") {
    return setAdditionalEmploymentPercentage(interest);
  } else if (
    currentEmployment.value.EmploymentClassificationType &&
    currentEmployment.value.EmploymentClassificationType !== "Secondary"
  ) {
    const Employment = borrowersStore.getBorrowerEmployment().map((item) => {
      if (
        item.EmploymentClassificationType === classificationType.value &&
        item.EmploymentStatusType === statusType.value
      ) {
        item.OwnershipInterestType = interest;
      }
      return item;
    });
    borrowersStore.updateBorrower({ prop: "Employment", value: Employment });
  } else {
    borrowersStore.updateBorrower({
      prop: "Employment",
      value: [
        ...borrowersStore.getBorrowerEmployment(),
        {
          EmploymentStatusType: statusType.value,
          EmploymentClassificationType: classificationType.value,
          OwnershipInterestType: interest,
        },
      ],
    });
  }
};

const setAdditionalEmploymentPercentage = (interest) => {
  let additional = [...employmentStore.getAdditionalEmployments()];
  additional[employmentStore.getAdditionalEmploymentIndex()] = {
    ...currentEmployment.value,
    OwnershipInterestType: interest,
  };
  const filtered = borrowersStore.getBorrowerEmployment().length
    ? borrowersStore.getBorrowerEmployment().filter((item) => item.EmploymentClassificationType !== "Secondary")
    : [];
  borrowersStore.updateBorrower({
    prop: "Employment",
    value: [...filtered, ...additional],
  });
};

const handleRouteMeta = () => {
  const { status, classification } = route.meta;
  statusType.value = status;
  classificationType.value = classification;
  if (status !== "Current" || classification !== "Primary") {
    routePrepend.value =
      status !== "Current" ? `${status.toLowerCase()}-` : "additional-";
  }
};

const currentEmployment = computed(() => {
  if (classificationType.value === "Secondary") {
    return (
      employmentStore.getAdditionalEmployments()[
        employmentStore.getAdditionalEmploymentIndex()
      ] || {
        EmploymentClassificationType: "Secondary",
      }
    );
  }
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

const percentage = computed(() => {
  if (currentEmployment.value.OwnershipInterestType == undefined) return "";
  return currentEmployment.value.OwnershipInterestType === "GreaterThanOrEqualTo25Percent"
    ? "My Ownership Share is 25% or Greater"
    : "My Ownership Share is < 25%";
});

onBeforeMount(() => {
  handleRouteMeta();
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Since you've indicated you're self employed, please select your ownership
        percentage
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="percentage"
        @update:model-value="setPercentage"
      >
        <v-row class="form-container">
          <ToggleCard v-for="item in percentages" :key="item.title" :value="item.title">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="!percentage"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-btn-group--density-default.v-btn-group) {
  height: 100% !important;
}

.form-container {
  margin: -10px -10px !important;
}
</style>
