<script setup>
import { computed, defineProps, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import Declarations_2 from "@/components/images/declarations/Declarations2.vue";

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

const setDeclarationsProp = (value) => {
  const Declarations = {
    ...props.declarations,
    HomeownerPastThreeYearsType: value,
  };
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const nextRoute = computed(() => {
  return props.declarations.HomeownerPastThreeYearsType === "Yes"
    ? "declarations/_3"
    : "declarations/_5";
});

const homeOwnerPastThreeYearsTypeValue = computed(() => {
  if (props.declarations.HomeownerPastThreeYearsType === null) {
    return null;
  } else {
    return props.declarations.HomeownerPastThreeYearsType;
  }
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text">
        Have you had an ownership in another property in the last 3 years?
      </div>
      <Declarations_2 />

      <v-form class="my-5">
        <AgreeToggle
          :options="options"
          :value="homeOwnerPastThreeYearsTypeValue"
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