<script setup>
import { computed, ref, watch } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore.js";
import { residencyLength } from "@/mixins/residencyLength.js";
import { number } from "@/mixins/onlyNum";

const { isOnlyNum } = number();
const { updatePeriod } = residencyLength()
const borrowersStore = useBorrowersStore();
const type = ref("Current");

const currentResidence = ref(borrowersStore.getSpecificResidence("Current"));

watch(
  () => borrowersStore.Borrower,
  (newValue) => {
    currentResidence.value = borrowersStore.getSpecificResidence("Current");
  },
  { deep: true }
);

const period = computed(() => {
  let result = { years: "", months: "" };
  if (currentResidence.value.ResidencyDurationMonthsCount) {
    if (currentResidence.value.ResidencyDurationMonthsCount >= 12) {
      const years = Math.floor(+currentResidence.value.ResidencyDurationMonthsCount / 12) || "";
      const months = currentResidence.value.ResidencyDurationMonthsCount % 12 || "";
      result = { years, months };
    } else {
      result.months = currentResidence.value.ResidencyDurationMonthsCount;
    }
  }
  return result;
});

const isNextButtonDisabled = computed(() => {
  return period.value.years == '' && period.value.months == '';
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">How long have you lived at {{ currentResidence ? currentResidence.AddressLineText : '' }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
          <TextBox 
            placeholder="Years"
            :value="period.years"
            isRequired
            pattern="[0-9]*"
            @change="(e) => updatePeriod(e, 'years', type, period)"
            @keypress="(e) => isOnlyNum(e)"
          />
          <TextBox 
            placeholder="Months"
            :value="period.months"
            isRequired
            pattern="[0-9]*"
            @change="(e) => updatePeriod(e, 'months', type, period)"
            @keypress="(e) => isOnlyNum(e)"
          />
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextButtonDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .text-block {
    &__row {
      &:last-child {
        justify-content: flex-start;
      }
    }
  }
}

@media (max-width: 450px) {
  .text-block {
    &__row {
      &:last-child {
        justify-content: space-between;
      }
    }
  }
}
</style>
