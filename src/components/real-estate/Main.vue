<script setup>
import Start from "@/components/images/real-estate/Start.vue";
import { ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useRealEstateStore } from "@/stores/realEstateStore";

const borrowerStore = useBorrowersStore();
const realEstateStore = useRealEstateStore();
const ownAnyRealEstate = ref(null);

const setIndex = (val) => {
  ownAnyRealEstate.value = val;
  realEstateStore.setRealEstateEditingIndex(realEstateStore.getRealEstate().length);
  borrowerStore.setRealEstateOwned(val);
};
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Do you own any {{ realEstateStore.getRealEstate().length ? "additional" : "" }} Real Estate?
      </div>
      <Start />
      <v-form class="my-5">
        <AgreeToggle :value="ownAnyRealEstate" @input="setIndex"></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="ownAnyRealEstate === null"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    width: auto;
    height: auto;
    margin: 20px 0;
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
