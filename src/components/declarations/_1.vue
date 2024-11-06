<script setup>
import Declarations_1 from "@/components/images/declarations/Declarations1.vue";
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

const options = ref([
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
]);

const setDeclarationsProp = (val) => {
  let Declarations = { ...props.declarations, IntentToOccupyType: val };
  if (val === "No") {
    delete Declarations.HomeownerPastThreeYearsType;
    delete Declarations.PriorPropertyUsageType;
    delete Declarations.PriorPropertyTitleType;
  }
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const nextRoute = computed(() => {
  return props.declarations.IntentToOccupyType === "Yes"
    ? "declarations/_2"
    : "declarations/_5";
});

const intentToOccupyTypeValue = computed(() => {
  if (props.declarations.IntentToOccupyType === null) {
    return null;
  } else {
    return props.declarations.IntentToOccupyType;
  }
});

</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text">
        Will you occupy the property as your primary residence?
      </div>
      <Declarations_1 />
      <v-form class="text-block my-5">
        <AgreeToggle
          :options="options"
          :value="intentToOccupyTypeValue"
          @input="setDeclarationsProp"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :RequestedNextPath="nextRoute"></NavigationButtons>
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