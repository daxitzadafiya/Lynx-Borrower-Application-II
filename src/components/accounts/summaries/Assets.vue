<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import Table from "@/components/accounts/assets/Table.vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import AccountDetailsData from "@/components/accounts/accountDetails/AccountDetailsData.vue";
import NewOtherAssetDetailsData from "@/components/accounts/otherAssetsDetails/OtherAssetDetailsData.vue";
import { ref } from "vue";
import { useGeneralStore } from "@/stores/generalStore";

const accountAssetsStore = useAccountAndAssetsStore();
const generalStore = useGeneralStore();

const dataBeforeEdit = ref([]);
const otherAssetsDataBeforeEdit = ref([]);

const onCancelClicked = () => {
  accountAssetsStore.setAssets({ assets: dataBeforeEdit.value, AssetTypeId: 0 });
  accountAssetsStore.setAssets({
    assets: otherAssetsDataBeforeEdit.value,
    AssetTypeId: 1,
  });
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = [];
  otherAssetsDataBeforeEdit.value = [];
  accountAssetsStore.getRegularAssets().forEach((asset) => {
    if (asset.AssetTypeId === 0) {
      dataBeforeEdit.value.push(JSON.parse(JSON.stringify(asset)));
    }
  });
  accountAssetsStore.getOtherAssets().forEach((asset) => {
    if (asset.AssetTypeId === 1) {
      otherAssetsDataBeforeEdit.value.push(JSON.parse(JSON.stringify(asset)));
    }
  });
};
</script>
<template>
  <NewSummaryControl
    header="Assets - Bank Accounts, Retirement, and Other Accounts You Have"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <template
        v-if="
          (accountAssetsStore.getRegularAssets() == null ||
            accountAssetsStore.getRegularAssets().length === 0) &&
          (accountAssetsStore.getOtherAssets() == null ||
            accountAssetsStore.getOtherAssets().length === 0)
        "
      >
        <v-row class="summary-content-container">
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="summaryValue">No Assets.</div>
          </v-col>
        </v-row>
      </template>
      <Table v-else></Table
    ></template>
    <template v-slot:editContent>
      <AccountDetailsData></AccountDetailsData>
      <v-row class="form-container deleteAbleItem otherAssetsRow">
        <v-col class="itemContainer">
          <div class="font-weight-bold">Other Assets You Have</div>
        </v-col>
      </v-row>
      <NewOtherAssetDetailsData></NewOtherAssetDetailsData>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
:deep(.summaryCardViewMode) {
  padding: 15px !important;
}
.otherAssetsRow {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  margin: -10px !important;
  &::before {
    display: none;
  }
}
</style>
