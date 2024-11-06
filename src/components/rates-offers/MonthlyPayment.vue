<script setup>
import { computed } from "vue";
import { useRatesAndOffersStore } from "@/stores/ratesAndOffers.js";
import { useGeneralStore } from "@/stores/generalStore";

const ratesAndAccountStore = useRatesAndOffersStore();
const generalStore = useGeneralStore();

const title = computed(() => {
  return "Do you want your taxes and insurance included in your monthly payment?";
});

const isMonthlyPayment = computed(() => {
  return ratesAndAccountStore.getMonthlyPayments();
});

const isNextDisabled = computed(() => {
  return isMonthlyPayment.value == null;
});

const onNextClicked = () => {
  const { LenderLoanInformation, Property } = generalStore.currentLoan;
  const { HousingExpenses } = LenderLoanInformation.MortgageLoanInformation || {};

  let requestJson = {};

  if (ratesAndAccountStore.RatesOffers.RepaymentTerms?.length) {
    ratesAndAccountStore.RatesOffers.RepaymentTerms.forEach((product, index) => {
      requestJson[`loanProduct${index + 1}`] = product;
    });
  }

  if (ratesAndAccountStore.RatesOffers.MonthlyPayment) {
    requestJson = {
      ...requestJson,
      ...(Property && Property.PropertyDetail && Property.PropertyDetail.Taxes
        ? {
            taxes: Property.PropertyDetail.Taxes,
          }
        : {}),
      insurance: HousingExpenses?.filter(
        (expense) =>
          expense.HousingExpenseTimingType === "Proposed" &&
          expense.HousingExpenseType === "HomeownersInsurance"
      ).reduce((sum, expense) => sum + expense.HousingExpensePaymentAmount, 0),
    };
  }

  ratesAndAccountStore.getLoanProductsData(requestJson);
};
</script>

<template>
  <div>
    <div class="content-container image-content-type mt-0">
      <div class="content-header-container w-100">
        <div class="header-text">{{ title }}</div>
      </div>
      <div class="d-flex flex-column w-100">
        <div class="tax-insurance-title">
          <p class="mb-0">
            <span>Note:</span> Taxes and insurance will always be included in payment
            amounts for government loans
          </p>
        </div>

        <v-row class="form-container w-100">
          <AgreeToggle
            :isRatesOffers="true"
            @input="ratesAndAccountStore.setMonthlyPayment"
            :value="isMonthlyPayment"
          ></AgreeToggle>
        </v-row>
      </div>

    </div>
    <div class="navigation-container">
      <NavigationButtons
        ButtonType="secondary"
        NextBtnWidth="100px"
        :HasDefaultNavigation="false"
        :RequestedNextPath="'ratesandoffers/product-list'"
        :ConditionsMet="isNextDisabled"
        :NextClicked="onNextClicked"
      >
      </NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-content-type {
  min-height: calc(100vh - 360px);
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 5px !important;
}
.content-container{
  .form-container{
    padding: 8px 16px;
    margin: 0 !important;
    .v-btn-group{
      padding: 0;
      gap: 24px 16px;
      height: fit-content !important;
      :deep(.v-btn){
        height: 70px !important;

      }
    }
  }
}
.navigation-container {
  border: 0 !important;
  .navButtonsContianer {
    padding-left: 2px !important;
    padding-right: 0px !important;
  }
}

:deep(.mdi-checkbox-marked-circle) {
  display: none !important;
}
.w-100 {
  width: 100% !important;
}
.content-header-container {
  background: $table-header-bg;
  padding: 16px 15px !important;
}
:deep(.v-btn-toggle .v-theme--light.v-btn.primary-button.bordered span){
  color: black !important;
}

:deep(.v-btn-toggle .v-theme--light.v-btn.primary-button:not(.bordered) ) {
  border: 2px solid $primaryV2 !important;
}

:deep(.v-btn-toggle .v-theme--light.v-btn.primary-button:not(.bordered)  span) {
  color: $primaryV2 !important;
}
.tax-insurance-title {
  padding: 16px !important;
  p {
    font-size: 14px;
    color: $dark-grayV2 !important;
  }
  span {
    font-weight: 500;
  }
}
:deep(.v-btn-toggle) {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px 16px;
  padding: 8px 16px;
  min-width: 100%;
}
:deep(.v-item-group .theme--light.v-btn.primary-button) {
  height: 70px !important;
}
.header-text {
  color: $dark-grayV2;
  font-weight: 500 !important;
  font-size: 16px;
}
.row {
  margin: 0 !important;
  padding: 0px !important;
  flex: 0 0 auto;
}

@media (max-width: $lg-tablet-width) {
  .v-btn-toggle {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: $tablet-width) {
  .v-btn-toggle {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: $sm-width) {
  .v-btn-toggle {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>