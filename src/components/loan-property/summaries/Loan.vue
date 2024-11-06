<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import DownPaymentSliders from "./DownPaymentSliders.vue";
import { number } from "@/mixins/onlyNum";
import { ref, watch } from "vue";

const loanPurposeTypeBeforeEdit = ref(null);
const estimatedPurchaseValueBeforeEdit = ref(null);
const currentLoanAmountBeforeEdit = ref(null);
const loanPropertyStore = useLoanPropertyStore();
const loanPurposeType = ref(loanPropertyStore.getLoanPurposeType());
const borrowersStore = useBorrowersStore();
const Property = ref(loanPropertyStore.getProperty());
const generalStore = useGeneralStore();
const downPaymentSliders = ref(null);
const { isOnlyNum } = number();
const purposes = ref([
  { text: "Purchase", value: "Purchase" },
  { text: "Refinance", value: "Refinance" },
  { text: "New Home Construction", value: "Construction" },
]);

const onEditClicked = () => {
  generateOnCancelData();
};

watch(
  () => loanPropertyStore.property,
  (newValue) => {
    Property.value = newValue;
  },
  { deep: true }
);

watch(
  () => generalStore.currentLoan.LoanPurposeType,
  (newValue) => {
    loanPurposeType.value = newValue;
  },
  { deep: true }
);

const generateOnCancelData = () => {
  loanPurposeTypeBeforeEdit.value = loanPurposeType.value;
  estimatedPurchaseValueBeforeEdit.value = loanPropertyStore.getPurchasePrice();
  currentLoanAmountBeforeEdit.value = generalStore.currentLoan.LoanAmount;
  downPaymentSliders.value?.generateOnCancelData()
};

const onCancelClicked = () => {
  loanPropertyStore.setLoanPurposeType(loanPurposeTypeBeforeEdit.value);
  loanPropertyStore.setPurchasePrice(estimatedPurchaseValueBeforeEdit.value);
  loanPropertyStore.setLoanAmount(currentLoanAmountBeforeEdit.value);
  downPaymentSliders.value.onCancelClicked();
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};
</script>
<template>
  <div class="loan-details-section">
    <NewSummaryControl
      header="Loan"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
    >
      <template v-slot:displayContent>
        <v-row class="summary-content-container">
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="summaryValue truncate">
                The property is being {{ loanPurposeType
                }}{{
                  loanPurposeType === "Purchase" || loanPurposeType === "Refinance"
                    ? "d"
                    : ""
                }}
                for ${{
                  loanPurposeType === "Refinance"
                    ? getFormattedValue(generalStore.currentLoan.LoanAmount)
                    : getFormattedValue(loanPropertyStore.getPurchasePrice())
                }}
              <span v-if="loanPurposeType !== 'Refinance'">
                , with a ${{
                  getFormattedValue(loanPropertyStore.getDownPaymentAmount())
                }}
                ({{ generalStore.currentLoan.DownPaymentPercentage }}%) Down Payment, and
                a Loan Amount of ${{
                  generalStore.currentLoan
                    ? getFormattedValue(generalStore.currentLoan.LoanAmount)
                    : ""
                }}
              </span>
            </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail>
          <v-row class="form-container">
            <SelectBox
              hide-details
              placeholder="Loan Purpose"
              :items="purposes"
              item-text="text"
              item-value="value"
              @change="(e) => loanPropertyStore.setLoanPurposeType(e)"
              :value="loanPurposeType"
            />
            <TextBox
              v-if="loanPurposeType === 'Purchase'"
              :value="getFormattedValue(loanPropertyStore.getPurchasePrice())"
              @input="
                (e) =>
                  loanPropertyStore.setPurchasePrice(+e.target.value.replace(/,/g, ''))
              "
              placeholder="Estimated Purchase Price"
              hide-details
              prefix="$"
              class="prefix"
              @keypress="(e) => isOnlyNum(e, true)"
            />
            <TextBox
              placeholder="Loan Amount"
              :value="
                generalStore.currentLoan
                  ? getFormattedValue(generalStore.currentLoan.LoanAmount)
                  : ''
              "
              @input="e => loanPropertyStore.setLoanAmount(+e.target.value.replace(/,/g, ''))"
              @keypress="e => isOnlyNum(e, true)"
              hide-details
              prefix="$"
              class="prefix"
            />
            <v-col sm="12" cols="12" v-show="loanPurposeType === 'Purchase'" class="itemContainer">
              <DownPaymentSliders ref="downPaymentSliders" ></DownPaymentSliders>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<style lang="scss" scoped>
@media (max-width: $tablet-width) {
  :deep(.summaryCard .header) {
    padding: 30px 20px !important;
  }
  .form-container {
    padding: 20px 10px;
  }
}
@media (max-width: $mobile-width) {
  :deep(.summaryCard .header) {
    padding: 30px 10px !important;
  }
  .form-container {
    padding: 20px 0px;
  }
}

.truncate{
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;

}
</style>
