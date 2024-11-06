<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { ref, defineEmits, computed, onMounted } from "vue";
import { useAccountAndAssetsStore } from "@/stores/accountsAndAssets";
import { useRoute } from "vue-router";
import { number } from "@/mixins/onlyNum";

const accountAssetsStore = useAccountAndAssetsStore();
const emit = defineEmits(["validation-status"]);
const additional = ref(null);
const isDialog = ref(false);
const isFixDialog = ref(false);
const removeIndex = ref(-1);
const route = useRoute();
const { isOnlyNum } = number();

const made = ref([
  {
    label: "To Be Made",
    value: "ToBeMade",
  },
  {
    label: "Made",
    value: "Made",
  },
]);

const cleared = ref([
  {
    label: "Cleared",
    value: true,
  },
  {
    label: "Not Cleared",
    value: false,
  },
]);

const removeCredit = () => {
  const credits = earnStMoneyCredits.value.filter((item, i) => i !== removeIndex.value);
  updateCredits(credits);
  isDialog.value = false;
  removeIndex.value = -1;
  validateForm();
};

const removeItem = (index) => {
  removeIndex.value = index;
  isDialog.value = true;
};

const addAdditionalDeposit = () => {
  additional.value = { AssetType: "" };
};

const setAdditionalType = (account) => {
  if (!account) return;
  const credits = [
    ...earnStMoneyCredits.value,
    {
      PurchaseCreditType: "EarnestMoney",
      SourceAccount: account,
    },
  ];
  updateCredits(credits);
  additional.value = null;
  validateForm();
};

const setCreditProp = (prop, value, index) => {
  const credits = earnStMoneyCredits.value.map((item, i) =>
    index !== i ? item : { ...item, [prop]: value }
  );
  updateCredits(credits);
  validateForm();
};

const updateCredits = (credits) => {
  const filtered = accountAssetsStore
    .getPurchaseCredits()
    .filter(({ PurchaseCreditType }) => PurchaseCreditType !== "EarnestMoney");
  accountAssetsStore.setPurchaseCredits([...filtered, ...credits]);
};

const getDataValidation = () => {
  if (!earnStMoneyCredits.value.length) {
    return true;
  }
  for (let i = 0; i < earnStMoneyCredits.value.length; i++) {
    const credit = earnStMoneyCredits.value[i];
    if (
      checkCreditAmountValidation(credit) !== true ||
      !validateStatus(credit) ||
      credit.PurchaseCreditAmount <= 0 ||
      (credit.SourceAccount === "Other" && !credit.Explanation)
    ) {
      return true;
    }
  }
  return false;
};

const checkCreditAmountValidation = (val) => {
  let assetIndex = accountOptions.value.findIndex((x) => x === val.SourceAccount);
  if (val.SourceAccount !== "Other" && assetIndex !== -1) {
    if (
      accountAssetsStore.getRegularAssets()[assetIndex].AssetCashOrMarketValueAmount <
      val.PurchaseCreditAmount
    ) {
      return "Deposit Amount should not exceed Selected Account Balance";
    }
  }
  return true;
};

const validateStatus = (credit) => {
  if (
    credit.Status === "Made" &&
    credit.Cleared !== null &&
    credit.Cleared !== undefined
  ) {
    return true;
  } else if (credit.Status === "ToBeMade") {
    return true;
  }
};

const validateForm = () => {
  const isValid = getDataValidation();
  emit("validation-status", isValid);
};

const total = computed(() => {
  return earnStMoneyCredits.value.length
    ? earnStMoneyCredits.value.reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.PurchaseCreditAmount) ? +cur.PurchaseCreditAmount : 0),
        0
      )
    : 0;
});

const earnStMoneyCredits = computed(() => {
  return accountAssetsStore.getPurchaseCredits().length
    ? accountAssetsStore
        .getPurchaseCredits()
        .filter(({ PurchaseCreditType }) => PurchaseCreditType === "EarnestMoney")
    : [];
});

const accountOptions = computed(() => {
  return accountAssetsStore.getRegularAssets() &&
    accountAssetsStore.getRegularAssets().length
    ? [
        ...accountAssetsStore
          .getRegularAssets()
          .map(
            (item) =>
              `${item.AssetType}${
                item.AssetAccountIdentifier
                  ? " (*" + item.AssetAccountIdentifier + ")"
                  : ""
              }${
                item.AssetCashOrMarketValueAmount
                  ? " - $" + getFormattedValue(item.AssetCashOrMarketValueAmount)
                  : ""
              }`
          ),
        "Other",
      ]
    : ["Other"];
});

onMounted(() => {
  if (
    (earnStMoneyCredits.value.length && !route.query.yes) ||
    route.name === "accountsandassets-summary"
  ) {
    additional.value = null;
  }
  validateForm();
});
</script>

<template>
  <v-form class="fast-fail form-outer-container">
    <div>
      <v-row
        v-for="(credit, index) in earnStMoneyCredits"
        :key="index"
        class="form-container deleteAbleItem"
      >
        <v-col cols="12" sm="12" class="itemContainer itemDeleteCrossContainer">
          <v-btn icon elevation="0" dense @click="removeItem(index)">
            <v-icon small="small" dense="dense">mdi-close</v-icon>
          </v-btn>
        </v-col>
        <SelectBox
          class="fix-box"
          sm="12"
          placeholder="Choose Account"
          :value="credit.SourceAccount"
          @change="(account) => setCreditProp('SourceAccount', account, index)"
          :items="accountOptions"
        />
        <v-col class="itemContainer" sm="12" md="6" lg="4">
          <Radio
            class="mt-0 mt-md-5 pt-0 pt-md-4"
            :options="made"
            :value="credit.Status"
            @change="
              (val) => {
                setCreditProp('Status', val, index);
              }
            "
          ></Radio>
        </v-col>
        <TextBox
          class="fix-box"
          sm="12"
          md="6"
          lg="4"
          placeholder="Deposit Amount"
          prefix="$"
          :value="getFormattedValue(credit.PurchaseCreditAmount) || ''"
          @input="
            (e) =>
              setCreditProp(
                'PurchaseCreditAmount',
                +e.target.value.replace(/,/g, ''),
                index
              )
          "
          @keypress="(e) => isOnlyNum(e, true)"
        ></TextBox>
        <!-- :rules="[checkCreditAmountValidation(credit)]" -->

        <v-col
          class="itemContainer"
          sm="12"
          md="6"
          lg="4"
          v-if="credit.Status === 'Made'"
        >
          <Radio
            class="mt-0 mt-lg-5 pt-0 pt-lg-4"
            :options="cleared"
            :value="credit.Cleared"
            @change="
              (val) => {
                setCreditProp('Cleared', val, index);
              }
            "
          ></Radio>
        </v-col>
        <TextArea
          v-if="credit.SourceAccount === 'Other'"
          :smVal="12"
          class="describeText"
          placeholder="Please describe where the funds for the deposit will come from"
          :rows="1"
          :value="credit.Explanation"
          @onChange="(e) => setCreditProp('Explanation', e, index)"
        ></TextArea>
      </v-row>
    </div>

    <v-row v-if="additional" class="form-container deleteAbleItem">
      <v-col cols="12" sm="12" class="itemContainer itemDeleteCrossContainer">
        <v-btn icon elevation="0" dense @click="additional = null">
          <v-icon small="small" dense="dense">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <SelectBox
        sm="12"
        :value="additional.PurchaseCreditType"
        @change="(type) => setAdditionalType(type)"
        :items="accountOptions"
        placeholder="Choose Account"
      />
    </v-row>

    <v-row class="form-container addItemBtnContainer">
      <v-col cols="12" sm="6" class="itemContainer pb-3">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addAdditionalDeposit"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add additional deposit</span>
        </v-btn>
      </v-col>
      <v-col class="text-block__col totals-col" :sm="4" :cols="12">
        <span class="totals__title">Total: ${{ getFormattedValue(total) || 0 }}</span>
      </v-col>
    </v-row>
    <v-dialog v-model="isDialog" max-width="290">
      <v-card>
        <v-card-title class="d-flex justify-center text-black--text"
          >Are you sure?
        </v-card-title>
        <v-card-text>
          <v-row class="justify-space-around">
            <CustomButton
              value="Yes"
              customClass="primary-button"
              width="120px"
              @onHandleClick="removeCredit()"
            ></CustomButton>
            <CustomButton
              value="No"
              width="120px"
              customClass="button-no"
              isOutlined
              @onHandleClick="isDialog = false"
            ></CustomButton>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-form>
</template>
<style lang="scss" scoped>
.v-input.v-radio-group {
  display: flex;
  max-width: 100%;
  text-align: left;
  height: 40px;
  display: flex;
  align-items: center;
  @media (min-width: $md-tablet-width) {
    padding-top: 16px;
    margin-top: 20px;
  }
  :deep(.v-selection-control-group) {
    display: flex;
    width: 100%;
    flex-direction: unset !important;
    flex-wrap: wrap;
    .v-selection-control {
      flex: 1 1 auto !important;
      margin-right: 16px;
      .v-label {
        font-size: 14px !important;
        opacity: 1 !important;
        letter-spacing: normal;
      }
    }
    .v-selection-control__wrapper,
    .v-selection-control__input {
      width: auto !important;
      height: auto !important;
      i{
        font-size: 24px !important
      }
    }
    .v-selection-control__wrapper {
      margin-right: 8px;
    }
  }
}
:deep(.describeText .v-text-field .v-field) {
  padding: 0 10px;
}
.itemDeleteCrossContainer {
  :deep(.v-btn--icon.v-btn--density-default) {
    height: 36px !important;
    width: 36px !important;
    background: transparent;
  }
  :deep(.v-icon){
    font-size: 16px;
    color: $close-icon-color !important;
  }
}

:deep(.addItemBtn i) {
  padding: 12px !important;
  font-size: 16px !important;
}
:deep(.form-container) {
 margin: -10px !important;
}

:deep(.form-outer-container > :not(:last-child).deleteAbleItem) {
  margin-bottom: -45px !important;
}

.totals-col {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  justify-content: end;
  padding: 10px;
}

.addItemBtnContainer {
  display: flex !important;
  justify-content: space-between !important;
  margin-top: -30px !important;
}
.form-container.deleteAbleItem {
  margin-bottom: -45px !important;
}
</style>
