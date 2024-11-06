<script setup>
import { computed, ref } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";

const accountAssetsStore = useAccountAndAssetsStore();

const types = ref([
  {
    title: "Proceeds From Sale Of Real Estate",
    value: "ProceedsFromSaleOfRealEstate",
  },
  {
    title: "Proceeds From Sale Of Personal Property",
    value: "ProceedsFromSaleOfPersonalProperty",
  },
  {
    title: "Proceeds From Secured Loan",
    value: "ProceedsFromSecuredLoan",
  },
  {
    title: "Other",
    value: "Other",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/accounts/real-estate.svg"),
  import("@/assets/images/accounts/car.svg"),
  import("@/assets/images/accounts/secured-loan.svg"),
  import("@/assets/images/accounts/cash-on-hand.svg"),
]);

types.value.map((type, index) => (type.src = imageList[index].default));

const setTypes = (assetTypes) => {
  let assets = [...accountAssetsStore.getOtherAssets()];
  let position = assetTypes.findIndex(
    (x) => assets.findIndex((y) => y.AssetType === x) === -1
  );
  if (position !== -1) {
    assets.push({ AssetType: assetTypes[position], AssetTypeId: 1 });
  } else {
    position = assets.findIndex((x) => !assetTypes.includes(x.AssetType));
    assets.splice(position, 1);
  }
  accountAssetsStore.setAssets({ assets, AssetTypeId: 1 });
};

const activeTypes = computed(() => {
  return accountAssetsStore.getOtherAssets().length ? accountAssetsStore.getOtherAssets().map((item) => item.AssetType) : [];
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Are you utilizing any other of these assets for this transaction?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <div class="inner-content-container pb-0">
        <div class="mb-4">If you have none of these, just click 'Next'.</div>
      </div>
      <v-btn-toggle class="btnToggleGroup" multiple="multiple" :model-value="activeTypes" @update:model-value="setTypes">
        <v-row class="form-container pt-0">
          <ToggleCard
            v-for="(item, index) in types"
            :smVal="6"
            :lgVal="3"
            :key="index"
            :value="item.value"
          >
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-btn-group--density-default.v-btn-group) {
  height: 100% !important;
}
.v-btn-group--density-default.v-btn-group {
  overflow: visible !important;
}
.v-row {
  margin: -10px !important;
}
</style>
