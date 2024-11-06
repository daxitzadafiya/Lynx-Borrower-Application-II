<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { computed, ref } from "vue";
import { sellerCreditTypes } from "@/models/constants";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";

const { isOnlyNum } = number();
const accountAssetsStore = useAccountAndAssetsStore();

const additional = ref(null);
const types = ref(sellerCreditTypes);

const remove = (index) => {
  const filtered = accountAssetsStore.getSellerCredits().filter((item, i) => i !== index);
  accountAssetsStore.setSellerCredits(filtered);
};

const addItem = () => {
  if (additional.value) return;
  additional.value = {};
};

const setAdditionalType = (type) => {
  accountAssetsStore.setSellerCredits([
    ...accountAssetsStore.getSellerCredits(),
    { SellerCreditType: type },
  ]);
  additional.value = null;
};

const setCreditProp = (prop, value, index) => {
  const credits = accountAssetsStore
    .getSellerCredits()
    .map((item, i) => (index !== i ? item : { ...item, [prop]: value }));
  accountAssetsStore.setSellerCredits(credits);
};

const total = computed(() => {
  return accountAssetsStore.getSellerCredits().length
    ? accountAssetsStore.getSellerCredits().reduce((acc, cur) => {
        acc += !isNaN(cur.SellerCreditAmount) ? +cur.SellerCreditAmount : 0;
        return acc;
      }, 0)
    : 0;
});
</script>
<template>
  <v-form class="fast-fail form-outer-container">
    <div v-if="accountAssetsStore.getSellerCredits().length">
      <v-row
        v-for="(credit, index) in accountAssetsStore.getSellerCredits()"
        :key="index"
        class="form-container deleteAbleItem"
      >
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn dense icon @click="remove(index)" elevation="0">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-col>

        <SelectBox
          placeholder="Credit Type"
          :items="types"
          itemText="text"
          itemValue="value"
          :value="credit.SellerCreditType"
          @change="(value) => setCreditProp('SellerCreditType', value, index)"
        />

        <TextBox
          prefix="$"
          placeholder="Credit Amount"
          :value="getFormattedValue(credit.SellerCreditAmount)"
          @input="
            (e) =>
              setCreditProp(
                'SellerCreditAmount',
                +e.target.value.replace(/,/g, ''),
                index
              )
          "
          @keypress="(e) => isOnlyNum(e, true)"
        />
      </v-row>
    </div>

    <v-row v-if="additional" class="form-container deleteAbleItem">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense icon @click="additional = null" elevation="0">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>

      <SelectBox
        placeholder="Credit Type"
        :items="types"
        itemText="text"
        itemValue="value"
        :value="additional.SellerCreditType"
        @change="(value) => setAdditionalType(value)"
      />
    </v-row>

    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="6">
        <v-btn dense plain elevation="0" @click="addItem" class="addItemBtn">
          <v-icon small>mdi-plus</v-icon>
          <span class="addBtnText">Add Seller Credit</span>
        </v-btn>
      </v-col>

      <v-col class="itemContainer totalsColumn" cols="12" sm="6">
        Total: ${{ getFormattedValue(total) || 0 }}
      </v-col>
    </v-row>
  </v-form>
</template>
<style lang="scss" scoped>
:deep(.addItemBtnContainer) {
  margin-top: -30px !important;
}
.deleteAbleItem {
  margin: -10px -10px -45px -10px !important;
}

.itemDeleteCrossContainer {
  :deep(.v-btn--icon.v-btn--density-default) {
    height: 36px !important;
    width: 36px !important;
    background: transparent;
  }
}
:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}
.form-container.addItemBtnContainer .addItemBtn {
  max-width: unset !important;
}
:deep(.itemDeleteCrossContainer .v-icon) {
  font-size: 16px;
  color: $close-icon-color !important;
}
:deep(.v-field__field) {
  align-items: center !important;
  height: 40px;
}
:deep(.v-field__input) {
  padding: 12px !important;
}
:deep(.v-field--active.v-field--focused .v-text-field__prefix) {
  color: $black !important;
}
:deep(.v-text-field--prefixed.v-text-field .v-field__input) {
  padding: 4px !important;
}
:deep(.v-select .v-theme--light),
:deep(.v-field__append-inner) {
  max-height: 40px !important;
}
:deep(.v-text-field__prefix) {
  padding-left: 12px;
}
</style>
