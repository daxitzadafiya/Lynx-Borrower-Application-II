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

const types = ref([
  {
    title: "Primary Residence",
  },
  {
    title: "Second Home",
  },
  {
    title: "Investment",
  },
  {
    title: "FHA Secondary Residence",
  },
]);
let imageList = await Promise.all([
  import("@/assets/images/loan-property/primary-residence.svg"),
  import("@/assets/images/loan-property/second-home.svg"),
  import("@/assets/images/loan-property/investment-property.svg"),
  import("@/assets/images/loan-property/secondary-residence.svg"),
]);

types.value.map((type, index) => (type.src = imageList[index].default));

const setDeclarationsProp = (type) => {
  const Declarations = {
    ...props.declarations,
    PriorPropertyUsageType: type?.replace(/ /g, ""),
  };
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const isNextDisabled = computed(() => {
  return !props.declarations.PriorPropertyUsageType;
});
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">What type of property did you own?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="declarations.PriorPropertyUsageType"
        @update:model-value="setDeclarationsProp"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="(item, index) in types"
            :key="index"
            :smVal="6"
            :mdVal="4"
            :lgVal="3"
            :value="item.title.replace(/ /g, '')"
          >
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
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
