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
    PriorPropertyShortSaleCompletedIndicator: bool,
  };
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const priorPropertyShortSaleCompletedIndicatorValue = computed(() => {
  if (props.declarations.PriorPropertyShortSaleCompletedIndicator === null) {
    return null;
  } else {
    return props.declarations.PriorPropertyShortSaleCompletedIndicator;
  }
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Within the past 7 years, have you completed a pre-foreclosure sale or short sale,
        whereby the property was sold to a third party and the Lender agreed to accept
        less than the outstanding mortgage balance due?
      </div>
      <Declarations_8 />
      <v-form class="my-5">
        <AgreeToggle
          :value="priorPropertyShortSaleCompletedIndicatorValue"
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
