<script setup>
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, defineProps, ref } from "vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";

const borrowersStore = useBorrowersStore();
const loanPropertyStore = useLoanPropertyStore();

const props = defineProps({
  declarations: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const options = ref([
  {
    title: "By Yourself",
    value: "Sole",
  },
  {
    title: "Jointly With Spouse",
    value: "JointWithSpouse",
  },
  {
    title: "Jointly With Another Person",
    value: "JointWithOtherThanSpouse",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/borrowers/unmarried.svg"),
  import("@/assets/images/declarations/with-spouse.svg"),
  import("@/assets/images/declarations/with-another.svg"),
]);

options.value.map((option, index) => (option.src = imageList[index].default));

const setDeclarationsProp = (type) => {
  const Declarations = {
    ...props.declarations,
    PriorPropertyTitleType: type.replace(/ /g, ""),
  };
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const computedNextRoute = computed(() => {
  return loanPropertyStore.getLoanPurposeType() === "Refinance"
    ? "/declarations/_6"
    : "/declarations/_5";
});

const isNextDisabled = computed(() => {
  return !props.declarations.PriorPropertyTitleType;
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">How did you hold title on this property?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="declarations.PriorPropertyTitleType"
        @update:model-value="setDeclarationsProp"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="(item, index) in options"
            :key="index"
            :smVal="4"
            :value="item.value"
          >
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :RequestedNextPath="computedNextRoute"
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
</style>
