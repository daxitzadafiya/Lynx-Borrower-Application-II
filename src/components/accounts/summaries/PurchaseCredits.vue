<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { computed, ref } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import PurchaseCreditsDetailsData from "@/components/accounts/purchaseCredits/PurchaseCreditsDetailsData.vue";
import { useGeneralStore } from "@/stores/generalStore";

const accountAssetsStore = useAccountAndAssetsStore();
const generalStore = useGeneralStore();

const dataBeforeEdit = ref([]);

const credits = computed(() => {
  return accountAssetsStore
    .getPurchaseCredits()
    .filter((item) => item.PurchaseCreditType !== "EarnestMoney");
});

const getPurchaseCreditTypeText = (credit) => {
  let value = credit.PurchaseCreditType
    ? credit.PurchaseCreditType.replace(/([a-z])([A-Z])/g, "$1 $2")
    : "";
  if (credit.PurchaseCreditTypeOtherDescription) {
    value += ` - ${credit.PurchaseCreditTypeOtherDescription.replace(
      /([a-z])([A-Z])/g,
      "$1 $2"
    )}`;
  }
  return value;
};

const onCancelClicked = () => {
  const earnestCredits = accountAssetsStore
    .getPurchaseCredits()
    .filter((item) => item.PurchaseCreditType === "EarnestMoney");
  accountAssetsStore.setPurchaseCredits([...earnestCredits, ...dataBeforeEdit.value]);
};

const onEditClicked = () => {
  generateOnCancelData();
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(credits.value));
};
</script>
<template>
  <NewSummaryControl
    header="Purchase Credits"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="credits == null || credits.length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Purchase Credits.</div>
        </v-col>
      </v-row>
      <div
        class="summary-content-container purchase-credit-container"
        v-else
        v-for="(credit, index) in credits"
        :key="index"
      >
        <div
          class="main-card"
          :class="(index + 1) % 2 == 0 ? 'card-light-purple' : 'card-normal'"
        >
          <v-row class="purchase-credit-card">
            <v-col sm="4" cols="12">
              <div class="text">
                <span class="card-title">Purchase Credit Type: </span>
                <span>{{ getPurchaseCreditTypeText(credit) || "-" }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Cash or Market Value: </span>
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
      <PurchaseCreditsDetailsData></PurchaseCreditsDetailsData>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
:deep(.summaryCardViewMode) {
  padding: 15px !important;
}
.purchase-credit-container {
  border: 1px solid $gray4;
  border-radius: 8px;
  padding: 0;
  margin: 0 0 13px 0 !important;
  &:last-child {
    margin-bottom: 0 !important;
  }
}
.main-card .purchase-credit-card {
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
