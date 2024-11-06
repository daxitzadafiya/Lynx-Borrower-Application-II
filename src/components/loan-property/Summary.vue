<script setup>
import Loan from "./summaries/Loan.vue";
import Property from "./summaries/Property.vue";
import OtherLoans from "./summaries/OtherLoans.vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { watch, ref, computed } from 'vue'
import { loanPatch } from '@/mixins/loanPatch';

const loanPropertyStore = useLoanPropertyStore();
const property = ref(loanPropertyStore.getProperty());
const { saveAndAdvance } = loanPatch();
watch(
  () => loanPropertyStore.property,
  (newValue) => {
    property.value = newValue;
  },
  { deep: true }
);

const mortgages = computed(() => {
  return property.value && property.value.OtherNewMortgageLoans
    ? property.value.OtherNewMortgageLoans
    : [];
});
</script>

<template>
  <div class="loan-data">
    <Property :Property="property"/>
    <Loan />
   <OtherLoans :Property="property" v-if="mortgages.length!=0"/>

  </div>
  <div class="d-flex w-100 justify-end mt-5 pt-3">
    <CustomButton value="Go to next section" customClass="primary-button" width="auto" @onHandleClick="() => saveAndAdvance(true)">
    </CustomButton>
  </div>
</template>
