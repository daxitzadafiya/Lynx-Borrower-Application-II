<script setup>
import { computed, defineProps } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import Declarations_5 from "@/components/images/declarations/Declarations5.vue";

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
    ULADSpecialBorrowerSellerRelationshipIndicator: bool,
  };
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const uladSpecialBorrowerSellerRelationshipIndicatorValue = computed(() => {
  if (props.declarations.ULADSpecialBorrowerSellerRelationshipIndicator === null) {
    return null;
  } else {
    return props.declarations.ULADSpecialBorrowerSellerRelationshipIndicator;
  }
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Do you have a family relationship or business affiliation with the seller of the
        property?
      </div>
      <Declarations_5 />
      <v-form class="my-5">
        <AgreeToggle
          :value="uladSpecialBorrowerSellerRelationshipIndicatorValue"
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