<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { computed, ref } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { giftTypes, giftSources } from "@/models/constants";
import LoanGiftsData from "@/components/accounts/gifts/LoanGiftsData.vue";
import { useGeneralStore } from "@/stores/generalStore";

const accountAssetsStore = useAccountAndAssetsStore();
const generalStore = useGeneralStore();

const dataBeforeEdit = ref([]);

const onCancelClicked = () => {
  const grants = accountAssetsStore
    .getGiftsOrGrants()
    .filter((item) => item.AsseType === "Grant");
  accountAssetsStore.setAssets({
    assets: [...dataBeforeEdit.value, ...grants],
    AssetTypeId: 2,
  });
};

const onEditClicked = () => {
  generateOnCancelData();
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(gifts.value));
};

const getGiftTypeText = (val) => {
  let giftType = giftTypes.find((x) => x.value == val);
  if (giftType == null) {
    return null;
  }
  return giftType.text;
};

const getGiftSourceText = (val) => {
  let giftSource = cashGiftsSources.value.find((x) => x.value == val);
  if (giftSource == null) {
    giftSource = propEquitySources.value.find((x) => x.value == val);
  }
  if (giftSource == null) {
    return null;
  }
  return giftSource.text;
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
  return [...giftSources, { text: "Other", value: "Other" }];
});

const propEquitySources = computed(() => {
  const result = [
    ...giftSources,
    { text: "Federal Agency", value: "FederalAgency" },
    { text: "Local Agency", value: "LocalAgency" },
    { text: "State Agency", value: "StateAgency" },
  ];
  return [...result.sort((a, b) => a.text > b.text), { text: "Other", value: "Other" }];
});
</script>
<template>
  <NewSummaryControl
    header="Gifts You Have Been Given or Will Receive for this Loan"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row class="summary-content-container" v-if="gifts == null || gifts.length === 0">
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Gifts.</div>
        </v-col>
      </v-row>
      <div
        class="summary-content-container gift-container"
        v-else
        v-for="(gift, index) in gifts"
        :key="index"
      >
        <div
          class="main-card"
          :class="(index + 1) % 2 == 0 ? 'card-light-purple' : 'card-normal'"
        >
          <v-row class="gift-card">
            <v-col sm="4" cols="12">
              <div class="text">
                <span class="card-title">Gift Type: </span>
                <span>{{ getGiftTypeText(gift.AssetType) || "-" }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Source: </span>
                <span>{{ getGiftSourceText(gift.FundsSourceType) || "-" }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Donor Name: </span>
                <span>{{ gift.DonorName || "-" }}</span>
              </div>
            </v-col>
          </v-row>
          <v-row class="gift-card">
            <v-col sm="4" cols="12" class="pt-0">
              <div class="text">
                <span class="card-title">Donor Email: </span>
                <span>{{ gift.DonorEmail || "-" }}</span>
              </div>
            </v-col>
            <v-col sm="3" cols="12" class="pt-0">
              <div class="text">
                <span class="card-title">Amount of Gift: </span>
                <span
                  >$
                  {{ getFormattedValue(gift.AssetCashOrMarketValueAmount) || 0 }}.00</span
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
    <template v-slot:editContent>
      <LoanGiftsData></LoanGiftsData>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
:deep(.summaryCardViewMode) {
  padding: 15px !important;
}
.gift-container {
  border: 1px solid $gray4;
  border-radius: 8px;
  padding: 0;
  margin: 0 0 13px 0 !important;
  &:last-child {
    margin-bottom: 0 !important;
  }
}
.main-card .gift-card {
  margin: 0;
}
.card-normal {
  background-color: $gray1;
}
.card-light-purple {
  background-color: $summary-table-even-row-colorV2;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: $summarycard-title-text-color;
}
.text {
  margin-left: 0 !important;
  font-size: 14px !important;
  line-height: 21px !important;
  span {
    font-size: 14px !important;
  }
}
</style>
