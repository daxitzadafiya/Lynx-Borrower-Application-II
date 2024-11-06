<script setup>
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { computed, ref } from "vue";
import { giftTypes, giftSources } from "@/models/constants";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";

const accountAssetsStore = useAccountAndAssetsStore();
const { isOnlyNum } = number();
const additional = ref(null);
const types = ref(giftTypes);
const sources = ref(giftSources);
const options = ref([
  {
    label: "NO",
    value: false,
  },
  {
    label: "YES",
    value: true,
  },
]);

const remove = (index) => {
  const updated = gifts.value.filter((item, i) => i !== index);
  updateAssets(updated);
};

const addAsset = () => {
  additional.value = { AssetType: "" };
};

const setAssetProp = (prop, value, index) => {
  const updated = gifts.value.map((item, i) => {
    if (index === i) {
      item[prop] = value;
    }
    return item;
  });
  updateAssets(updated);
};

const setAdditionalType = (type) => {
  if (!type) return;
  const assets = [
    ...accountAssetsStore.getGiftsOrGrants(),
    { AssetType: type, AssetTypeId: 2 },
  ];
  accountAssetsStore.setAssets({ assets, AssetTypeId: 2 });
  additional.value = null;
};

const updateAssets = (updated) => {
  const grants = accountAssetsStore
    .getGiftsOrGrants()
    .filter((item) => item.AsseType === "Grant");
  accountAssetsStore.setAssets({ assets: [...updated, ...grants], AssetTypeId: 2 });
};

const gifts = computed(() => {
  return accountAssetsStore
    .getGiftsOrGrants()
    .filter(
      (item) =>
        item.AssetType === "GiftOfCash" || item.AssetType === "GiftOfPropertyEquity"
    );
});

const cashGiftsSources = computed(() => {
  return [...sources.value, { text: "Other", value: "Other" }];
});

const propEquitySources = computed(() => {
  const result = [
    ...sources.value,
    { text: "Federal Agency", value: "FederalAgency" },
    { text: "Local Agency", value: "LocalAgency" },
    { text: "State Agency", value: "StateAgency" },
  ];
  return [...result.sort((a, b) => a.text > b.text), { text: "Other", value: "Other" }];
});
</script>
<template>
  <v-form fast-fail class="form-outer-container">
    <v-row
      class="form-container deleteAbleItem"
      v-for="(item, index) in gifts"
      :key="index"
    >
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense icon @click="remove(index)" elevation="0">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>

      <SelectBox
        :value="item.AssetType"
        :items="types"
        itemText="text"
        itemValue="value"
        placeholder="Gift Type"
        @change="(value) => setAssetProp('AssetType', value, index)"
      />
      <SelectBox
        :value="item.FundsSourceType"
        :items="item.AssetType === 'GiftOfCash' ? cashGiftsSources : propEquitySources"
        itemText="text"
        itemValue="value"
        placeholder="Source"
        @change="(value) => setAssetProp('FundsSourceType', value, index)"
      />
      <TextBox
        placeholder="Donor Name/Organization"
        :value="item.DonorName"
        @input="(e) => setAssetProp('DonorName', e.target.value, index)"
      />
      <TextBox
        placeholder="Donor Email"
        :value="item.DonorEmail"
        @input="(e) => setAssetProp('DonorEmail', e.target.value, index)"
      />
      <TextBox
        prefix="$"
        placeholder="Amount of Gift"
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
      />
      <v-col cols="12" sm="6" v-if="item.AssetType === 'GiftOfCash'" class="itemContainer">
        <div class="titleText mb-3">Deposited</div>
        <Radio
          :options="options"
          :value="item.IncludedInAssetAccountIndicator"
          @change="
            (val) => {
              setAssetProp('IncludedInAssetAccountIndicator', val, index);
            }
          "
        ></Radio>
      </v-col>
    </v-row>

    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense icon elevation="0" @click="additional = null">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>
      <SelectBox
        :value="additional.AssetType"
        :items="types"
        itemText="text"
        itemValue="value"
        placeholder="Gift Type"
        @change="(value) => setAdditionalType(value)"
      />
    </v-row>

    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn dense plain elevation="0" @click="addAsset()" class="addItemBtn">
          <v-icon small>mdi-plus</v-icon>
          <span class="addBtnText">Add new Gift</span>
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
.v-input.v-radio-group {
  display: flex;
  align-items: center;
  :deep(.v-input__control) {
    height: auto !important;
  }
  :deep(.v-selection-control-group) {
    display: flex;
    width: 100%;
    flex-direction: unset !important;
    flex-wrap: wrap;
    .v-selection-control {
      flex: 1 1 auto !important;
      margin-right: 16px;
      .v-label {
        font-size: 14px !important;
        opacity: 1 !important;
        letter-spacing: normal;
      }
    }
    .v-selection-control__wrapper,
    .v-selection-control__input {
      width: auto !important;
      height: auto !important;
      i{
        font-size:24px 
      }
    }
    .v-selection-control__wrapper {
      margin-right: 8px;
    }
  }
}
</style>
