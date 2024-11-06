<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";

const types = ref([
  {
    title: "Base",
  },
  {
    title: "Overtime",
  },
  {
    title: "Bonus",
  },
  {
    title: "Commission",
  },
  {
    title: "Other",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/employment/base.svg"),
  import("@/assets/images/employment/overtime.svg"),
  import("@/assets/images/employment/bonus.svg"),
  import("@/assets/images/employment/commission.svg"),
  import("@/assets/images/employment/other.svg"),
]);

types.value.map((type, index) => (type.src = imageList[index].default));

const statusType = ref("Current");
const classificationType = ref("Primary");
const routePrepend = ref("");
const route = useRoute();
const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();

const setTypes = (types) => {
  let Income = currentEmployment.value.Income || [];
  let position = types.findIndex(
    (x) => Income.findIndex((y) => y.IncomeType === x) === -1
  );
  if (position !== -1) {
    Income.push({ IncomeType: types[position], EmploymentIncomeIndicator: true });
  } else {
    position = Income.findIndex((x) => !types.includes(x.IncomeType));
    Income.splice(position, 1);
  }
  updateEmploymentIncome(Income);
};

const updateEmploymentIncome = (Income) => {
  if (currentEmployment.value.EmploymentClassificationType === "Secondary") {
    return setAdditionalEmploymentType(Income);
  } else if (
    currentEmployment.value.EmploymentClassificationType &&
    currentEmployment.value.EmploymentClassificationType !== "Secondary"
  ) {
    const employments = borrowersStore.getBorrowerEmployment().map((item) => {
      return item.EmploymentClassificationType === classificationType.value &&
        item.EmploymentStatusType === statusType.value
        ? { ...item, Income }
        : item;
    });
    return borrowersStore.updateBorrower({ prop: "Employment", value: employments });
  }
  borrowersStore.updateBorrower({
    prop: "Employment",
    value: [
      ...borrowersStore.getBorrowerEmployment(),
      {
        EmploymentStatusType: statusType.value,
        EmploymentClassificationType: classificationType.value,
        Income,
      },
    ],
  });
};

const setAdditionalEmploymentType = (Income) => {
  let additional = [...employmentStore.getAdditionalEmployments()];
  additional[employmentStore.getAdditionalEmploymentIndex()] = {
    ...currentEmployment.value,
    Income,
  };
  const filtered = borrowersStore.getBorrowerEmployment().length
    ? borrowersStore
        .getBorrowerEmployment()
        .filter((item) => item.EmploymentClassificationType !== "Secondary")
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

const typesTitles = computed(() => {
  if (!currentEmployment.value.Income) return [];
  return currentEmployment.value.Income.map((item) => item.IncomeType);
});

onBeforeMount(() => {
  handleRouteMeta();
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please select the types of compensation you receive from
        {{ currentEmployment.FullName || "your current employment" }}
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="typesTitles"
        multiple="multiple"
        @update:modelValue="setTypes"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="(item, index) in types"
            :key="index"
            :value="item.title"
            mdVal=""
            smVal="4"
          >
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
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