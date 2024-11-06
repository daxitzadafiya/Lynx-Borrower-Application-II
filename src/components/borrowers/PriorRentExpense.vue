<script setup>
import { computed, ref } from "vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useBorrowersStore } from "@/stores/borrowersStore.js";
import { number } from "@/mixins/onlyNum";

const type = ref("Prior");
const { getSpecificResidence, updateResidenceProp } = useBorrowersStore();
const currentResidence = computed(() => {
  return getSpecificResidence("Prior");
});
const { isOnlyNum } = number();
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        How much do you pay in rent
        {{ currentResidence.AddressLineText ? `at ${currentResidence.AddressLineText}` : "per month" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
          <TextBox
            placeholder="Monthly Rent, $"
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
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>