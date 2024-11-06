<script setup>
import { computed, ref } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useBorrowersStore } from "@/stores/borrowersStore";

const realEstateStore = useRealEstateStore();
const borrowersStore = useBorrowersStore();

const expenses = ref([
  {
    title: "Insurance",
    prop: "PropertyInsuranceExpenseAmount",
  },
  {
    title: "Taxes",
    prop: "PropertyTaxesExpenseAmount",
  },
  {
    title: "Association Dues",
    prop: "PropertyAssociationDuesExpenseAmount",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/real-estate/insurance.svg"),
  import("@/assets/images/real-estate/taxes.svg"),
  import("@/assets/images/real-estate/association-dues.svg"),
]);

expenses.value.map((type, index) => (type.src = imageList[index].default));

const realEstateProps = computed(() => {
  return Object.keys(currentRealEstate.value);
});

const currentRealEstate = computed(() => {
  const realEstates = realEstateStore.getRealEstate();
  const index = realEstateStore.getRealEstateEditingIndex();
  return realEstates[index] || {};
});

const isAnyExpense = computed(() => {
  return (
    "PropertyInsuranceExpenseAmount" in currentRealEstate.value ||
    "PropertyTaxesExpenseAmount" in currentRealEstate.value ||
    "PropertyMaintenanceExpenseAmount" in currentRealEstate.value
  );
});

const setRealEstateExpense = (props) => {
  let realEstate = { ...currentRealEstate.value };

  const expenseProps = expenses.value.map((e) => e.prop);

  expenseProps.forEach((prop) => {
    if (props.includes(prop)) {
      if (!(prop in realEstate)) {
        realEstate[prop] = "0";
      }
    } else {
      if (prop in realEstate) {
        delete realEstate[prop];
      }
    }
  });

  let realEstates = [...realEstateStore.getRealEstate()];
  const index = realEstateStore.getRealEstateEditingIndex();
  realEstates[index] = realEstate;
  realEstateStore.setRealEstate(realEstates);

  borrowersStore.setRealEstateOwnedExpenses(isAnyExpense.value);
};
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please select all the monthly expenses associated with
        {{ currentRealEstate.AddressLineText || "this property" }}
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="realEstateProps"
        multiple
        @update:model-value="setRealEstateExpense"
      >
        <v-row class="form-container">
          <ToggleCard v-for="(item, index) in expenses" :key="index" :value="item.prop">
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
