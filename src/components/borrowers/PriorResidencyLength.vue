<script setup>
import { ref,watch,computed } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore.js";
import { residencyLength } from "@/mixins/residencyLength.js";
import { number } from "@/mixins/onlyNum";

const { isOnlyNum } = number();
const { updatePeriod } = residencyLength()
const borrowersStore = useBorrowersStore();

const type = ref("Prior");

const priorResidence = ref( borrowersStore.getSpecificResidence("Prior"))

watch(
  () => borrowersStore.Borrower,
  (newValue) => {
    priorResidence.value = borrowersStore.getSpecificResidence("Prior");
  },
  { deep: true }
);

const period = computed(() => {
  let result = { years: "", months: "" };
  if (priorResidence.value.ResidencyDurationMonthsCount) {
    if (priorResidence.value.ResidencyDurationMonthsCount >= 12) {
      const years =
        Math.floor(+priorResidence.value.ResidencyDurationMonthsCount / 12) || "";
      const months = priorResidence.value.ResidencyDurationMonthsCount % 12 || "";
      result = { years, months };
    } else {
      result.months = priorResidence.value.ResidencyDurationMonthsCount;
    }
  }
  return result;
});

const isNextButtonDisabled = computed(() => {
  return period.value.years == '' || period.value.months == '';
});

</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        How long have you lived at
        {{ priorResidence ? priorResidence.AddressLineText : "" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
          <TextBox placeholder="Years" :value="period.years" isRequired pattern="[0-9]*" @keypress="(e) => isOnlyNum(e)"  @change="(e) => updatePeriod(e, 'years', type, period)"/>
          <TextBox placeholder="Months" :value="period.months" isRequired pattern="[0-9]*" @keypress="(e) => isOnlyNum(e)"  @change="(e) => updatePeriod(e, 'months', type, period)"/>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextButtonDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (max-width: $tablet-width) {
  .text-block {
    &__row {
      &:last-child {
        justify-content: flex-start;
      }
    }
  }
}

@media (max-width: $mobile-width) {
  .text-block {
    &__row {
      &:last-child {
        justify-content: space-between;
      }
    }
  }
}
</style>
