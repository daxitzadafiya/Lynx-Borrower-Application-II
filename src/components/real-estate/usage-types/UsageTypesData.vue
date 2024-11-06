<script setup>
import { propertyCurrentUsageTypes } from "@/models/constants";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { computed, ref } from "vue";

const props = defineProps({
  index: {
    type: Number,
    default: -1,
  },
  lgVal: {
    type: Number,
  },
  mdVal: {
    type: Number,
  },
});

const types = ref(propertyCurrentUsageTypes);
const realEstateStore = useRealEstateStore();

const setUsageType = (value, prop) => {
  const realEstate = {
    ...currentRealEstate.value,
    [prop]: value,
  };
  let realEstates = [...realEstateStore.getRealEstate()];
  realEstates[editingIndex.value] = JSON.parse(JSON.stringify(realEstate));
  realEstateStore.setRealEstate(realEstates);
};

const currentRealEstate = computed(() => {
  return (
    realEstateStore.getRealEstate()[realEstateStore.getRealEstateEditingIndex()] || {}
  );
});

const editingIndex = computed(() => {
  return props.index >= 0 ? props.index : realEstateStore.getRealEstateEditingIndex();
});
</script>
<template>
  <div style="display: contents">
    <SelectBox
      placeholder="Current Usage"
      :items="types"
      itemText="text"
      itemValue="value"
      :lgVal="lgVal"
      :mdVal="mdVal"
      :value="currentRealEstate.PropertyCurrentUsageType"
      @change="(e) => setUsageType(e, 'PropertyCurrentUsageType')"
    />
    <SelectBox
      v-if="currentRealEstate.PropertyDispositionStatusType === 'Retain'"
      placeholder="Intended Usage"
      :items="types"
      itemText="text"
      itemValue="value"
      :lgVal="lgVal"
      :mdVal="mdVal"
      :value="currentRealEstate.PropertyIntendedUsageType"
      @change="(e) => setUsageType(e, 'PropertyIntendedUsageType')"
    />
    <slot></slot>
  </div>
</template>

