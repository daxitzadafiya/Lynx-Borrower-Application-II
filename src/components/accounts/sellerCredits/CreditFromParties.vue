<script setup>
import { computed, ref } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";

const accountAssetsStore = useAccountAndAssetsStore();
const { isOnlyNum } = number();
const focusedValue = ref("");
const focusedType = ref("");
const types = ref([
  {
    title: "Seller",
    value: "Seller",
  },
  {
    title: "Builder",
    value: "Builder",
  },
  {
    title: "Real Estate Agent",
    value: "RealEstateAgent",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/accounts/seller.svg"),
  import("@/assets/images/accounts/builder.svg"),
  import("@/assets/images/accounts/agent.svg"),
]);

types.value.map((type, index) => (type.src = imageList[index].default));

const getCreditAmount = (value) => {
  const creditIndex = activeTypes.value.indexOf(value);
  if (
    (creditIndex === -1 ||
      accountAssetsStore.getSellerCredits()[creditIndex].SellerCreditAmount === 0) &&
    focusedValue.value === value &&
    focusedType.value === "amount"
  ) {
    return "";
  }
  if (creditIndex !== -1) {
    return (
      getFormattedValue(
        accountAssetsStore.getSellerCredits()[creditIndex].SellerCreditAmount
      ) || 0
    );
  }
  return 0;
};

const removeZeroAmount = (type, value) => {
  focusedType.value = type;
  focusedValue.value = value;
};

const addZero = () => {
  focusedType.value = "";
  focusedValue.value = "";
};

const getCreditPercent = (value) => {
  const creditIndex = activeTypes.value.indexOf(value);
  if (
    (creditIndex === -1 ||
      accountAssetsStore.getSellerCredits()[creditIndex].SellerCreditPercentage === 0) &&
    focusedValue.value === value &&
    focusedType.value === "percentage"
  ) {
    return "";
  }
  if (creditIndex !== -1) {
    return accountAssetsStore.getSellerCredits()[creditIndex].SellerCreditPercentage || 0;
  }
  return 0;
};

const setAmount = (amount, value) => {
  let credits = [...accountAssetsStore.getSellerCredits()];
  const position = activeTypes.value.indexOf(value);
  if (position === -1) {
    credits.push({ SellerCreditAmount: amount, SellerCreditType: value });
  } else {
    if (!amount) {
      credits.splice(position, 1);
    } else {
      credits[position].SellerCreditAmount = amount;
      if (amount != 0) {
        credits[position].SellerCreditPercentage = 0;
      }
    }
  }
  accountAssetsStore.setSellerCredits(credits);
};

const setPercentage = (percentage, value) => {
  let credits = [...accountAssetsStore.getSellerCredits()];
  const position = activeTypes.value.indexOf(value);
  if (position === -1) {
    credits.push({
      SellerCreditPercentage: percentage,
      SellerCreditType: value,
    });
  } else {
    if (!percentage) {
      if (credits[position].SellerCreditAmount === 0) credits.splice(position, 1);
    } else {
      credits[position].SellerCreditPercentage = percentage;
      if (percentage != 0) {
        credits[position].SellerCreditAmount = 0;
      }
    }
  }
  accountAssetsStore.setSellerCredits(credits);
};

const checkAmountOrPercentage = (value) => {
  const creditIndex = activeTypes.value.indexOf(value);
  if (creditIndex !== -1) {
    return (
      (getCreditAmount(value) !== 0 && getCreditAmount(value) !== "") ||
      (getCreditPercent(value) !== 0 && getCreditPercent(value) !== "")
    );
  }
  return false;
};

const activeTypes = computed(() => {
  return accountAssetsStore.getSellerCredits().length
    ? accountAssetsStore.getSellerCredits().map((item) => item.SellerCreditType)
    : [];
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter the credit amounts or percentatges that you are receiving from any of
        these parties, towards your closing costs.
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container justify-center">
        <ToggleCard
          class="toggleCard"
          :mdVal="4"
          :lgVal="3"
          :smVal="6"
          v-for="({ src, title, value }, index) in types"
          :key="index"
          :isChecked="checkAmountOrPercentage(value)"
          :bordered="checkAmountOrPercentage(value)"
        >
          <div class="toggleCardContainer">
            <inline-svg
              class="itemImage noStroke"
              :class="
                activeTypes.indexOf(value) !== -1
                  ? 'tile-image tile-image-selected'
                  : 'tile-image'
              "
              :src="src"
            ></inline-svg>
            <div class="text-body-1 mt-3 font-weight-bold itemTitle">
              {{ title }}
              <v-icon
                class="remove-amount-button"
                v-if="checkAmountOrPercentage(value)"
                @click="setAmount(0, value)"
                >mdi-close
              </v-icon>
            </div>
            <p class="blackText d-block">Credit Amount</p>
            <v-row class="justify-center">
              <TextBox
                smVal=""
                :value="getCreditAmount(value)"
                @input="(e) => setAmount(+e.target.value.replace(/,/g, ''), value)"
                class="px-0"
                prefix="$"
                @keypress="(e) => isOnlyNum(e, true)"
                @focus="(e) => removeZeroAmount('amount', value)"
                @blur="(e) => addZero()"
              />
              <div class="px-1 py-2 d-flex justify-center align-center">
                <span>Or</span>
              </div>
              <TextBox
                smVal=""
                class="px-0"
                prefix="%"
                :value="getCreditPercent(value)"
                @input="(e) => setPercentage(+e.target.value.replace(/,/g, ''), value)"
                @keypress="(e) => isOnlyNum(e, true)"
                @focus="(e) => removeZeroAmount('percentage', value)"
                @blur="(e) => addZero()"
              />
            </v-row>
          </div>
        </ToggleCard>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.v-form {
  .v-row {
    margin: -10px;
  }
}
.toggleCard {
  display: flex;
  justify-content: center;
  align-items: center;
  :deep(.cardBtn) {
    height: 100% !important;
    border: 2px solid transparent;
    background-color: $gray1;
    pointer-events: none;
    transition: all ease-in-out 0.3s;
    justify-content: unset !important;
    box-shadow: none;
    &:hover {
      .btnContent {
        opacity: 1 !important;
      }
    }
    .btnContent {
      width: 100%;
      .blackText {
        margin-bottom: 10px;
      }
    }
    .v-row {
      margin: -1px -12px !important;
      .titleText {
        display: none;
      }
      .v-field--active.v-field--focused .v-text-field__prefix {
        color: $black !important;
      }
      .v-field__input{
        padding-left: 4px !important;
        font-weight: 500;
      }
      .itemContainer {
        padding: 0 !important;
      }
    }
    .v-btn__underlay,
    .v-btn__overlay {
      display: none;
    }
  }

  .toggleCardContainer {
    padding: 20px 5px;
    pointer-events: all;
    color: $black;
    .itemImage {
      height: 40px;
      fill: $black;
    }
    .itemTitle {
      text-transform: none;
    }
  }
  :deep(legend) {
    display: none;
  }
}

.blackText {
  color: $black;
}

.itemTitle {
  position: relative;
}

.remove-amount-button {
  position: absolute;
  right: -10px;
  top: 0;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.26) !important;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
  cursor: pointer;
  &.v-icon {
    &:hover {
      color: $icon-color !important;
    }
  }
}
:deep(.v-text-field__prefix, .v-text-field__suffix) {
  padding: 10px;
  min-height: unset !important;
  padding-right: 0;
  font-weight: 500;
}
</style>
