<script setup>
import { ref, computed } from "vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import config from "@/configs";
import { number } from "@/mixins/onlyNum";

const accountAssetsStore = useAccountAndAssetsStore();
const additional = ref(null);
const institutions = ref([]);
const ownershipTypes = ref(["Individual", "Joint With Spouse", "Joint With Other"]);
const institutionSearchTimeout = ref(null);
const instituteSearchIndex = ref(-1);
const { isOnlyNum } = number();

const types = ref([
  {
    text: "Bond",
    value: "Bond",
  },
  {
    text: "Certificate Of Deposit/Time Deposit(CD)",
    value: "CertificateOfDepositTimeDeposit",
  },
  {
    text: "Checking Account",
    value: "CheckingAccount",
  },
  {
    text: "Individual Development Account",
    value: "IndividualDevelopmentAccount",
  },
  {
    text: "Life Insurance",
    value: "LifeInsurance",
  },
  {
    text: "Money Market Fund",
    value: "MoneyMarketFund",
  },
  {
    text: "Mutual Fund",
    value: "MutualFund",
  },
  {
    text: "Retirement Fund",
    value: "RetirementFund",
  },
  {
    text: "Savings Account",
    value: "SavingsAccount",
  },
  {
    text: "Stock",
    value: "Stock",
  },
  {
    text: "Stock Options",
    value: "StockOptions",
  },
  {
    text: "Trust Account",
    value: "TrustAccount",
  },
]);

const remove = (index) => {
  institutions.value[index] = [];
  for (var i = index; i < accountAssetsStore.getRegularAssets().length; i++) {
    institutions.value[index] = institutions.value[index + 1];
  }
  const assets = accountAssetsStore.getRegularAssets().filter((item, i) => i !== index);
  accountAssetsStore.setAssets({ assets, AssetTypeId: 0 });
};

const addAccount = () => {
  additional.value = { AssetType: "" };
};

const setAssetProp = (prop, value, index) => {
  const assets = accountAssetsStore.getRegularAssets().map((item, i) => {
    item[prop] = index === i ? value : item[prop];
    return item;
  });
  accountAssetsStore.setAssets({ assets, AssetTypeId: 0 });
};

const setAssetType = (type, index) => {
  if (!type) return;
  setAssetProp("AssetType", type.value, index);
};

const setAssetInstitution = (name, index) => {
  if (!name) return;
  setAssetProp("FullName", name.Name ? name.Name : name, index);
};

const setAssetAccountNumber = (value, index) => {
  setAssetProp("AssetAccountIdentifier", value, index);
};

const setAssetOwnershipType = (type, index) => {
  if (!type) return;
  setAssetProp("OwnershipType", type, index);
};

const setAssetAmount = (value, index) => {
  setAssetProp("AssetCashOrMarketValueAmount", value, index);
};

const setAdditionalType = (type) => {
  if (!type) return;
  const assets = [
    ...accountAssetsStore.getRegularAssets(),
    { AssetType: type.value, AssetTypeId: 0 },
  ];
  accountAssetsStore.setAssets({ assets, AssetTypeId: 0 });
  additional.value = null;
};
const getDisplayText = (selection) => {
  var found = types.value.find((type) => type.value == selection);

  return found ? found.text : selection;
};

const getFinancialInstitutionSearchResults = (searchText, index, asset) => {
  if (asset.FullName === searchText) return;
  if (institutionSearchTimeout.value != null) {
    clearTimeout(institutionSearchTimeout.value);
  }
  institutionSearchTimeout.value = setTimeout(async () => {
    try {
      if (
        searchText != null &&
        searchText.length >= config.autocompleteSearchTextMinimumLength
      ) {
        instituteSearchIndex.value = index;
        institutions.value[index] = await accountAssetsStore.getFinancialInstitutions(
          searchText
          );
        instituteSearchIndex.value = false;
      } else {
        institutions.value[index] = [];
      }
    } catch (error) {
      institutions.value[index] = [];
    }
  }, config.autocompleteSearchDelay);
};

const total = computed(() => {
  return accountAssetsStore.getRegularAssets().length
    ? accountAssetsStore
        .getRegularAssets()
        .reduce(
          (acc, cur) =>
            (acc += !isNaN(cur.AssetCashOrMarketValueAmount)
              ? +cur.AssetCashOrMarketValueAmount
              : 0),
          0
        )
    : 0;
});
</script>

<template>
  <v-form class="fast-fail form-outer-container">
    <div v-if="accountAssetsStore.getRegularAssets().length">
      <v-row
        v-for="(asset, index) in accountAssetsStore.getRegularAssets()"
        :key="index"
        class="form-container deleteAbleItem"
      >
        <v-col cols="12" sm="12" class="itemContainer itemDeleteCrossContainer">
          <v-btn icon elevation="0" dense @click="remove(index)">
            <v-icon small="small" dense="dense">mdi-close</v-icon>
          </v-btn>
        </v-col>
        <ComboBox
          :items="types"
          itemText="text"
          itemValue="value"
          @change="(type) => setAssetType(type, index)"
          :value="getDisplayText(asset.AssetType)"
          placeholder="Account Type"
        />
        <ComboBox
          :items="
            institutions[index] == null
              ? asset.FullName != null
                ? [{ Name: asset.FullName }]
                : []
              : institutions[index]
          "
          placeholder="Financial Institution"
          itemText="Name"
          itemValue="Name"
          :value="asset.FullName"
          @input="(e) => setAssetInstitution(e.target.value, index)"
          :loading="instituteSearchIndex === index"
          @search="
            (name) => getFinancialInstitutionSearchResults(name, index, asset)
          "
          :filter="true"
        />
        <TextBox
          cols="12"
          lg="4"
          md="6"
          prefix="*"
          :mask="'XXXX'"
          :value="asset.AssetAccountIdentifier"
          @input="(e) => setAssetAccountNumber(e.target.value, index)"
          placeholder="Last 4 of Acct#"
          :maximumLength="4"
        />
        <ComboBox
          cols="12"
          lg="4"
          md="6"
          :items="ownershipTypes"
          :value="
            asset.OwnershipType
              ? asset.OwnershipType.replace(/([a-z])([A-Z])/g, '$1 $2')
              : ''
          "
          placeholder="Ownership Type"
          @change="(type) => setAssetOwnershipType(type, index)"
        />
        <TextBox
          cols="12"
          lg="4"
          md="6"
          prefix="$"
          :value="getFormattedValue(asset.AssetCashOrMarketValueAmount)"
          @input="(e) => setAssetAmount(+e.target.value.replace(/,/g, ''), index)"
          placeholder="Cash or Market Value"
          @keypress="(e) => isOnlyNum(e, true)"
        />
      </v-row>
    </div>

    <v-row v-if="additional" class="form-container deleteAbleItem">
      <v-col cols="12" sm="12" class="itemContainer itemDeleteCrossContainer">
        <v-btn icon elevation="0" dense @click="additional = null">
          <v-icon small="small" dense="dense">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <ComboBox
        placeholder="Account Type"
        @change="(type) => setAdditionalType(type)"
        :items="types"
        :value="additional.AssetType"
        itemText="text"
        itemValue="value"
      />
    </v-row>

    <v-row class="form-container addItemBtnContainer">
      <v-col cols="12" sm="6" class="itemContainer">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addAccount"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add New Account</span>
        </v-btn>
      </v-col>
      <v-col class="text-block__col totals-col" :sm="4" :cols="12">
          <span class="totals__title">Total:  ${{ getFormattedValue(total) || 0 }}</span>
      </v-col>
    </v-row>
  </v-form>
</template>
<style lang="scss" scoped>

:deep(.v-combobox .v-theme--light),
:deep(.v-field__append-inner) {
  max-height: 40px !important;
}
:deep(.v-input__control .v-field__append-inner) {
  padding: 7px 0px !important;
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


:deep(.addItemBtn i) {
  padding: 12px !important;
  font-size: 16px !important;
}
:deep(.form-container) {
  margin-top: -10px !important;
  margin-left: -10px !important;
  margin-right: -10px !important;
}

:deep(.form-outer-container > :not(:last-child).deleteAbleItem) {
  margin-bottom: -45px !important;
}

.totals-col {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  justify-content: end;

  padding: 10px;
}

.addItemBtnContainer {
  display: flex !important;
  justify-content: space-between !important;
  margin-top: -30px !important;
}
.form-container.deleteAbleItem{
  margin-bottom: -45px !important;
}

</style>
