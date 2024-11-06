<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { grantSources } from "@/models/constants";
import { computed, ref } from "vue";
import LoanGrantsData from "@/components/accounts/grants/LoanGrantsData.vue";
import { useGeneralStore } from "@/stores/generalStore";

const accountAssetsStore = useAccountAndAssetsStore();
const generalStore = useGeneralStore();

const dataBeforeEdit = ref([]);

const grants = computed(() => {
  return accountAssetsStore
    .getGiftsOrGrants()
    .filter((item) => item.AssetType === "Grant");
});

const getFundSourceText = (val) => {
  let fundSource = grantSources.find((x) => x.value === val);
  if (fundSource == null) {
    return null;
  }
  return fundSource.text;
};

const onGrantsEditClicked = () => {
  generateGrantsOnCancelData();
};

const onGrantsCancelClicked = () => {
  const gifts = accountAssetsStore
    .getGiftsOrGrants()
    .filter((item) => item.AssetType !== "Grant");
  accountAssetsStore.setAssets({
    assets: [...dataBeforeEdit.value, ...gifts],
    AssetTypeId: 2,
  });
};

const generateGrantsOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(grants.value));
};
const onGrantsSaveClicked = () => {
  generalStore.saveLoanPatches();
};
</script>
<template>
  <NewSummaryControl
    header="Grants or Down Payment Assistance for this Loan"
    @edit="onGrantsEditClicked"
    @cancel="onGrantsCancelClicked"
    @save="onGrantsSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="grants == null || grants.length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Grants.</div>
        </v-col>
      </v-row>
      <div
        class="summary-content-container grant-container"
        v-else
        v-for="(grant, index) in grants"
        :key="index"
      >
        <div
          class="main-card"
          :class="(index + 1) % 2 == 0 ? 'card-light-purple' : 'card-normal'"
        >
          <v-row class="grant-card">
            <v-col sm="4" cols="12">
              <div class="text">
                <span class="card-title">Source: </span>
                <span>{{ getFundSourceText(grant.FundsSourceType) || "-" }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Organization: </span>
                <span>{{ grant.DonorName || "-" }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Amount of DPA or Grant: </span>
                <span
                  >$
                  {{
                    getFormattedValue(grant.AssetCashOrMarketValueAmount) || 0
                  }}.00</span
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
    <template v-slot:editContent>
      <LoanGrantsData></LoanGrantsData>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
:deep(.summaryCardViewMode) {
  padding: 15px !important;
}
.grant-container {
  border: 1px solid $gray4;
  border-radius: 8px;
  padding: 0;
  margin: 0 0 13px 0 !important;
  &:last-child {
    margin-bottom: 0 !important;
  }
}
.main-card .grant-card {
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
