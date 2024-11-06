<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { computed, ref } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import DepositDetailsData from "@/components/accounts/purchaseCredits/DepositsDetailsData.vue";
import { useGeneralStore } from "@/stores/generalStore";

const accountAssetsStore = useAccountAndAssetsStore();
const generalStore = useGeneralStore();

const dataBeforeEdit = ref([]);

const earnStMoneyCredits = computed(() => {
  return accountAssetsStore
    .getPurchaseCredits()
    .filter((item) => item.PurchaseCreditType === "EarnestMoney");
});

const onCancelClicked = () => {
  const filtered = accountAssetsStore
    .getPurchaseCredits()
    .filter(({ PurchaseCreditType }) => PurchaseCreditType !== "EarnestMoney");
  accountAssetsStore.setPurchaseCredits([...filtered, ...dataBeforeEdit.value]);
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(earnStMoneyCredits.value));
};
</script>
<template>
  <NewSummaryControl
    header="Required Deposits"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="earnStMoneyCredits == null || earnStMoneyCredits.length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Required Deposits.</div>
        </v-col>
      </v-row>
      <div
        class="summary-content-container deposit-container"
        v-else
        v-for="(credit, index) in earnStMoneyCredits"
        :key="index"
      >
        <div
          class="main-card"
          :class="(index + 1) % 2 == 0 ? 'card-light-purple' : 'card-normal'"
        >
          <v-row class="deposit-card">
            <v-col sm="4" cols="12">
              <div class="text">
                <span class="card-title">Account: </span>
                <span>{{ credit.SourceAccount || "-" }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Status: </span>
                <span>{{
                  credit.Status == "ToBeMade"
                    ? "to be made"
                    : credit.Status == "Made"
                    ? "made"
                    : "-"
                }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Deposit Amount: </span>
                <span
                  >$ {{ getFormattedValue(credit.PurchaseCreditAmount) || 0 }}.00</span
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
    <template v-slot:editContent>
      <DepositDetailsData></DepositDetailsData>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
:deep(.summaryCardViewMode) {
  padding: 15px !important;
}
.deposit-container {
  border: 1px solid $gray4;
  border-radius: 8px;
  padding: 0;
  margin: 0 0 13px 0 !important;
  &:last-child {
    margin-bottom: 0 !important;
  }
}
.main-card .deposit-card {
  margin: 0;
}
.text {
  margin-left: 0 !important;
  font-size: 14px !important;
  line-height: 21px !important;
  span {
    font-size: 14px !important;
  }
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: $summarycard-title-text-color;
}
</style>
