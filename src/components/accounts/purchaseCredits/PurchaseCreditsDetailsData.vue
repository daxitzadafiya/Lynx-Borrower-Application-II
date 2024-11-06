<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { purchaseCreditTypes } from "@/models/constants";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { ref, computed } from "vue";
import { number } from "@/mixins/onlyNum";

const types = ref(purchaseCreditTypes);
const additional = ref(null);
const accountAssetsStore = useAccountAndAssetsStore();
const { isOnlyNum } = number();

const remove = (index) => {
  const updated = credits.value.filter((item, i) => i !== index);
  updatePurchaseCredits(updated);
};

const addItem = () => {
  if (additional.value) return;
  additional.value = {};
};

const getType = (credit) => {
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

const setCreditType = (value, index) => {
  let nonEranestCredits = [...credits.value];
  if (additional.value) {
    let credit = {
      PurchaseCreditType:
        value.indexOf("Other") === -1 ? value.replace(/ /g, "") : "Other",
    };
    if (value.indexOf("Other") !== -1) {
      credit.PurchaseCreditTypeOtherDescription = value.split(" - ")[1]?.replace(/ /g, "");
    }
    nonEranestCredits.push(credit);
  } else {
    nonEranestCredits[index].PurchaseCreditType =
      value.indexOf("Other") === -1 ? value.replace(/ /g, "") : "Other";
    if (value.indexOf("Other") !== -1) {
      nonEranestCredits[index].PurchaseCreditTypeOtherDescription = value
        .split(" - ")[1]?.replace(/ /g, "");
    } else {
      delete nonEranestCredits[index].PurchaseCreditTypeOtherDescription;
    }
  }
  updatePurchaseCredits(nonEranestCredits);
  additional.value = null;
};

const setAmount = (value, index) => {
  const nonEranestCredits = credits.value.map((item, i) =>
    index !== i ? item : { ...item, PurchaseCreditAmount: value }
  );
  updatePurchaseCredits(nonEranestCredits);
};

const updatePurchaseCredits = (credits) => {
  const earnestCredits = accountAssetsStore
  .getPurchaseCredits()
  .filter((item) => item.PurchaseCreditType === "EarnestMoney");
  accountAssetsStore.setPurchaseCredits([...earnestCredits, ...credits]);
};

const total = computed(() => {
  return credits.value.length
    ? credits.value.reduce((acc, cur) => {
        acc += !isNaN(cur.PurchaseCreditAmount) ? +cur.PurchaseCreditAmount : 0;
        return acc;
      }, 0)
    : 0;
});

const credits = computed(() => {
  return accountAssetsStore
    .getPurchaseCredits()
    .filter((item) => item.PurchaseCreditType !== "EarnestMoney");
});
</script>
<template>
  <v-form class="fast-fail form-outer-container">
    <div v-if="credits.length">
      <v-row
        class="form-container deleteAbleItem"
        v-for="(credit, index) in credits"
        :key="index"
      >
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn dense="dense" icon="icon" @click="remove(index)" elevation="0">
            <v-icon small="small">mdi-close</v-icon>
          </v-btn>
        </v-col>
        <SelectBox
          placeholder="Purchase Credit Type"
          :items="types"
          :value="getType(credit)"
          @change="(value) => setCreditType(value, index)"
        ></SelectBox>
        <TextBox
          prefix="$"
          placeholder="Cash or Market Value"
          :value="getFormattedValue(credit.PurchaseCreditAmount)"
          @input="(e) => setAmount(+e.target.value.replace(/,/g, ''), index)"
          @keypress="(e) => isOnlyNum(e, true)"
        >
        </TextBox>
      </v-row>
      <v-row class="form-container deleteAbleItem" v-if="additional">
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn dense="dense" icon="icon" @click="additional = null" elevation="0">
            <v-icon small="small">mdi-close</v-icon>
          </v-btn>
        </v-col>
        <SelectBox
          placeholder="Purchase Credit Type"
          :items="types"
          :value="additional.PurchaseCreditType"
          @change="(value) => setCreditType(value)"
        ></SelectBox>
      </v-row>
      <v-row class="form-container addItemBtnContainer">
        <v-col class="itemContainer" cols="12" sm="8">
          <v-btn
            class="addItemBtn"
            dense="dense"
            plain="plain"
            elevation="0"
            @click="addItem"
          >
            <v-icon small="small">mdi-plus</v-icon
            ><span class="addBtnText">Add Purchase Credit</span>
          </v-btn>
        </v-col>
        <v-col class="itemContainer totalsColumn" sm="4" cols="12"
          >Total: ${{ getFormattedValue(total) || 0 }}</v-col
        >
      </v-row>
    </div>
  </v-form>
</template>
<style lang="scss" scoped>
:deep(.form-container) {
  margin: -10px -10px;
}
.deleteAbleItem {
  margin-bottom: -45px !important;
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
:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}
.form-container.addItemBtnContainer {
  margin-top: -30px !important;
  .addItemBtn {
   max-width: unset !important;
  }
}
</style>
