<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { sellerCreditTypes } from "@/models/constants";
import SummaryData from "@/components/accounts/sellerCredits/SummaryData.vue";
import { ref } from "vue";
import { useGeneralStore } from "@/stores/generalStore";

const accountAssetsStore = useAccountAndAssetsStore();
const generalStore = useGeneralStore();

const dataBeforeEdit = ref([]);

const getSellerCreditTypeText = (val) => {
  let sellerCreditTypeIndex = sellerCreditTypes.findIndex((x) => x.value === val);
  if (sellerCreditTypeIndex === -1) return null;
  return sellerCreditTypes[sellerCreditTypeIndex].text;
};

const onCancelClicked = () => {
  accountAssetsStore.setSellerCredits(dataBeforeEdit.value);
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(
    JSON.stringify(accountAssetsStore.getSellerCredits())
  );
};
</script>
<template>
  <NewSummaryControl
    header="Seller Credits"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="
          accountAssetsStore.getSellerCredits() == null ||
          accountAssetsStore.getSellerCredits().length === 0
        "
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Seller Credits.</div>
        </v-col>
      </v-row>
      <div
        class="summary-content-container seller-container"
        v-else
        v-for="(credit, index) in accountAssetsStore.getSellerCredits()"
        :key="index"
      >
        <div
          class="main-card"
          :class="(index + 1) % 2 == 0 ? 'card-light-purple' : 'card-normal'"
        >
          <v-row class="seller-card">
            <v-col sm="4" cols="12">
              <div class="text">
                <span class="card-title">Credit Type: </span>
                <span>{{ getSellerCreditTypeText(credit.SellerCreditType) || "-" }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Credit Amount: </span>
                <span>$ {{ getFormattedValue(credit.SellerCreditAmount) || 0 }}.00</span>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
    <template v-slot:editContent>
      <SummaryData></SummaryData>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
:deep(.summaryCardViewMode) {
  padding: 15px !important;
}

.seller-container {
  border: 1px solid $gray4;
  border-radius: 8px !important;
  padding: 0 !important;
  margin: 0 0 13px 0 !important;
  &:last-child {
    margin-bottom: 0 !important;
  }
}
.main-card .seller-card {
  margin: 0 !important;
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
.card-normal {
  background-color: $gray1;
}

.card-light-purple {
  background-color: $summary-table-even-row-colorV2;
}
</style>
