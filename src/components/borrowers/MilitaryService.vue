<script setup>
import { onMounted, ref, computed, watch } from "vue";
import AgreeToggle from "@/components/core-components/AgreeToggle.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const icons = ref([]);
const borrowersStore = useBorrowersStore();
const currentBorrower = ref(null);
const currentValue = ref(false)
onMounted(async () => {
  let imageList = await Promise.all([
    import("@/assets/images/borrowers/military-logos/army.png"),
    import("@/assets/images/borrowers/military-logos/space-force.png"),
    import("@/assets/images/borrowers/military-logos/marine-corps.png"),
    import("@/assets/images/borrowers/military-logos/navy.png"),
    import("@/assets/images/borrowers/military-logos/air-force.png"),
    import("@/assets/images/borrowers/military-logos/coast-guard.png"),
  ]);
  icons.value = imageList.map((img) => img.default);
  currentBorrower.value = borrowersStore.Borrower;
  if (currentBorrower.value?.SelfDeclaredMilitaryServiceIndicator === null) {
    borrowersStore.updateBorrower({
      prop: "SelfDeclaredMilitaryServiceIndicator",
      value: null,
    });
  }
  currentValue.value = currentBorrower.value?.SelfDeclaredMilitaryServiceIndicator
});

watch(
  () => borrowersStore.Borrower,
  (newValue) => {
    currentBorrower.value = newValue;
  },
  { deep: true }
);

const setMilitaryService = (value) => {
  borrowersStore.updateBorrower({
    prop: "SelfDeclaredMilitaryServiceIndicator",
    value: value,
  });
};
const isNextDisabled = computed(() => {
  return (
    currentBorrower.value?.SelfDeclaredMilitaryServiceIndicator === undefined ||
    currentBorrower.value?.SelfDeclaredMilitaryServiceIndicator === null
  );
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Did you (or your deceased spouse) ever serve, or are you currently serving, in the
        United States Armed Forces?
      </div>
    </div>
    <div class="d-flex justify-center inner-content-container">
      <div class="military-icon" v-for="(icon, index) in icons" :key="index">
        <img class="borrowers__icon" :src="icon" />
      </div>
    </div>
    <v-form class="form-container ma-0 pt-10">
      <div class="v-row itemContainer flex-column pt-2">
        <AgreeToggle @input="setMilitaryService" :value="currentValue"></AgreeToggle>
      </div>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.military-icon {
  width: calc(100% / 6);
  max-width: 100px;
  height: auto;
  padding: 0px 5px;

  img {
    width: calc(100% - 10px);
  }

  img {
    height: auto;
  }

  @media (max-width: $tablet-width) {
    padding: 0px 4px;

    img {
      width: calc(100% - 8px);
    }
  }

  @media (max-width: $tablet-width) {
    padding: 0px 2px;

    img {
      width: calc(100% - 4px);
    }
  }
}
.pt-2{
  padding-top: 2px !important;
}
.pt-10{
  padding-top: 10px !important;
}
</style>
