<script setup>
import { computed, ref } from "vue";
import { useTransactionDetailsStore } from "@/stores/transactionDetailsStore";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { useGeneralStore } from "@/stores/generalStore";

const transactionStore = useTransactionDetailsStore();
const lenderInfoStore = useLenderInfoStore();
const { isOnlyNum } = number();
const generalStore = useGeneralStore();

const types = ref([
  {
    text: "Lender Credit",
    value: "LenderCredit",
  },
]);

const additional = ref(null);

const addAdjustment = () => {
  if (!isAvailableTypes.value) return;
  additional.value = {
    ClosingAdjustmentItemType: "",
    ClosingAdjustmentItemAmount: "",
  };
};

const setAdjustmentProp = (prop, value, index) => {
  if (prop === "ClosingAdjustmentItemType" && !value) return;

  let adjustments = transactionStore
    .getClosingAdjustments()
    .map((item, i) => (i !== index ? item : { ...item, [prop]: value }));
  if (prop === "ClosingAdjustmentItemAmount" && !value) {
    adjustments = adjustments.filter((item, i) => i !== index);
  }
  lenderInfoStore.updateTransactionDetails({
    prop: "ClosingAdjustments",
    value: adjustments,
  });
};

const setAdditionalType = (value) => {
  additional.value.ClosingAdjustmentItemType = value;
};

const setAdditionalAmount = (value) => {
  const additionalAmount = value;
  additional.value = {
    ...additional.value,
    ClosingAdjustmentItemAmount: additionalAmount,
  };
};

const setAdjustment = () => {
  if (additional.value.ClosingAdjustmentItemAmount) {
    const adjustments = [...transactionStore.getClosingAdjustments(), additional.value];
    lenderInfoStore.updateTransactionDetails({
      prop: "ClosingAdjustments",
      value: adjustments,
    });
  }
  additional.value = null;
};

const isAvailableTypes = computed(() => {
  const typesVals = types.value.map((item) => item.value);
  const allAdjustmentTypes = transactionStore
    .getClosingAdjustments()
    .map((item) => item.ClosingAdjustmentItemType);
  return typesVals.length !== allAdjustmentTypes.length;
});
</script>
<template>
  <v-card class="pb-1">
    <v-card-title class="p-4">Closing Adjustments</v-card-title>
    <v-card-text>
      <v-row
        class="ma-0 flex-column flex-sm-row pa-0 my-2 align-baseline"
        v-for="(adjustment, index) in transactionStore.getClosingAdjustments()"
        :key="index"
      >
        <v-col :sm="6"  md="5" :lg="4">
          <v-select
            variant="underlined"
            class="mx-1 my-0 w-100"
            dense
            :items="types"
            item-title="text"
            item-value="value"
            placeholder="Closing Adjustment Type"
            :model-value="adjustment.ClosingAdjustmentItemType"
            @update:model-value="
              (value) => setAdjustmentProp('ClosingAdjustmentItemType', value, index)
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>
        <v-col :sm="6"  md="5" :lg="4">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field w-100"
            dense
            :model-value="getFormattedValue(adjustment.ClosingAdjustmentItemAmount) || ''"
            @input="
              (e) =>
                setAdjustmentProp(
                  'ClosingAdjustmentItemAmount',
                  +e.target.value.replace(/,/g, ''),
                  index
                )
            "
            placeholder="Closing Adjustment Amount"
            hide-details
            prefix="$"
            @keypress="(e) => isOnlyNum(e, true)"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>
      </v-row>
      <v-row class="ma-0 flex-column flex-sm-row pa-0 my-2" v-if="additional">
        <v-select
          variant="underlined"
          class="mx-1 my-0 w-100"
          dense
          :items="types"
          item-title="text"
          item-value="value"
          placeholder="Closing Adjustment Type"
          :model-value="additional.ClosingAdjustmentItemType"
          @update:model-value="(value) => setAdditionalType(value)"
          :menu-props="{ light: true }"
          style="max-width: 300px; max-height: 33px"
        />
        <v-text-field
          variant="underlined"
          class="mx-1 my-0 input-field w-100"
          v-if="additional.ClosingAdjustmentItemType"
          dense
          :model-value="getFormattedValue(additional.ClosingAdjustmentItemAmount) || ''"
          @input="(e) => setAdditionalAmount(+e.target.value.replace(/,/g, ''))"
          @change="setAdjustment"
          placeholder="Closing Adjustment Amount"
          hide-details
          prefix="$"
          @keypress="(e) => isOnlyNum(e, true)"
          style="max-width: 300px; max-height: 33px"
        />
      </v-row>
      <v-row class="ma-0 pa-0 my-7">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addAdjustment"
        >
          <v-icon small="small">mdi-plus</v-icon>
          <span class="addBtnText">Add New Adjustment</span>
        </v-btn>
      </v-row>
    </v-card-text>
    <CustomButton
      class="button"
      value="Save"
      customClass="primary-button"
      @onHandleClick="generalStore.saveLoanPatches"
    />
  </v-card>
</template>
<style lang="scss" scoped>
.p-4 {
  padding: 16px;
}
:deep(.v-select) {
  .v-field__input {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    min-height: 26px;
    font-size: 13px !important;
    .v-select__selection-text {
      letter-spacing: normal;
    }
  }
  .v-field__append-inner,
  .v-field__clearable {
    padding-top: 0px !important;
    padding-bottom: 2px !important;
    min-height: 23px;
  }
}
:deep(.input-field) {
  input {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    padding-left: 0px !important;
    min-height: 23px;
    font-size: 13px !important;
    letter-spacing: normal !important;
  }
  .v-text-field__prefix {
    padding-top: 4px !important;
    padding-bottom: 0px !important;
    padding-right: 4px !important;
    min-height: 23px;
    font-size: 13px !important;
  }
}
.button {
  margin: 15px;
}
:deep(.addItemBtn i) {
  padding: 12px !important;
  font-size: 16px !important;
}
.addItemBtn {
  height: 22px !important;
  .addBtnText {
    letter-spacing: 0.1px;
  }
}
</style>
