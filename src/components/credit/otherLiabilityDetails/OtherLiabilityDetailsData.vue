<script setup>
import { computed, ref } from "vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { number } from "@/mixins/onlyNum";

const borrowersStore = useBorrowersStore();
const additional = ref(null);
const { isOnlyNum } = number();
const expenseRemainingMonthsTypes = ref([
  "Less than 10 months",
  "Greater than 10 months",
  "Ongoing",
  "Other",
]);
const items = ref([
  "Alimony",
  "Child Support",
  "Job Related Expenses",
  "Separate Maintenance Expense",
  "Other",
]);

const otherLiabilities = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.OtherLiabilitiesAndExpenses
    ? borrowersStore.Borrower.OtherLiabilitiesAndExpenses
    : [];
});

const setLiability = (value, prop, index) => {
  let OtherLiabilitiesAndExpenses = [...otherLiabilities.value];
  if (OtherLiabilitiesAndExpenses.length === index) {
    OtherLiabilitiesAndExpenses.push({ [prop]: value });
  } else {
    OtherLiabilitiesAndExpenses = OtherLiabilitiesAndExpenses.map((item, i) => {
      if (i === index) {
        item[prop] = value;
      }
      if (prop === "ExpenseType" && value !== "Other") {
        delete item.ExpenseTypeOtherDescription;
      }
      if (prop === "ReasonCode" && value !== "Other") {
        delete item.LiabilityDisputeReasonExplanation;
      }
      return item;
    });
  }
  borrowersStore.updateBorrower({
    prop: "OtherLiabilitiesAndExpenses",
    value: OtherLiabilitiesAndExpenses,
  });
  additional.value = null;
};

const addLiability = () => {
  additional.value = { ExpenseType: "" };
};

const remove = (index) => {
  const OtherLiabilitiesAndExpenses = otherLiabilities.value.filter(
    (item, i) => index !== i
  );
  borrowersStore.updateBorrower({
    prop: "OtherLiabilitiesAndExpenses",
    value: OtherLiabilitiesAndExpenses,
  });
};
</script>

<template>
  <v-form class="fast-fail form-outer-container">
    <v-row
      v-for="(liability, index) in otherLiabilities"
      :key="index"
      class="form-container deleteAbleItem"
    >
      <v-col cols="12" sm="12" class="itemContainer itemDeleteCrossContainer">
        <v-btn icon elevation="0" dense @click="remove(index)">
          <v-icon small="small" dense="dense">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <ComboBox
        :value="
          liability.ExpenseType
            ? liability.ExpenseType.replace(/([a-z])([A-Z])/g, '$1 $2')
            : ''
        "
        :items="items"
        placeholder="Liability/Expense"
        @change="(e) => setLiability(e ? e.replace(/ /g, '') : '', 'ExpenseType', index)"
      />
      <TextBox
        v-if="liability.ExpenseType === 'Other'"
        :value="liability.ExpenseTypeOtherDescription"
        placeholder="Other Description"
        @input="(e) => setLiability(e.target.value, 'ExpenseTypeOtherDescription', index)"
      />
      <TextBox
        :value="getFormattedValue(liability.ExpenseMonthlyPaymentAmount)"
        prefix="$"
        class="prefix"
        placeholder="Monthly Payment"
        @input="
          (e) =>
            setLiability(
              +e.target.value.replace(/,/g, ''),
              'ExpenseMonthlyPaymentAmount',
              index
            )"
        @keypress="(e) => isOnlyNum(e, true)"
      />
      <ComboBox
        :items="expenseRemainingMonthsTypes"
        :value="liability.ExpenseRemainingMonthsType"
        placeholder="How many more months are you required to make these payments?"
        @change="
          (e) => {
            setLiability(e, 'ExpenseRemainingMonthsType', index);
            if (e !== 'Other') {
              setLiability('', 'ExpenseRemainingMonthsOtherDescription', index);
            }
          }"
      />
      <TextBox
        v-if="liability.ExpenseRemainingMonthsType === 'Other'"
        :value="liability.ExpenseRemainingMonthsOtherDescription"
        placeholder="Other Explanation"
        @input="
          (e) =>
            setLiability(e.target.value, 'ExpenseRemainingMonthsOtherDescription', index)"
      />
      <TextBox
        v-if="liability.ExpenseType !== 'Other' && liability.ReasonCode !== 'Ongoing'"
        :value="liability.ExpenseRemainingTermMonthsCount"
        inputmode="numeric"
        pattern="[0-9]*"
        placeholder="Number of Months"
        @input="
          (e) => setLiability(+e.target.value, 'ExpenseRemainingTermMonthsCount', index)"
        @keypress="(e) => isOnlyNum(e)"
      />
    </v-row>

    <v-row v-if="additional" class="form-container deleteAbleItem">
      <v-col cols="12" sm="12" class="itemContainer itemDeleteCrossContainer">
        <v-btn icon elevation="0" dense @click="additional = null">
          <v-icon small="small" dense="dense">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <ComboBox
        :value="additional?.ExpenseType"
        :items="items"
        placeholder="Liability/Expense"
        @change="
          (e) =>
            setLiability(
              e ? e.replace(/ /g, '') : '',
              'ExpenseType',
              otherLiabilities.length
            )"
      />
    </v-row>

    <v-row class="form-container addItemBtnContainer pt-0">
      <v-col cols="12" sm="12" class="itemContainer pb-3">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addLiability"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add Other Liabilty</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
<style lang="scss" scoped>
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

.deleteAbleItem{
  margin-bottom: -20px !important;
}
:deep(.addItemBtn i) {
  padding: 12px !important;
  font-size: 16px !important;
}
:deep(.form-container) {
  margin-top: -10px !important;
  margin-left: -10px !important;
  margin-right: -10px !important;
}

:deep(.form-outer-container > :not(:last-child).deleteAbleItem) {
  margin-bottom: -45px !important;
}
</style>
