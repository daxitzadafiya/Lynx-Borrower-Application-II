<script setup>
import { computed, ref, watch } from "vue";
import { otherAssetsTypes, personProperties, collaterals } from "@/models/constants";
import moment from "moment";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import googlePlaceAutocomplete from "@/components/maps/newGooglePlaceAutocomplete.vue"
import { number } from "@/mixins/onlyNum";

const accountAssetsStore = useAccountAndAssetsStore();
const { isOnlyNum } = number();
const menuOpenIndex = ref(-1);
const menuOpenedDate = ref(null);
const assetsTypes = ref(otherAssetsTypes);
const additional = ref(null);
const options = ref([
  { label: "Liquid", value: "OtherLiquidAsset" },
  { label: "Non-Liquid", value: "OtherNonLiquidAsset" },
]);

const setClosingDate = (date, index) => {
  setAssetProp(
    date == null ? null : moment(date).format("YYYY-MM-DD"),
    "ClosingDate",
    index
  );
};

const clearClosingDate = (index) => {
  setClosingDate(null, index);
  menuOpenIndex.value = -1;
};

const clearDateReceived = (index) => {
  setDateReceived(null, index);
  menuOpenIndex.value = -1;
};

const setAddressData = (address, index) => {
  if (address.inputId == index+1) {
    setAssetProp(address?.AddressLineText, "AddressLineText", index);
    setAssetProp(address?.CityName, "CityName", index);
    setAssetProp(address?.StateCode, "StateCode", index);
    setAssetProp(address?.CountryCode, "CountryCode", index);
    setAssetProp(address?.PostalCode, "PostalCode", index);
  }
};

const setDateReceived = (date, index) => {
  setAssetProp(
    date == null ? null : moment(date).format("YYYY-MM-DD"),
    "DateReceived",
    index
  );
};

const getFormattedAddress = (asset) => {
  var formattedAddress = "";
  if (asset.AddressLineText != null) {
    formattedAddress += asset.AddressLineText + ", ";
  }
  if (asset.CityName != null) {
    formattedAddress += asset.CityName + ", ";
  }
  if (asset.StateCode != null) {
    formattedAddress += asset.StateCode + ", ";
  }
  if (asset.PostalCode != null) {
    formattedAddress += asset.PostalCode + ", ";
  }
  if (asset.CountryCode != null) {
    formattedAddress += asset.CountryCode + ", ";
  }
  return formattedAddress.slice(0, formattedAddress.length - 2);
};

const remove = (index) => {
  if (additional.value && index === allAssets.value.length - 1) {
    return (additional.value = null);
  }
  const assets = accountAssetsStore.getOtherAssets().filter((item, i) => i !== index);
  accountAssetsStore.setAssets({ assets, AssetTypeId: 1 });
};

const addItem = () => {
  if (additional.value) return;
  additional.value = {};
};

const setOtherAssetType = (value, index) => {
  let assets = [...accountAssetsStore
    .getOtherAssets()];
  if (additional.value && index === allAssets.value.length - 1) {
    let asset = { AssetType: value, AssetTypeId: 1 };
    if (value === "Other") {
      asset.AssetTypeOtherDescription = "OtherLiquidAsset";
    }
    assets.push(asset);
  } else {
    assets[index].AssetType = value;
    if (value !== "ProceedsFromSaleOfPersonalProperty") {
      if (assets[index].FundsSourceType != null) {
        delete assets[index].FundsSourceType;
      }
    }
    if (value === "Other") {
      assets[index].AssetTypeOtherDescription = "OtherLiquidAsset";
    } else {
      delete assets[index].AssetTypeOtherDescription;
    }
  }
  accountAssetsStore.setAssets({ assets, AssetTypeId: 1 });
  additional.value = null;
};

const setAssetLiquidProp = (value, index) => {
  const assets = accountAssetsStore
    .getOtherAssets()
    .map((item, i) =>
      i !== index ? item : { ...item, AssetTypeOtherDescription: value }
    );
  accountAssetsStore.setAssets({ assets, AssetTypeId: 1 });
};

const setAssetAmount = (value, index) => {
  const assets = accountAssetsStore
    .getOtherAssets()
    .map((item, i) =>
      index !== i ? item : { ...item, AssetCashOrMarketValueAmount: value }
    );
  accountAssetsStore.setAssets({ assets, AssetTypeId: 1 });
};

const setAssetProp = (value, prop, index) => {
  const assets = accountAssetsStore.getOtherAssets().map((item, i) => {
    if (i === index) {
      item[prop] = value;
    }
    return item;
  });
  accountAssetsStore.setAssets({ assets, AssetTypeId: 1 });
};

const total = computed(() => {
  return allAssets.value?.length
    ? allAssets.value.reduce((acc, cur) => {
      acc += !isNaN(cur.AssetCashOrMarketValueAmount)
        ? +cur.AssetCashOrMarketValueAmount
        : 0;
      return acc;
    }, 0)
    : 0;
});

const allAssets = computed(() => {
  let result = [...accountAssetsStore.getOtherAssets()];
  if (additional.value) {
    result.push(additional.value);
  }
  return result;
});

watch(
  () => menuOpenIndex.value,
  (newValue) => {
    if (newValue !== -1) {
      if (allAssets.value[val].AssetType === "ProceedsFromSaleOfRealEstate") {
        menuOpenedDate.value = allAssets.value[val].ClosingDate;
      } else if (allAssets.value[val].AssetType === "ProceedsFromSecuredLoan") {
        menuOpenedDate.value = allAssets.value[val].DateReceived;
      }
    } else {
      menuOpenedDate.value = null;
    }
  },
  { deep: true }
);
</script>
<template>
  <v-form class="fast-fail form-outer-container">
    <div v-if="accountAssetsStore.getOtherAssets().length">
      <v-row class="form-container deleteAbleItem" v-for="(detail, index) in allAssets" :key="index">
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn dense elevation="0" icon @click="remove(index)">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-col>
        <SelectBox placeholder="Asset Type" :items="assetsTypes" itemText="text" itemValue="value"
          :value="detail.AssetType" @change="(value) => setOtherAssetType(value, index)" />
        <TextBox placeholder="Source" v-if="detail.AssetType === 'CashOnHand'" :value="detail.FundsSourceType"
          @input="(e) => setAssetProp(e.target.value, 'FundsSourceType', index)" />
        <googlePlaceAutocomplete v-if="detail.AssetType === 'ProceedsFromSaleOfRealEstate'"
          :value="getFormattedAddress(detail)" :uniqueInputId="index+1"
          @setAddressData="(value) => setAddressData(value, index)" />
        <DateInput placeholder="Closing Date" v-if="detail.AssetType === 'ProceedsFromSaleOfRealEstate'"
          @dateUpdated="(date) => setClosingDate(date, index)" @dateCleared="() => clearClosingDate(index)"
          :value="detail.ClosingDate" />
        <SelectBox v-if="detail.AssetType === 'ProceedsFromSaleOfPersonalProperty'" placeholder="Personal Property"
          :items="personProperties" itemText="text" itemValue="value" :value="detail.FundsSourceType"
          @change="(value) => setAssetProp(value, 'FundsSourceType', index)" />
        <SelectBox v-if="detail.AssetType === 'ProceedsFromSecuredLoan'" placeholder="Collateral" :items="collaterals"
          itemText="text" itemValue="value" :value="detail.FundsSourceType"
          @change="(value) => setAssetProp(value, 'FundsSourceType', index)" />
        <TextBox v-if="detail.FundsSourceType === 'Other'" placeholder="Other Description"
          :value="detail.FundsSourceTypeOtherDescription" @input="(e) => setAssetProp(e.target.value, 'FundsSourceTypeOtherDescription', index)
      " />
        <DateInput placeholder="Date Received" v-if="detail.AssetType === 'ProceedsFromSecuredLoan'"
          @dateUpdated="(date) => setDateReceived(date, index)" @dateCleared="() => clearDateReceived(index)"
          :value="detail.DateReceived" />
        <TextBox prefix="$" placeholder="Value" :value="getFormattedValue(detail.AssetCashOrMarketValueAmount)"
          @input="(e) => setAssetAmount(+e.target.value.replace(/,/g, ''), index)" @keypress="(e) => isOnlyNum(e, true)"
          :disabled="!detail.AssetType" />
        <v-col cols="12" sm="6" class="itemContainer" v-if="detail.AssetType === 'Other'">
          <Radio :options="options" :value="detail.AssetTypeOtherDescription" @change="(val) => {
        setAssetLiquidProp(val, index)
      }"></Radio>
        </v-col>
      </v-row>
    </div>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn dense plain elevation="0" class="addItemBtn" @click="addItem">
          <v-icon small>mdi-plus</v-icon>
          <span class="addBtnText">Add Asset or Credit</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12"> Total: ${{ getFormattedValue(total) || 0 }} </v-col>
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

:deep(.addItemBtnContainer) {
  margin-top: -30px !important;
}

.itemDeleteCrossContainer {
  :deep(.v-btn--icon.v-btn--density-default) {
    height: 36px !important;
    width: 36px !important;
    background: transparent;
  }
  :deep(.v-icon){
    font-size: 16px;
    color: $close-icon-color !important;
  }
}

:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}

.form-container.addItemBtnContainer .addItemBtn {
  max-width: unset !important;
}
.v-input.v-radio-group {
  display: flex;
  align-items: center;
  margin-top: 20px;

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

      i {
        font-size: 24px !important
      }
    }

    .v-selection-control__wrapper {
      margin-right: 8px;
    }
  }
}
</style>
