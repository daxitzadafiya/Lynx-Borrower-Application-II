<script setup>
import { ref, computed } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { loanPatch } from "@/mixins/loanPatch";

const accountAssetsStore = useAccountAndAssetsStore();
const { saveAndAdvance } = loanPatch();

const types = ref([
  {
    title: "Checking",
    value: "CheckingAccount",
  },
  {
    title: "Savings",
    value: "SavingsAccount",
  },
  {
    title: "Retirement\r\n(401k/IRA/etc…)",
    value: "RetirementFund",
  },
  {
    title: "Other",
    value: "Other",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/accounts/checking.svg"),
  import("@/assets/images/accounts/saving.svg"),
  import("@/assets/images/accounts/retirement.svg"),
  import("@/assets/images/accounts/other-assets.svg"),
]);

types.value.map((type, index) => (type.src = imageList[index].default));

const setTypes = (assetTypes) => {
  let assets = [...accountAssetsStore.getRegularAssets()];
  let position = assetTypes.findIndex(
    (x) => assets.findIndex((y) => y.AssetType === x) === -1
  );
  if (position !== -1) {
    assets.push({ AssetType: assetTypes[position], AssetTypeId: 0 });
  } else {
    position = assets.findIndex((x) => !assetTypes.includes(x.AssetType));
    assets.splice(position, 1);
  }
  accountAssetsStore.setAssets({ assets, AssetTypeId: 0 });
};

const navigateToAccountDetails = () => {
  let assets = [...accountAssetsStore.getRegularAssets()];
  let otherAsset = assets.find((x) => x.AssetType === "Other");
  if (otherAsset != null) {
    otherAsset.AssetType = null;
    accountAssetsStore.setAssets({ assets, AssetTypeId: 0 });
  }
  saveAndAdvance();
};

const activeTypes = computed(() => {
  return accountAssetsStore.getRegularAssets().length
    ? accountAssetsStore.getRegularAssets().reduce((filtered, item) => {
        if (item.AssetType) {
          filtered.push(item.AssetType);
        }
        return filtered;
      }, [])
    : [];
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select all of the Accounts you have</div>
    </div>
    <v-form fast-fail="fast-fail">
      <div class="inner-content-container pb-0">
        <div class="mb-4">If you have none of these, just click 'Next'.</div>
      </div>
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="activeTypes"
        multiple="multiple"
        @update:modelValue="setTypes"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="(item, index) in types"
            :smVal="3"
            :key="index"
            :value="item.value.replace(/ /g, '')"
          >
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :NextClicked="navigateToAccountDetails"
        :HasDefaultNavigation="false"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-btn-group--density-default.v-btn-group) {
  height: 100% !important;
}
:deep(.form-container) {
  padding:0 30px 30px !important;
}

:deep(.v-btn-group--density-default.v-btn-group) {
  height: 100% !important;
}
.v-btn-group--density-default.v-btn-group {
  overflow: visible !important;
}

@media (max-width: $tablet-width) {
  :deep(.form-container) {
    padding:0 20px 20px !important;
  }
}
@media (max-width: $mobile-width) {
  :deep(.form-container .itemContainer) {
    padding: 10px 0px !important;
  }
  .mb-4 {
    margin-bottom: 4px !important;
  }
}
</style>
