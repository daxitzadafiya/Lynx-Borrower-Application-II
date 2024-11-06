<script setup>
import { useRealEstateStore } from "@/stores/realEstateStore";
import { computed, ref } from "vue";

const realEstateStore = useRealEstateStore();

const statuses = ref([
  {
    title: "Retain",
  },
  {
    title: "Sold",
  },
  {
    title: "Pending Sale",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/real-estate/retained.svg"),
  import("@/assets/images/real-estate/sold.svg"),
  import("@/assets/images/real-estate/pending-sale.svg"),
]);

statuses.value.map((status, index) => (status.src = imageList[index].default));

const setStatus = (status) => {
  const realEstate = {
    ...currentRealEstate.value,
    PropertyDispositionStatusType: status?.replace(/ /g, ""),
  };
  let realEstates = [...realEstateStore.getRealEstate()];
  realEstates[realEstateStore.getRealEstateEditingIndex()] = realEstate;
  realEstateStore.setRealEstate(realEstates);
};

const currentRealEstate = computed(() => {
  return realEstateStore.getRealEstate()[realEstateStore.getRealEstateEditingIndex()] || {}
});

const formatted = computed(() => {
  return currentRealEstate.value.PropertyDispositionStatusType
    ? currentRealEstate.value.PropertyDispositionStatusType.replace(
        /([a-z])([A-Z])/g,
        "$1 $2"
      )
    : "";
});

</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        At the time this transaction closes what will be the status of
        {{ currentRealEstate.AddressLineText || "this property" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle class="btnToggleGroup" :model-value="formatted" @update:model-value="setStatus">
        <v-row class="form-container">
          <ToggleCard v-for="(item, index) in statuses" :key="index" :value="item.title">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-btn-group--density-default.v-btn-group) {
  height: 100% !important;
}
</style>
