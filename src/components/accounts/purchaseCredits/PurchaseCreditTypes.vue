<script setup>
import { computed, ref } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";

const accountAssetsStore = useAccountAndAssetsStore();

const types = ref([
  {
    title: "Lease Purchase Fund",
    value: "LeasePurchaseFund",
  },
  {
    title: "Sweat Equity",
    value: "SweatEquity",
  },
  {
    title: "Relocation Funds",
    value: "RelocationFunds",
  },
  {
    title: "Other",
    value: "Other",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/accounts/lease-pf.svg"),
  import("@/assets/images/accounts/saving-equity.svg"),
  import("@/assets/images/accounts/relocation.svg"),
  import("@/assets/images/accounts/other.svg"),
]);

types.value.map((type, index) => (type.src = imageList[index].default));

const setType = (types) => {
  let updated = [...credits.value];
  let position = types.findIndex(
    (x) => updated.findIndex((y) => y.PurchaseCreditType === x) === -1
  );
  if (position !== -1) {
    updated.push({ PurchaseCreditType: types[position] });
  } else {
    position = updated.findIndex((x) => !types.includes(x.PurchaseCreditType));
    updated.splice(position, 1);
  }
  updatePurchaseCredits(updated);
};

const updatePurchaseCredits = (credits) => {
  const earnestCredits = accountAssetsStore
    .getPurchaseCredits()
    .filter((item) => item.PurchaseCreditType === "EarnestMoney");
  accountAssetsStore.setPurchaseCredits([...earnestCredits, ...credits]);
};

const credits = computed(() => {
  return accountAssetsStore
    .getPurchaseCredits()
    .filter((item) => item.PurchaseCreditType !== "EarnestMoney");
});
const activeTypes = computed(() => {
  return credits.value.length ? credits.value.map((item) => item.PurchaseCreditType) : [];
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please select the types of Purchase Credits you are receiving for this Loan
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="activeTypes"
        multiple="multiple"
        @update:modelValue="(val) => setType(val)"
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="({ src, title, value }, index) in types"
            :key="index"
            :value="value"
            :lgVal="3"
          >
            <inline-svg :src="src"></inline-svg>
            <p>{{ title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-btn-group--density-default.v-btn-group) {
  height: 100% !important;
}

.form-container {
  margin: -10px -10px !important;
}
</style>
