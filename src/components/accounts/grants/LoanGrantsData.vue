<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { computed, onMounted, ref } from "vue";
import { grantSources } from "@/models/constants";
import { number } from "@/mixins/onlyNum";

const accountAssetsStore = useAccountAndAssetsStore();
const { isOnlyNum } = number();
const additional = ref(null);
const sources = ref(grantSources);
const remove = (index) => {
  const updated = grants.value.filter((item, i) => i !== index);
  updateAssets(updated);
};

const addAsset = () => {
  additional.value = {};
};

const setAssetProp = (prop, value, index) => {
  const updated = grants.value.map((item, i) => {
    if (index === i) {
      item[prop] = value;
    }
    return item;
  });
  updateAssets(updated);
};

const setAdditionalSource = (FundsSourceType) => {
  if (!FundsSourceType) return;
  const assets = [
    ...accountAssetsStore.getGiftsOrGrants(),
    { AssetType: "Grant", AssetTypeId: 2, FundsSourceType },
  ];
  accountAssetsStore.setAssets({ assets, AssetTypeId: 2 });
  additional.value = null;
};

const updateAssets = (updated) => {
  const gifts = accountAssetsStore
    .getGiftsOrGrants()
    .filter((item) => item.AssetType !== "Grant");
  accountAssetsStore.setAssets({ assets: [...updated, ...gifts], AssetTypeId: 2 });
};

const grants = computed(() => {
  return accountAssetsStore
    .getGiftsOrGrants()
    .filter((item) => item.AssetType === "Grant");
});

onMounted(() => {
  addAsset()
});
</script>
<template>
  <v-form class="fast-fail form-outer-container">
    <v-row
      class="form-container deleteAbleItem"
      v-for="(item, index) in grants"
      :key="index"
    >
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense elevation="0" icon @click="remove(index)">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <SelectBox
        :value="item.FundsSourceType"
        :items="sources"
        itemText="text"
        itemValue="value"
        placeholder="Source"
        @change="(value) => setAssetProp('FundsSourceType', value, index)"
      ></SelectBox>
      <TextBox
        placeholder="Organization"
        class="textbox"
        :value="item.DonorName"
        @input="(e) => setAssetProp('DonorName', e.target.value, index)"
      ></TextBox>
      <TextBox
        prefix="$"
        placeholder="Amount of DPA or Grant"
        class="textbox"
        :value="getFormattedValue(item.AssetCashOrMarketValueAmount)"
        @input="
          (e) =>
            setAssetProp(
              'AssetCashOrMarketValueAmount',
              +e.target.value.replace(/,/g, ''),
              index
            )
        "
        @keypress="(e) => isOnlyNum(e, true)"
      ></TextBox>
      <TextArea
        v-if="item.FundsSourceType === 'Other'"
        :rows="1"
        placeholder="Other Description"
        :value="item.Explanation"
        @onChange="(e) => setAssetProp('Explanation', e, index)"
      ></TextArea>
    </v-row>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense elevation="0" icon @click="additional = null">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <SelectBox
        :value="additional?.FundsSourceType"
        :items="sources"
        itemText="text"
        itemValue="value"
        placeholder="Source"
        @change="(value) => setAdditionalSource(value)"
      ></SelectBox>
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addAsset"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add new Grant or Down Payment Assistance</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
<style lang="scss" scoped>
:deep(.form-container) {
  margin: -10px -10px;
}
.deleteAbleItem {
  margin-bottom: -45px !important;
}
.itemDeleteCrossContainer {
  :deep(.v-btn--icon.v-btn--density-default) {
    height: 36px !important;
    width: 36px !important;
    background: transparent;
  }
  :deep(.v-icon) {
    font-size: 16px;
    color: $close-icon-color !important;
  }
}
:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}
:deep(.v-btn__content) {
  white-space: normal;
}
.form-container.addItemBtnContainer .addItemBtn {
  padding-right: 0;
  padding-left: 0;
  margin-left: 0;
}
.addItemBtn .addBtnText {
  text-align: left;
}
</style>
