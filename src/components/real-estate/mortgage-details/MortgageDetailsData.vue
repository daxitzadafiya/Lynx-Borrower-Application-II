<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { computed, onMounted, ref } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useCreditStore } from "@/stores/creditStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useRoute } from "vue-router";
import { number } from "@/mixins/onlyNum";

const realEstateStore = useRealEstateStore();
const creditStore = useCreditStore();
const borrowersStore = useBorrowersStore();
const route = useRoute();
const { isOnlyNum } = number();
const loanTypes = ref(["Conventional", "FHA", "VA", "USDA-RD", "Other"]);
const ownershipTypes = ref(["Joint", "Individual"]);
const populatingReportFields = ref([
  { model: "OwnershipType", api: "OwnershipType" },
  { model: "FullName", api: "CompanyName" },
  { model: "LiabilityAccountIdentifier", api: "AccountNumber" },
  { model: "LiabilityMonthlyPaymentAmount", api: "MonthlyPayment" },
  { model: "LiabilityUnpaidBalanceAmount", api: "UnpaidBalance" },
  { model: "LiabilityCreditLimit", api: "CreditLimitAmount" },
]);
const additional = ref(false);

const remove = (index) => {
  const filtered = loans.value.filter((item, i) => i !== index);
  const updatedRealEstate = {
    ...currentRealEstate.value,
    MortgageLoans: filtered,
  };
  let realEstates = [...realEstateStore.getRealEstate()];
  realEstates[realEstateStore.getRealEstateEditingIndex()] = updatedRealEstate;
  realEstateStore.setRealEstate(realEstates);
};

const addAdditional = () => {
  additional.value = true;
};

const addMortgageDetail = (e) => {
  const updatedRealEstate = {
    ...currentRealEstate.value,
    MortgageLoans: [...loans.value, { MortgageLoanType: e }],
  };
  let realEstates = [...realEstateStore.getRealEstate()];
  realEstates[realEstateStore.getRealEstateEditingIndex()] = updatedRealEstate;
  realEstateStore.setRealEstate(realEstates);
  additional.value = null;
};

const setMortgageLoanProperty = (value, index, prop) => {
  realEstateStore.setMortgageLoan({
    prop,
    loanIndex: index,
    value,
  });
  if (
    realEstateStore.getEditingMortgageLoan()
      .LiabilityPaymentIncludesTaxesInsuranceIndicator == undefined
  ) {
    realEstateStore.setMortgageLoan({
      prop: "LiabilityPaymentIncludesTaxesInsuranceIndicator",
      loanIndex: index,
      value: false,
    });
  }
  if (!realEstateStore.getEditingMortgageLoan().LiabilityType) {
    realEstateStore.setMortgageLoan({
      prop: "LiabilityType",
      loanIndex: index,
      value: "MortgageLoan",
    });
  }
  if (prop === "LiabilityUnpaidBalanceAmount") {
    const realEstates = realEstateStore.getRealEstate().map((item, index) => {
      if (index === realEstateStore.getRealEstateEditingIndex()) {
        item.PropertyLienUnPaidBalanceAmount = item.MortgageLoans.reduce(
          (a, c) =>
            (a += !isNaN(c.LiabilityUnpaidBalanceAmount)
              ? +c.LiabilityUnpaidBalanceAmount
              : 0),
          0
        );
      }
      return item;
    });
    realEstateStore.setRealEstate(realEstates);
  }
};

const populateLoanData = (value, index) => {
  const [CompanyName, AccountNumber] = value.split(" - ");
  const data = mortgageDetails.value.find(
    (item) => item.CompanyName === CompanyName && item.AccountNumber === AccountNumber
  );
  for (let { model, api } of populatingReportFields.value) {
    const value = data[api];
    setMortgageLoanProperty(value, index, model);
  }
};

const total = computed(() => {
  return loans.value.length
    ? loans.value.reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.LiabilityMonthlyPaymentAmount)
            ? +cur.LiabilityMonthlyPaymentAmount
            : 0),
        0
      )
    : 0;
});

const mortgageDetails = computed(() => {
  let result = [];
  if (creditStore.getCreditReportDetails()) {
    const details = creditStore
      .getCreditReportDetails()
      .ApplicantDetails.find((item) => item.BorrowerId === borrowersStore.Borrower.Id);
    result = details.Liabilities.filter(
      (item) => item.AccountType === "Mortgage" && item.AccountStatus === "Open"
    );
  }
  return result;
});

const mortgageLoansOptions = computed(() => {
  let result = [];
  if (mortgageDetails.value.length) {
    result = mortgageDetails.value.map(
      (item) => `${item.CompanyName} - ${item.AccountNumber}`
    );
  }
  return result;
});

const currentRealEstate = computed(() => {
  return (
    realEstateStore.getRealEstate()[realEstateStore.getRealEstateEditingIndex()] || {}
  );
});

const loans = computed(() => {
  return currentRealEstate.value.MortgageLoans || [];
});

onMounted(() => {
  creditStore.getCreditOrders();
  if (route.query.newMortgage === "1" && loans.value.length === 0) {
    additional.value = true;
  }
  if (borrowersStore.realEstateOwnedMortgage) {
    addAdditional();
  }
});
</script>
<template>
  <v-form class="fast-fail form-outer-container">
    <div v-if="loans.length">
      <v-row
        class="form-container deleteAbleItem"
        v-for="(mortgageLoan, loanIndex) in loans"
        :key="loanIndex"
      >
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn dense="dense" icon="icon" @click="remove(loanIndex)" elevation="0">
            <v-icon small="small">mdi-close</v-icon>
          </v-btn>
        </v-col>
        <SelectBox
          placeholder="Mortgage Loans"
          :items="mortgageLoansOptions"
          @change="(e) => populateLoanData(e, loanIndex)"
        />
        <ComboBox
          :value="mortgageLoan.MortgageLoanType"
          :items="loanTypes"
          @change="(e) => setMortgageLoanProperty(e, loanIndex, 'MortgageLoanType')"
          placeholder="Loan Type"
        />
        <ComboBox
          :value="mortgageLoan.OwnershipType"
          :items="ownershipTypes"
          @change="(e) => setMortgageLoanProperty(e, loanIndex, 'OwnershipType')"
          placeholder="Ownership Type"
        />
        <TextBox
          placeholder="Creditor Name"
          :value="mortgageLoan.FullName"
          @input="(e) => setMortgageLoanProperty(e.target.value,loanIndex, 'FullName')"
        />
        <TextBox
          placeholder="Account Number"
          :value="mortgageLoan.LiabilityAccountIdentifier"
          @input="
            (e) =>
              setMortgageLoanProperty(
                e.target.value,
                loanIndex,
                'LiabilityAccountIdentifier'
              )
          "
        />
        <TextBox
          placeholder="Monthly Payment"
          :value="getFormattedValue(mortgageLoan.LiabilityMonthlyPaymentAmount)"
          prefix="$"
          @input="
            (e) =>
              setMortgageLoanProperty(
                +e.target.value.replace(/,/g, ''),
                loanIndex,
                'LiabilityMonthlyPaymentAmount'
              )
          "
          @keypress="(e) => isOnlyNum(e, true)"
        />
        <TextBox
          placeholder="Unpaid Balance"
          :value="getFormattedValue(mortgageLoan.LiabilityUnpaidBalanceAmount)"
          prefix="$"
          @input="
            (e) =>
              setMortgageLoanProperty(
                +e.target.value.replace(/,/g, ''),
                loanIndex,
                'LiabilityUnpaidBalanceAmount'
              )
          "
          @keypress="(e) => isOnlyNum(e, true)"
        />
        <TextBox
          :prefix="mortgageLoan.LiabilityCreditLimit !== 'N/A' ? '$' : ''"
          placeholder="Credit Limit"
          :value="getFormattedValue(mortgageLoan.LiabilityCreditLimit)"
          @input="
            (e) =>
              setMortgageLoanProperty(
                +e.target.value.replace(/,/g, ''),
                loanIndex,
                'LiabilityCreditLimit'
              )
          "
          @keypress="(e) => isOnlyNum(e, true)"
        />
        <v-col class="itemContainer" sm="6" cols="12">
          <!-- :adsfsdf="mortgageLoan.LiabilityPayoffStatusIndicator" -->
          <CheckBox
            class="defaultCheckbox mt-0"
            label="Payoff Prior to Closing"
            @toggle="
              (value) =>
                setMortgageLoanProperty(
                  value,
                  loanIndex,
                  'LiabilityPayoffStatusIndicator'
                )
            "
            :isChecked="mortgageLoan.LiabilityPayoffStatusIndicator"
            :hideDetails="true"
          >
          </CheckBox>
        </v-col>
        <v-col class="itemContainer" sm="6" cols="12">
          <CheckBox
            class="mt-0 defaultCheckbox"
            label="Payment Includes Taxes and Insurance"
            :isChecked="
              mortgageLoan.LiabilityPaymentIncludesTaxesInsuranceIndicator ? true : null
            "
            :hideDetails="true"
            @toggle="
              (value) =>
                setMortgageLoanProperty(
                  value,
                  loanIndex,
                  'LiabilityPaymentIncludesTaxesInsuranceIndicator'
                )
            "
          >
          </CheckBox>
        </v-col>
      </v-row>
    </div>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional = null" elevation="0">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <ComboBox
        :items="loanTypes"
        @change="(e) => addMortgageDetail(e)"
        placeholder="Loan Type"
      />
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addAdditional"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add Additional Mortgage</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12"
        >Total: ${{ getFormattedValue(total) || 0 }}</v-col
      >
    </v-row>
  </v-form>
</template>
<style lang="scss" scoped>
:deep(.form-container) {
  margin: -10px -10px;
  .defaultCheckbox {
    margin-left: -3px;
    padding-top: 0px !important;
    i{
      font-size: 24px !important;
    }
  }
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

.form-container.addItemBtnContainer .addItemBtn {
  max-width: unset !important;
}
:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}
:deep(.form-outer-container > :first-child.addItemBtnContainer) {
    margin-top: 0px !important;
}
</style>
