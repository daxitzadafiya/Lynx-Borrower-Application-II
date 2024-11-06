<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { regularAssetsTypes, otherAssetsTypes } from "@/models/constants";
import { computed, ref } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";

const accountAssetsStore = useAccountAndAssetsStore();

const headers = ref([
  {
    title: "Account Type",
    key: "AssetType",
    class: "primary--text",
  },
  {
    title: "Financial Institution",
    key: "FullName",
    class: "primary--text",
  },
  {
    title: "Last 4 of Acct#",
    key: "AssetAccountIdentifier",
    class: "primary--text",
  },
  {
    title: "Ownership Type",
    key: "OwnershipType",
    class: "primary--text",
  },
  {
    title: "Cash or Market Value",
    key: "AssetCashOrMarketValueAmount",
    class: "primary--text",
  },
]);

const getDisplayText = (selection) => {
  var found = regularAssetsTypes.find((type) => type.value == selection);
  return found ? found.text : selection;
};

const getOtherAssetsDisplayText = (selection) => {
  var found = otherAssetsTypes.find((type) => type.value == selection);
  return found ? found.text : selection;
};

const assets = computed(() => {
  return accountAssetsStore.getRegularAssets() && accountAssetsStore.getRegularAssets()
    ? accountAssetsStore.getRegularAssets()
    : [];
});

const otherAssetsTotal = computed(() => {
  return accountAssetsStore.getOtherAssets().length
    ? accountAssetsStore.getOtherAssets().reduce((acc, cur) => {
        acc += !isNaN(cur.AssetCashOrMarketValueAmount)
          ? +cur.AssetCashOrMarketValueAmount
          : 0;
        return acc;
      }, 0)
    : 0;
});
</script>
<template>
  <div>
    <v-data-table
      :class="{
        'content-table': true,
        emptyTable: assets.length === 0,
      }"
      :headers="headers"
      :items="assets"
      disable-sort
      disable-pagination
      hide-default-footer
      :mobile-breakpoint="0"
    >
      <template v-slot:[`item.AssetType`]="{ item }"
        ><span class="mw-220">{{ getDisplayText(item.AssetType) }}</span>
      </template>
      <template v-slot:[`item.AssetCashOrMarketValueAmount`]="{ item }"
        ><span class="mw-220">{{
          getFormattedValue(item.AssetCashOrMarketValueAmount)
        }}</span>
      </template>
    </v-data-table>
    <div class="other-asset-container">
      <div class="other-asset-heading">
        <span>Other Assets You Have</span>
      </div>
      <div
        class="summary-content-container asset-container"
        v-for="(otherAsset, index) in accountAssetsStore.getOtherAssets()"
        :key="index"
      >
        <div
          class="main-card"
          :class="(index + 1) % 2 == 0 ? 'card-light-purple' : 'card-normal'"
        >
          <v-row class="other-asset">
            <v-col
              sm="4"
              class="p-0"
              :class="
                (otherAsset.DateReceived && otherAsset.FundsSourceType) ||
                (otherAsset.FundsSourceType && otherAsset.ClosingDate)
                  ? 'pb-2'
                  : ''
              "
              cols="12"
            >
              <div class="text">
                <span class="card-title">Asset Type: </span>
                <span class="card-title">{{
                  getOtherAssetsDisplayText(otherAsset.AssetType)
                }}</span>
              </div>
            </v-col>
            <v-col v-if="otherAsset.DateReceived" sm="4" class="p-0 pb-2" cols="12">
              <div class="text">
                <span class="card-title">Date Received: </span>
                <span class="card-title">{{ otherAsset.DateReceived || "-" }}</span>
              </div>
            </v-col>
            <v-col v-if="otherAsset.ClosingDate" sm="4" class="p-0 pb-2" cols="12">
              <div class="text">
                <span class="card-title">Closing Date: </span>
                <span class="card-title">{{ otherAsset.ClosingDate || "-" }}</span>
              </div>
            </v-col>
            <v-col v-if="otherAsset.FundsSourceType" sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Source: </span>
                <span class="card-title">{{
                  (otherAsset.FundsSourceType === "Other"
                    ? otherAsset.FundsSourceTypeOtherDescription
                    : otherAsset.FundsSourceType) || "-"
                }}</span>
              </div>
            </v-col>
            <v-col
              v-if="otherAsset.AssetTypeOtherDescription"
              sm="4"
              class="p-0"
              cols="12"
            >
              <div class="text">
                <span class="card-title">Description: </span>
                <span class="card-title">{{
                  otherAsset.AssetTypeOtherDescription === "OtherNonLiquidAsset"
                    ? "Other Non Liquid Asset"
                    : otherAsset.AssetTypeOtherDescription === "OtherLiquidAsset"
                    ? "Other Liquid Asset"
                    : "-"
                }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Asset Amount: </span>
                <span class="card-title"
                  >$
                  {{
                    getFormattedValue(otherAsset.AssetCashOrMarketValueAmount) || 0
                  }}.00</span
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
      <div class="summary-content-container asset-container">
        <div
          class="main-card"
          :class="
            (accountAssetsStore.getOtherAssets().length + 1) % 2 == 0
              ? 'card-light-purple'
              : 'card-normal'
          "
        >
          <v-row class="other-asset">
            <v-col sm="8" class="p-0" cols="0"> </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Total Amount: </span>
                <span class="card-title"
                  >$ {{ getFormattedValue(otherAssetsTotal) || 0}}.00</span
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.infoText {
  color: $gray3;
}
.main-card {
  width: 100%;
  padding: 15px !important;
  .other-asset {
    margin: 0;
  }
}
.card-normal {
  background-color: $gray1;
}
.card-light-purple {
  background-color: $summary-table-even-row-colorV2;
}
.asset-container {
  border: 1px solid $gray4;
  border-radius: 8px;
  padding: 0;
  margin: 10px 0 !important;
  &:last-child {
    margin-bottom: 0 !important;
  }
}
.card-title {
  font-size: 14px;
  font-weight: 500;
  color: $secondary-text-color;
}
.text {
  margin-left: 0 !important;
}

.other-asset-container {
  margin-top: 10px;
}

.other-asset-heading {
  font-weight: 500;
  font-size: 14px;
  color: $dark-grayV2;
  background: $table-header-bg;
  padding: 15px;
  border-radius: 8px 8px 0px 0px;
}

.p-0 {
  padding: 0 !important;
}
.pb-2 {
  padding-bottom: 8px !important;
}

:deep(th.text-start) {
  background: $table-header-bg !important;
}
:deep(.content-table th) {
  background-color: $table-header-bg !important;
  span {
    font-size: 12px !important;
    color: $table-header-text-color !important;
    
  }
}

:deep(.v-table--density-default) {
  --v-table-header-height: 48px !important;
  --v-table-row-height: 48px !important;
}
</style>
