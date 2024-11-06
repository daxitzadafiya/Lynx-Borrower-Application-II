<script setup>
import { ref, computed } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const borrowersStore = useBorrowersStore();

const otherLiabilityTypes = ref([
  {
    title: "Alimony",
  },
  {
    title: "Child Support",
  },
  {
    title: "Other",
  },
  {
    title: "Separation Maintenance",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/credit/gavel.svg"),
  import("@/assets/images/credit/child.svg"),
  import("@/assets/images/credit/money_stack.svg"),
  import("@/assets/images/credit/separation_maintenance.svg"),
]);

otherLiabilityTypes.value.map(
  (liability, index) => (liability.src = imageList[index].default)
);

const addLiabilityType = (titles) => {
  let newOtherLiabilitiesAndExpenses = [...otherLiabilities.value];
  if (titles.length > otherExpenseTypes.value.length) {
    let title = titles.filter((x) => !otherExpenseTypes.value.includes(x));
    newOtherLiabilitiesAndExpenses.push({ ExpenseType: title[0] });
  } else {
    while (
      newOtherLiabilitiesAndExpenses.findIndex((x) => !titles.includes(x.ExpenseType)) !==
      -1
    ) {
      newOtherLiabilitiesAndExpenses.splice(
        newOtherLiabilitiesAndExpenses.findIndex((x) => !titles.includes(x.ExpenseType)),
        1
      );
    }
  }
  borrowersStore.updateBorrower({
    prop: "OtherLiabilitiesAndExpenses",
    value: newOtherLiabilitiesAndExpenses,
  });
};

const otherLiabilities = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.OtherLiabilitiesAndExpenses
    ? borrowersStore.Borrower.OtherLiabilitiesAndExpenses
    : [];
});

const otherExpenseTypes = computed(() => {
  return otherLiabilities.value.map(x=>x.ExpenseType.replace(/ /g, ""))
}) ; 
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please select any of these other liabilities that you may have, otherwise just
        click next.
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :model-value="otherExpenseTypes" multiple="multiple" @update:modelValue="value=>{addLiabilityType(value)}">
        <v-row class="form-container">
          <ToggleCard
            v-for="(item, index) in otherLiabilityTypes"
            :smVal="3"
            :key="index"
            :value="item.title.replace(/ /g, '')"
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
</style>
