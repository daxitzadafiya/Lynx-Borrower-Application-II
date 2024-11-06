<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";

const types = ref([
  {
    title: "Primary Residence",
  },
  {
    title: "Second/Vacation Home",
  },
  {
    title: "Investment",
  },
]);
  let imageList = await Promise.all([
    import("@/assets/images/loan-property/primary-residence.svg"),
    import("@/assets/images/loan-property/second-home.svg"),
    import("@/assets/images/loan-property/investment-property.svg"),
  ]);
  types.value.map((status, index) => (status.src = imageList[index].default));

const loanPropertyStore = useLoanPropertyStore();
const Property = ref(loanPropertyStore.getProperty());

const activeType = computed(() => {
  const type = Property.value ? Property.value.PropertyUsageType : "";
  if (type) {
    return type.substring(0, 3) === "FHA"
      ? `${type.substring(0, 3)} ${type.substring(3).replace(/([a-z])([A-Z])/g, "$1 $2")}`
      : type.replace(/([a-z])([A-Z])/g, "$1 $2");
  }
  return "";
});

watch(
  () => loanPropertyStore.property,
  (newValue) => {
    Property.value = newValue;
  },
  { deep: true }
);

const setOccupancy = (title) => {
  const isFHA = title === "FHA Secondary Residence";
  let property = Property.value
    ? {
        ...Property.value,
        PropertyUsageType: title ? title.replace(/ /g, "") : "",
      }
    : { PropertyUsageType: title ? title.replace(/ /g, "") : "" };
  if (isFHA) {
    property.FHASecondaryResidenceIndicator = true;
  } else {
    delete property.FHASecondaryResidenceIndicator;
  }
  loanPropertyStore.setProperty(property);
};
</script>
<template>
  <div class="content-container">
    <div class="content-header-container py-4">
      <div class="header-text">How will you occupy this property?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :model-value="activeType" @update:modelValue="value=>{setOccupancy(value)}"> 
        <v-row class="form-container">
          <ToggleCard
            v-for="({ src, title }, index) in types"
            :key="index"
            :value="title"
          >
            <inline-svg
              :src="src"
              :class="title === 'None' ? 'stroked' : ''"
            ></inline-svg>
            <p>{{ title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="!activeType"></NavigationButtons>
    </div>
  </div>
</template>
<style scoped lang="scss">
.v-btn-group--density-default.v-btn-group {
  height: auto;
}
</style>
