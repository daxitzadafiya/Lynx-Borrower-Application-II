<script setup>
import Filters from "@/components/rates-offers/product-lists/Filters.vue";
import ChooseAndCompare from "@/components/rates-offers/product-lists/ChooseAndCompare.vue";
import CompareProductsDetails from "@/components/rates-offers/CompareProductsDetails.vue";
import { computed, onMounted, ref } from "vue";
import { useRatesAndOffersStore } from "@/stores/ratesAndOffers.js";

const ratesAndAccountStore = useRatesAndOffersStore();
const selectedFilter = ref("Rate");
const selectedPropertyType = ref("Single Family");
const options = ref([
  {
    label: "Fixed",
    value: "Fixed",
  },
  {
    label: "Adjustable",
    value: "Adjustable",
  },
]);

const filterOn = ref(["Rate"]);
const propertyType = ref(["Single Family"]);
const years = ref([3, 5, 7, 10]);
const selectedYears = ref([]);
const isShowMore = ref(true);
const isExpanded = ref(false);
const isModalOpen = ref(false);
const compareProducts = ref([]);
const targetElement = ref(null);
const sourceElement = ref(null);


const isNextDisabled = computed(() => {
  return ratesAndAccountStore.getSelectedProduct() == null;
});

const toggleSelection = (year) => {
  if (!selectedYears.value.includes(year)) {
    selectedYears.value.push(year);
  }
};

const onCompareProducts = (products) => {
  compareProducts.value = products;
};

onMounted(() => {
  const sourceWidth = sourceElement.value.offsetWidth;
  targetElement.value.style.width = `${sourceWidth}px`;
});
</script>

<template>
  <div ref="sourceElement" class="position-relative">
    <Filters />

    <div class="p-4">

      <v-row class="sort">
        <p class="mb-0">Sort</p>
        <v-col lg="4" class="px-0 py-0">
          <SelectBox :smVal="10" class="px-0" :value="selectedFilter" hide-details :items="filterOn">
          </SelectBox>
        </v-col>
      </v-row>
    </div>

    <ChooseAndCompare @onCompare="onCompareProducts" />

    <div class="space-end d-flex px-4" v-if="compareProducts.length > 0">
      <div class="compare_section p-4">
        <div class="d-flex items-center gap-3 mb-3">
          <p>{{ compareProducts.length }} Products Selected</p>
          <v-btn class="compareBtnDesktop" elevation="0" @click="isModalOpen = true"
            :disabled="compareProducts.length == 1">
            Compare
          </v-btn>
        </div>
        <span>You can select up to 3 products to compare</span>
      </div>
    </div>

    <v-dialog v-model="isModalOpen" transition="dialog-top-transition" width="767" height="464" scrollable="scrollable">
      <template v-if="isModalOpen">
        <CompareProductsDetails :products="compareProducts" @closeDialog="isModalOpen = false" />
      </template>
    </v-dialog>

    <div ref="targetElement" class="navigation-container">
      <NavigationButtons ButtonType="secondary" :HasDefaultNavigation="false"
        :RequestedNextPath="'ratesandoffers/desired-rate'" NextBtnWidth="100px" :ConditionsMet="isNextDisabled">
      </NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.image-content-type {
  min-height: fit-content !important;
  justify-content: flex-start;
  align-items: flex-start;
}

.position-relative {
  position: relative;
}

.items-center {
  align-items: center;
}

.d-none {
  display: none !important;
}

.mb-3 {
  margin-bottom: 10px !important;
}

.p-4 {
  padding: 16px;
}

.px-4 {
  padding: 0px 16px;
}

.space-between {
  justify-content: space-between;
}

.space-end {
  justify-content: end;
}

.col-span-2 {
  grid-column: span 2;
}

.border-dashed {
  border: 1px dashed $light-grayV2;
  box-shadow: none !important;
  color: $secondaryV2;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 37px;
  box-shadow: 0px 0px 4px 0px #00000024, 0px 0px 1px 0px #00000024;
}

.gap-4 {
  gap: 16px;
}

.gap-3 {
  gap: 10px;
}

.navigation-container {
  border: 0 !important;
  position: fixed;
  bottom: -2px;
  background: $popup-bg;
}

.navButtonsContianer {
  padding-right: 0px !important;
  padding-left: 2px !important;
}

:deep(.compareBtn),
:deep(.compareBtn_1) {
  color: $action-primary-bg-color;
  text-transform: none;
  display: flex;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
}

:deep(.v-input--selection-controls) {
  margin: 0px;
  padding: 0px;
}

:deep(.v-input--selection-controls__input + .v-label) {
  font-size: 14px;
  font-weight: 400;
}

.w-100 {
  width: 100% !important;
}

:deep(.v-text-field--enclosed .v-input__append-inner) {
  margin-top: 8px !important;
}

.sort {
  align-items: center;
  gap: 10px;
  padding-left: 12px;
  :deep(.v-select__selections) {
    padding: 0px !important;
  }
  :deep(.v-input__control){
    height: 40px;
    width: 286px;
  }
  :deep(.v-select__selection-text){
    line-height: 20px;
  }
}

:deep(.v-list-item) {
  min-height: 40px;
}

:deep(.v-list-item__content) {
  padding: 0 !important;
}

.v-btn:not(.v-btn--round).v-size--default {
  min-width: 100px !important;
}

.conventional_box {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

:deep(.v-select__slot) {
  .v-input__append-inner {
    padding-left: 0;
    margin-top: 3px;

    .v-icon.v-icon {
      font-size: 20px !important;
      color: $dark-grayV2 !important;
    }
  }
}
:deep(.v-overlay__content){
  justify-content: center !important;
}
.compare_section {
  box-shadow: 0px 0px 12px 0px #0000001f, 0px 0px 12px 0px #0000001f;
  background: $whiteV2;
  width: fit-content;
  border-radius: 5px;
  position: fixed;
  bottom: 90px;
  z-index: 999999;

  p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
  }

  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 22px;
    text-align: center;
  }

  .compareBtnDesktop {
    background-color: $orangeV2 !important;
    color: $whiteV2 !important;
    text-transform: none;
    width: 100px !important;
  }
}

:deep(.v-input__slot) {
  min-height: 40px !important;
}

@media (max-width: $desktop-width) {
  .conventional_box {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: $tablet-width) {
  .compare_section {
    bottom: 90px;
  }
}

@media (max-width: $sm-tablet-width) {
  .conventional_box {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (max-width: $mobile-width) {
  .compare_section {
    right: 16px;
    bottom: 70px;
  }

  .navButtonsContianer {
    padding: 16px 2px !important;
  }
}
</style>
