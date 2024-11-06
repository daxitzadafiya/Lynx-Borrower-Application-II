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
    PropertyProposedCleanEnergyLienIndicator: bool,
  };
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const propertyProposedCleanEnergyLienIndicatorValue = computed(() => {
  if (props.declarations.PropertyProposedCleanEnergyLienIndicator === null) {
    return null;
  } else {
    return props.declarations.PropertyProposedCleanEnergyLienIndicator;
  }
});
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Will this property be subject to a lien that could take priority over the first
        mortgage lien, such as a clean energy lien paid through your property taxes (e.g.,
        the Property Assessed Clean Energy Program)?
      </div>
      <Declarations_8 />
      <v-form class="my-5">
        <AgreeToggle
          :value="propertyProposedCleanEnergyLienIndicatorValue"
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