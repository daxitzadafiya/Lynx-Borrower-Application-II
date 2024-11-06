<script setup>
import { computed, onMounted, ref } from "vue";
import { useGeneralStore } from "@/stores/generalStore";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useCreditStore } from "@/stores/creditStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";

const generalStore = useGeneralStore();
const realEstateStore = useRealEstateStore();
const creditStore = useCreditStore();
const borrowersStore = useBorrowersStore();
const { isOnlyNum } = number();
const onHandleClose = () => {
  realEstateStore.onToggle(false);
  generalStore.toggleIsOnlay({
    isOnlay: false,
    onlayComponent: "",
  });
};
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
const setMortgageLoanProperty = (value, prop) => {
  realEstateStore.setMortgageLoan({
    prop,
    loanIndex: realEstateStore.getEditingMortgageLoanIndex(),
    value,
  });
  if (
    realEstateStore.getEditingMortgageLoan()
      .LiabilityPaymentIncludesTaxesInsuranceIndicator == undefined
  ) {
    realEstateStore.setMortgageLoan({
      prop: "LiabilityPaymentIncludesTaxesInsuranceIndicator",
      loanIndex: realEstateStore.getEditingMortgageLoanIndex(),
      value: false,
    });
  }
  if (!realEstateStore.getEditingMortgageLoan().LiabilityType) {
    realEstateStore.setMortgageLoan({
      prop: "LiabilityType",
      loanIndex: realEstateStore.getEditingMortgageLoanIndex(),
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

const populateLoanData = (value) => {
  const [CompanyName, AccountNumber] = value.split(" - ");
  const data = mortgageDetails.value.find(
    (item) => item.CompanyName === CompanyName && item.AccountNumber === AccountNumber
  );
  for (let { model, api } of populatingReportFields.value) {
    const value = data[api];
    setMortgageLoanProperty(value, model);
  }
};

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

const isShowModal = computed(() => {
  return realEstateStore.isVisible;
});

const isModelVisible = computed({
  get: () => isShowModal.value && generalStore.onlayComponent == "mortgage-loan",
  set: (val) => {
    realEstateStore.isModalVisible = val;
  },
});
onMounted(() => {
  creditStore.getCreditOrders(true);
});
</script>
<template>
  <v-dialog v-model="isModelVisible" activator="parent" max-width="720" persistent>
    <template v-slot:default="{}">
      <v-card light>
        <v-card-title class="dialog-header-back dialog-header-text">
          <span>Mortgage Loans</span>
          <v-btn class="close-btn" icon @click="onHandleClose()" elevation="0">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <div class="subtitle">
          <div class="subtitle_bold">
            {{ realEstateStore.getEditingPropertyDetails().title ?? "" }}
          </div>
          <div class="subtitle_normal">
            {{
              realEstateStore.getEditingPropertyDetails().location.includes("undefined")
                ? ""
                : realEstateStore.getEditingPropertyDetails().location
            }}
          </div>
        </div>

        <v-card-text class="card-content text-black--text">
          <v-row>
            <SelectBox
              placeholder="Mortgage Loans"
              :items="mortgageLoansOptions"
              @change="populateLoanData"
            />
          </v-row>
          <v-row>
            <ComboBox
              :smVal="4"
              :value="realEstateStore.getEditingMortgageLoan().MortgageLoanType"
              :items="loanTypes"
              @change="(e) => setMortgageLoanProperty(e, 'MortgageLoanType')"
              placeholder="Loan Type"
            />

            <ComboBox
              :smVal="4"
              :value="realEstateStore.getEditingMortgageLoan().OwnershipType"
              :items="ownershipTypes"
              @change="(e) => setMortgageLoanProperty(e, 'OwnershipType')"
              placeholder="Ownership Type"
            />
            <TextBox
              :smVal="4"
              placeholder="Creditor Name"
              :value="realEstateStore.getEditingMortgageLoan().FullName"
              @input="(e) => setMortgageLoanProperty(e.target.value, 'FullName')"
            />
          </v-row>
          <v-row>
            <TextBox
              placeholder="Account Number"
              :value="realEstateStore.getEditingMortgageLoan().LiabilityAccountIdentifier"
              @input="
                (e) =>
                  setMortgageLoanProperty(e.target.value, 'LiabilityAccountIdentifier')
              "
            />
            <TextBox
              placeholder="Monthly Payment"
              :value="
                getFormattedValue(
                  realEstateStore.getEditingMortgageLoan().LiabilityMonthlyPaymentAmount
                )
              "
              prefix="$"
              @input="
                (e) =>
                  setMortgageLoanProperty(
                    +e.target.value.replace(/,/g, ''),
                    'LiabilityMonthlyPaymentAmount'
                  )
              "
              @keypress="(e) => isOnlyNum(e, true)"
            />
            <TextBox
              placeholder="Unpaid Balance"
              :value="
                getFormattedValue(
                  realEstateStore.getEditingMortgageLoan().LiabilityUnpaidBalanceAmount
                )
              "
              prefix="$"
              @input="
                (e) =>
                  setMortgageLoanProperty(
                    +e.target.value.replace(/,/g, ''),
                    'LiabilityUnpaidBalanceAmount'
                  )
              "
              @keypress="(e) => isOnlyNum(e, true)"
            />
            <TextBox
              :prefix="
                realEstateStore.getEditingMortgageLoan().LiabilityCreditLimit !== 'N/A'
                  ? '$'
                  : ''
              "
              placeholder="Credit Limit"
              :value="
                getFormattedValue(
                  realEstateStore.getEditingMortgageLoan().LiabilityCreditLimit
                )
              "
              @input="
                (e) =>
                  setMortgageLoanProperty(
                    +e.target.value.replace(/,/g, ''),
                    'LiabilityCreditLimit'
                  )
              "
              @keypress="(e) => isOnlyNum(e, true)"
            />
          </v-row>
          <v-row class="mt-3 flex-col">
            <v-col sm="8" class="py-0">
              <CheckBox
                class="defaultCheckbox"
                :isChecked="
                  realEstateStore.getEditingMortgageLoan().LiabilityPayoffStatusIndicator
                "
                @toggle="
                  (value) =>
                    setMortgageLoanProperty(value, 'LiabilityPayoffStatusIndicator')
                "
                label="Payoff Prior to Closing"
                :hideDetails="true"
              />
            </v-col>
            <v-col sm="8" class="py-0">
              <CheckBox
                class="defaultCheckbox"
                :isChecked="
                  realEstateStore.getEditingMortgageLoan()
                    .LiabilityPaymentIncludesTaxesInsuranceIndicator
                "
                @toggle="
                  (value) =>
                    setMortgageLoanProperty(
                      value,
                      'LiabilityPaymentIncludesTaxesInsuranceIndicator'
                    )
                "
                label="Payment Includes Taxes and Insurance"
                :hideDetails="true"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <div class="popup__button">
          <div class="popup_desktop-button">
            <CustomButton
              value="OK"
              class="btn-width"
              customClass="primary-button"
              @onHandleClick="onHandleClose()"
            ></CustomButton>
          </div>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>
<style lang="scss" scoped>
:deep(.infoText) {
  color: $gray3 !important;
  font-size: 14px !important;
  letter-spacing: 0.0178571429em !important;
  line-height: 1.25rem !important;
  font-weight: 500 !important;
}
:deep(.v-card-title) {
  padding: 10px 20px 10px 30px !important;
  justify-content: space-between !important;
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.card-content) {
  padding: 30px !important;
  overflow-y: auto !important;
}
:deep(.v-input__control) {
  height: 40px !important;
}
:deep(.v-field__field) {
  height: 40px;
}
:deep(.v-input__control .v-field__field input) {
  padding: 8px 12px !important;
}
:deep(.titleText) {
  font-size: 14px !important;
}

.defaultCheckbox {
  margin-top: 0px !important;
  padding: 0px !important;
  :deep(.v-selection-control) {
    flex-direction: row-reverse !important;
    justify-content: space-between;
  }
}
:deep(.v-checkbox .v-selection-control) {
  min-height: 48px !important;
}
.card-content::-webkit-scrollbar {
  width: 5px;
}

.card-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.card-content::-webkit-scrollbar-thumb {
  background-color: #88888834;
  border-radius: 10px;
  border: 3px solid #88888834;
}

.card-content::-webkit-scrollbar-corner {
  background-color: #f1f1f1;
}

.close-btn {
  background: transparent !important;
  height: 36px !important;
  width: 36px !important;
}

.subtitle {
  padding: 20px 0 0 45px;
  .subtitle_bold {
    font-weight: 500;
  }
}
.card-content {
  padding: 20px 45px !important;
}

:deep(.v-text-field__prefix) {
  padding-left: 12px;
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
:deep(.v-field__field) {
  align-items: center !important;
  height: 40px;
}
:deep(.v-field__input) {
  padding: 12px !important;
}
.popup__button {
  padding: 24px 0px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-col {
  flex-direction: column;
}

@media (max-width: $mobile-width) {
  :deep(.card-content) {
    padding: 30px 15px !important;
  }
  :deep(.v-card-title) {
    padding: 10px 10px 10px 15px !important;
  }
  :deep(.btn-width button) {
    width: 200px !important;
  }
  :deep(.subtitle) {
    padding: 20px 0 0 15px;
  }
}
</style>
