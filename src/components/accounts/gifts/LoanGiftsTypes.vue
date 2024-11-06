<script setup>
import { computed, ref } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";

const accountAssetsStore = useAccountAndAssetsStore();

const types = ref([
  {
    title: "Gift from Donor Account",
    value: "GiftOfCash",
  },
  {
    title: "Gift of Property Equity",
    value: "GiftOfPropertyEquity",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/accounts/cash-gift.svg"),
  import("@/assets/images/accounts/gift-property-equity.svg"),
]);

types.value.map((type, index) => (type.src = imageList[index].default));

const setType = (types) => {
  let updated = [...gifts.value];
  let position = types.findIndex(
    (x) => updated.findIndex((y) => y.AssetType === x) === -1
  );
  if (position !== -1) {
    updated.push({ AssetType: types[position], AssetTypeId: 2 });
  } else {
    position = updated.findIndex((x) => !types.includes(x.AssetType));
    updated.splice(position, 1);
  }
  updateAssets(updated);
};

const updateAssets = (updated) => {
  const grants = accountAssetsStore
    .getGiftsOrGrants()
    .filter((item) => item.AssetType === "Grant");
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

const activeTypes = computed(() => {
  return gifts.value.length ? gifts.value.map((item) => item.AssetType) : [];
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please select the types of Gifts you've received or plan to receive for this Loan?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="activeTypes"
        multiple="multiple"
        @update:modelValue="
          (value) => {
            setType(value);
          }
        "
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="({ src, title, value }, index) in types"
            :key="index"
            :value="value"
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
