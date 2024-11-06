<script setup>
import { ref, computed } from "vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useBorrowersStore } from "@/stores/borrowersStore.js";
import { number } from "@/mixins/onlyNum";

const type = ref("Current");
const { getSpecificResidence, updateResidenceProp } = useBorrowersStore();
const currentResidence = computed(() => {
  return getSpecificResidence("Current");
});

const { isOnlyNum } = number();
const isNextButtonDisabled = computed(() => {
  return (
    currentResidence.value.MonthlyRentAmount == null ||
    currentResidence.value.MonthlyRentAmount.length === 0
  );
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        How much do you pay in rent
        {{ currentResidence ? `at ${currentResidence.AddressLineText}` : "per month" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
          <TextBox
            isRequired
            placeholder="Monthly Rent $"
            :value="getFormattedValue(currentResidence.MonthlyRentAmount)"
            @input="
              (e) => {
                const value =
                  typeof e === 'string'
                    ? e.replace(/,/g, '')
                    : e.target.value.replace(/,/g, '');
                updateResidenceProp({
                  type,
                  value: +value,
                  prop: 'MonthlyRentAmount',
                });
              }
            "
            @keypress="(e) => isOnlyNum(e, true)"
          />
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="isNextButtonDisabled"
      ></NavigationButtons>
    </div>
  </div>
</template>