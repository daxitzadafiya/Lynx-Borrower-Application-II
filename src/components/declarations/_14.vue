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
    PartyToLawsuitIndicator: bool,
  };
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const partyToLawsuitIndicatorValue = computed(() => {
  if (props.declarations.PartyToLawsuitIndicator === null) {
    return null;
  } else {
    return props.declarations.PartyToLawsuitIndicator;
  }
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Are you a party to a lawsuit in which you potentially have any personal financial
        liability?
      </div>
      <Declarations_8 />
      <v-form class="my-5">
        <AgreeToggle
          :value="partyToLawsuitIndicatorValue"
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
