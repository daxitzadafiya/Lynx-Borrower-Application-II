<script setup>
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, defineProps, ref } from "vue";

const borrowersStore = useBorrowersStore();

const props = defineProps({
  declarations: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const options = ref({
  No: "No",
  ChapterSeven: "Chapter 7",
  ChapterEleven: "Chapter 11",
  ChapterTwelve: "Chapter 12",
  ChapterThirteen: "Chapter 13",
});

const setDeclarationsProp = (val) => {
  let Declarations = { ...props.declarations };
  if (val === "No") {
    Declarations.BankruptcyIndicator = false;
    delete Declarations.BankruptcyChapterType;
  } else {
    Declarations.BankruptcyChapterType = val;
    Declarations.BankruptcyIndicator = true;
  }
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const curIndicatorValue = computed(() => {
  if (props.declarations.BankruptcyIndicator === false) {
    return "No";
  }
  return props.declarations.BankruptcyChapterType;
});

const isNextDisabled = computed(() =>{
    return borrowersStore.Borrower.Declarations.BankruptcyIndicator == undefined ;
});
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Have you declared bankruptcy within the past 7 years?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="curIndicatorValue"
        @update:model-value="setDeclarationsProp"
      >
        <v-row class="form-container">
          <ToggleCard v-for="(value, name) in options" :key="name" smVal="" :value="name">
            <p>{{ value }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :ConditionsMet="isNextDisabled"
      ></NavigationButtons>
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
:deep(.itemContainer .cardBtn) {
  margin-top: 0px !important;
}
</style>
