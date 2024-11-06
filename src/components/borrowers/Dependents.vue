<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { dependents } from "@/mixins/dependents.js";
import { number } from "@/mixins/onlyNum";

const borrowersStore = useBorrowersStore();
const { updateAges, tabToNext, updateCount } = dependents();
const { isOnlyNum } = number();

const agesCount = ref(0);
const Ages = ref(null);
const onChange = (val) => {
  let e = parseInt(val) > 9 ? 9 : parseInt(val);
  updateCount(e);
};
onMounted(() => {
  agesCount.value = borrowersStore.Borrower.Dependents?.Count;
  Ages.value = borrowersStore.Borrower.Dependents?.Ages
});

watch(
  () => borrowersStore.Borrower.Dependents,
  (newValue) => {
    agesCount.value = borrowersStore.Borrower.Dependents?.Count;
    Ages.value = borrowersStore.Borrower.Dependents?.Ages;
  },
  { deep: true }
);

const isNextButtonDisabled = computed(() => {
  if (!agesCount.value) return false;
  return !Ages.value || Ages.value.length !== agesCount.value;
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        If you have any dependents, please list how many and their ages
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container dependentsContainer">
        <TextBox placeholder="Please click next if you have no dependents" :value="agesCount || ''" pattern="[0-9]*"
          :maxNum="9" inputmode="numeric" hint="Max - 9" @onChange="onChange" @keypress="(e) => isOnlyNum(e)"
          maxLength="1" @keyup="tabToNext" />
      </v-row>
      <div v-if="agesCount">
        <div class="titleText">Please enter the age(s) of each dependent:</div>
        <v-row class="form-container agesCountContainer">
          <TextBox v-for="(age, i) in agesCount" :key="i" pattern="[0-9]*" :smVal="1" :colsVal="3" inputmode="numeric"
            class="p-10 ageInput" :value="Ages ? Ages[i] : ''" @input="(e) => updateAges(e.target.value, i)"
            @keypress="(e) => isOnlyNum(e)" :tabIndexValue="i + 1" :autoFocus="i === 0" :maximumLength="2"
            @keyup="tabToNext" />
        </v-row>
      </div>
      <div class="navigation-container">
        <NavigationButtons :ConditionsMet="isNextButtonDisabled"></NavigationButtons>
      </div>
    </v-form>
  </div>
</template>

<style lang="scss" scoped>
.ageInput {
  :deep(.v-input__slot) {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  :deep(.titleText) {
    margin-bottom: 0;
  }

  :deep(input) {
    text-align: center;
  }
}
.agesCountContainer {
  padding-top: 0 !important;
}

.dependentsContainer {
  padding-bottom: 10px !important;
}

.titleText {
  padding: 15px 30px 5px;
  @media (max-width: $tablet-width) {
    padding: 15px 20px 5px;
  }
  @media (max-width: $mobile-width) {
    padding: 15px 10px 5px;
  }
}
@media (min-width: 600px) {
  .v-col-3 {
    flex: 0 0 8.3333333333%;
    max-width: 8.3333333333%;
  }
}

.p-10 {
  padding: 10px !important;
}
</style>
