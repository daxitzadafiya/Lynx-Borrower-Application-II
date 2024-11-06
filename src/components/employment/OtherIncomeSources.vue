<script setup>
import { computed, ref } from "vue";
import { useEmployMentStore } from "@/stores/employmentStore";
import { useBorrowersStore } from "@/stores/borrowersStore";

const employmentStore = useEmployMentStore();
const borrowersStore = useBorrowersStore();

const types = ref([
  {
    title: "Pension",
    value: "Pension",
  },
  {
    title: "Social Security",
    value: "SocialSecurity",
  },
  {
    title: "Dividends/Interest",
    value: "DividendsInterest",
  },
  {
    title: "Child Support",
    value: "ChildSupport",
  },
  {
    title: "Other",
    value: "Other",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/employment/pension1.svg"),
  import("@/assets/images/employment/social-security.svg"),
  import("@/assets/images/employment/dividends.svg"),
  import("@/assets/images/employment/child.svg"),
  import("@/assets/images/employment/loupe.svg"),
]);

types.value.map((type, index) => (type.src = imageList[index].default));

const setTypes = (types) => {
  let income = [...employmentStore.getOtherIncome()];
  let position = types.findIndex(
    (x) => income.findIndex((y) => y.IncomeType === x) === -1
  );
  if (position !== -1) {
    income.push({ IncomeType: types[position], EmploymentIncomeIndicator: true });
  } else {
    position = income.findIndex((x) => !types.includes(x.IncomeType));
    income.splice(position, 1);
  }
  borrowersStore.updateBorrower({ prop: "OtherIncome", value: income });
};

const typesTitles = computed(() => {
  return employmentStore.getOtherIncome().map((item) => item.IncomeType);
});

const nextRoute = computed(() => {
  return employmentStore.getOtherIncome().length
    ? "/employmentandincome/other-income-details"
    : "/employmentandincome/review";
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please indicate if you receive income from any other sources
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
            :value="item.value"
            lgVal=""
            :mdVal="3"
          >
            <inline-svg :src="item.src" class="noStroke"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :RequestedNextPath="nextRoute"></NavigationButtons>
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
