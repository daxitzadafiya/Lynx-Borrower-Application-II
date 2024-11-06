<script setup>
import Start from "@/components/images/real-estate/Start.vue";
import { ref, computed } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useBorrowersStore } from "@/stores/borrowersStore";

const hasMortgage = ref(null);
const realEstateStore = useRealEstateStore();
const borrowersStore = useBorrowersStore();

const setHasMortgage = (value) => {
  hasMortgage.value = value;
  borrowersStore.setRealEstateOwnedMortgage(value);
};

const currentRealEstate = computed(() => {
  return (
    realEstateStore.getRealEstate()[realEstateStore.getRealEstateEditingIndex()] || {}
  );
});

const titleValue = computed(() => {
  return currentRealEstate.value.AddressLineText || "this property";
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Is there a mortgage on
        {{ titleValue }}
      </div>
      <Start />
      <v-form class="my-5">
        <AgreeToggle :value="hasMortgage" @input="setHasMortgage"></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="hasMortgage === null"></NavigationButtons>
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