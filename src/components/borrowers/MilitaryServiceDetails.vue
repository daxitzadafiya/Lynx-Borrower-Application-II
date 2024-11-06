<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { military } from "@/mixins/military.js";

const borrowersStore = useBorrowersStore();
const { toggleService, updateExpirationDate, cancelDate, isServing, isRetired, isPeriod } = military();

const toggle = (value, bool) => {
  if (bool == "isSpouse") {
    toggleService(bool, isSpouse.value);
  } else {
    toggleService(bool, value);
  }
};

const currentBorrower = ref(null);

onMounted(() => {
  currentBorrower.value = borrowersStore.Borrower;
});

watch(
  () => borrowersStore.Borrower,
  (newValue) => {
    currentBorrower.value = newValue;
  },
  { deep: true }
);

const isSpouse = computed(() => {
  return currentBorrower.value?.SpousalVABenefitsEligibilityIndicator || false;
});

const isPicker = computed(() => {
  const activeType = currentBorrower.value?.MilitaryServices?.find(
    (item) => item.MilitaryStatusType === "ActiveDuty"
  );
  return !!activeType;
});

const isDisabled = computed(() => {
  const activeType = currentBorrower.value?.MilitaryServices?.find(
    (item) => item.MilitaryStatusType === "ActiveDuty"
  );
  return activeType && !activeType.MilitaryServiceExpectedCompletionDate;
});

const selectedDate = computed(() => {
  const activeType = currentBorrower.value?.MilitaryServices?.find(
    (item) => item.MilitaryStatusType === "ActiveDuty"
  );
  return activeType == null ? new Date() : activeType.MilitaryServiceExpectedCompletionDate;
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select all that apply</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <v-col class="itemContainer" cols="12" sm="12">
          <CheckBox label="Currently serving on active duty with projected expitation date of service/tour"
            @toggle="toggle($event, 'isServing')" hideDetails id="checkbox1" :isChecked="isServing"></CheckBox>
          <v-row class="form-container ml-5 itemContainer pt-3" v-if="isPicker">
            <DateInput isRequired placeholder="Projected expiration date" @dateUpdated="updateExpirationDate"
              @dateCleared="cancelDate" :value="selectedDate" class="pt-3"></DateInput>
          </v-row>
        </v-col>
        <v-col class="itemContainer" cols="12" sm="12">
          <CheckBox label="Currently retired, discharged, or seperated from service"
            @toggle="toggle($event, 'isRetired')" hideDetails id="checkbox2" :isChecked="isRetired"></CheckBox>
        </v-col>
        <v-col class="itemContainer" cols="12" sm="12">
          <CheckBox label="Only period of service was as a non-activated member of the Reserve or National Guard"
            hideDetails id="checkbox3" @toggle="toggle($event, 'isPeriod')" :isChecked="isPeriod"></CheckBox>
        </v-col>
        <v-col class="itemContainer" cols="12" sm="12">
          <CheckBox label="Surviving spouse" hideDetails id="checkbox4" :isChecked="isSpouse"
            @toggle="toggle($event, 'isSpouse')"></CheckBox>
        </v-col>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isDisabled"></NavigationButtons>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(.form-container .itemContainer) {
  padding: 10px 10px 10px 12px !important;
}

:deep(.v-input__control label) {
  font-size: 1rem;
  line-height: 20px;
  height: auto;
}
:deep(.v-checkbox .v-selection-control) {
  align-items: center !important;
  gap: 3px !important;
  min-height: auto !important;
}
:deep(.v-selection-control__input > .v-icon) {
  font-size: 20px;
}
:deep(.v-selection-control__wrapper),
:deep(.v-selection-control__input) {
  width: 35px !important;
  height: 35px;
}
</style>
