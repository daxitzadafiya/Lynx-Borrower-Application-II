<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import { useRoute } from "vue-router";

const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const route = useRoute();

const types = ref([
  { title: "W2" },
  {
    title: "Self Employed",
  },
  {
    title: "Not Employed",
  },
]);
let imageList = await Promise.all([
  import("@/assets/images/employment/w2.svg"),
  import("@/assets/images/employment/self-employed.svg"),
  import("@/assets/images/employment/retired-unemployed.svg"),
]);

types.value.map((type, index) => (type.src = imageList[index].default));

const statusType = ref("Current");
const classificationType = ref("Primary");
const routePrepend = ref("");
const isNotEmployed = ref(false);

const setType = (type) => {
  if (type === "Not Employed") {
    return handleNotEmployed();
  }
  isNotEmployed.value = false;
  const isSelfEmployed = type === "Self Employed";
  if (classificationType.value === "Secondary") {
    return setAdditionalEmploymentType(isSelfEmployed);
  } else if (
    currentEmployment.value.EmploymentClassificationType &&
    currentEmployment.value.EmploymentClassificationType !== "Secondary"
  ) {
    const Employment = borrowersStore.getBorrowerEmployment().map((item) => {
      if (
        item.EmploymentClassificationType === classificationType.value &&
        item.EmploymentStatusType === statusType.value
      ) {
        item.EmploymentBorrowerSelfEmployedIndicator = isSelfEmployed;
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
          EmploymentBorrowerSelfEmployedIndicator: isSelfEmployed,
        },
      ],
    });
  }
};

const setAdditionalEmploymentType = (isSelfEmployed) => {
  let additional = [...employmentStore.getAdditionalEmployments()];
  additional[employmentStore.getAdditionalEmploymentIndex()] = {
    ...currentEmployment.value,
    EmploymentBorrowerSelfEmployedIndicator: isSelfEmployed,
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

const handleNotEmployed = () => {
  isNotEmployed.value = true;
  const employments = borrowersStore
    .getBorrowerEmployment()
    .filter(
      (item) =>
        item.EmploymentClassificationType !== classificationType.value &&
        item.EmploymentStatusType !== statusType.value
    );
  borrowersStore.updateBorrower({ prop: "Employment", value: employments });
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

const activeType = computed(() => {
  if (isNotEmployed.value) return "Not Employed";
  if (currentEmployment.value.EmploymentBorrowerSelfEmployedIndicator == undefined) {
    return "";
  }
  return currentEmployment.value.EmploymentBorrowerSelfEmployedIndicator
    ? "Self Employed"
    : "W2";
});

const allTypes = computed(() => {
  return classificationType.value === "Primary" ? types.value : types.value.slice(0, 2);
});

const mainTitle = computed(() => {
  let result =
    "Please select your employment status below.  If you are not currently employed or receive income from other sources such as retirement, interest income, child support, then please indicate not employed.";
  if (classificationType.value === "Secondary") {
    result = "For this Additional Employment, are you earning W2 or Self Employed Wages?";
  }
  if (statusType.value === "Previous") {
    result = "Did you earn W2 or Self-Employed Wages?";
  }
  return result;
});

watch(
  () => route.meta,
  (newMeta) => {
    handleRouteMeta();
  },
  { deep: true, immediate: true }
);
onBeforeMount(() => {
  handleRouteMeta();
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">{{ mainTitle }}</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="activeType"
        @update:modelValue="setType"
      >
        <v-row class="form-container">
          <ToggleCard v-for="(item, index) in allTypes" :key="index" :value="item.title">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="!activeType"></NavigationButtons>
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
