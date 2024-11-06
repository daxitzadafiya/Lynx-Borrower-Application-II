<script setup>
import Declarations_8 from "@/components/images/declarations/Declarations8.vue";
import { computed, defineProps } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const borrowersStore = useBorrowersStore();

const props = defineProps({
  declarations: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const setDeclarationsProp = (bool) => {
  const Declarations = {
    ...props.declarations,
    UndisclosedMortgageApplicationIndicator: bool,
  };
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const undisclosedMortgageApplicationIndicatorValue = computed(() => {
  if (props.declarations.UndisclosedMortgageApplicationIndicator === null) {
    return null;
  } else {
    return props.declarations.UndisclosedMortgageApplicationIndicator;
  }
});
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Have you or will you be applying for a mortgage loan on another property (not the
        property securing this loan) on or before closing this transaction that is not
        disclosed on this loan application?
      </div>
      <Declarations_8 />
      <v-form class="my-5">
        <AgreeToggle
          :value="undisclosedMortgageApplicationIndicatorValue"
          @input="setDeclarationsProp"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    width: auto;
    height: auto;
    margin: 20px 0;
    max-height: 375px;
    @media (max-width: $mobile-width) {
      width: 100%;
    }
  }
}
.v-btn-group--density-default.v-btn-group {
  padding: 0;
  overflow: visible;
}
</style>