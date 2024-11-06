<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useRatesAndOffersStore } from "@/stores/ratesAndOffers.js";
import { useGeneralStore } from "@/stores/generalStore";

const generalStore = useGeneralStore();
const ratesAndAccountStore = useRatesAndOffersStore();
const selectedFilter = ref("Rate");
const options = ref([
  {
    label: "Fixed",
    value: "Fixed",
  },
  {
    label: "Adjustable",
    value: "Adjustable",
  },
]);

const filterOn = ref(["Rate"]);

const years = ref([
  {
    title: "30 yr fixed",
    value: "30 year fixed",
  },
  {
    title: "25 yr fixed",
    value: "25 year fixed",
  },
  {
    title: "20 yr fixed",
    value: "20 year fixed",
  },
  {
    title: "15 yr fixed",
    value: "15 year fixed",
  },
  {
    title: "10 yr fixed",
    value: "10 year fixed",
  },
]);

const adjustableRate = ref([
  {
    title: "3/1 ARM",
    value: "3 year ARM/30 yrs",
  },
  {
    title: "5/1 ARM",
    value: "5 year ARM/30 yrs",
  },
  {
    title: "7/1 ARM",
    value: "7 year ARM/30 yrs",
  },
  {
    title: "10/1 ARM",
    value: "10 year ARM/30 yrs",
  },
]);

const selectedYears = ref([]);
const isShowMore = ref(true);
const rateType = ref("Fixed");
const includeTaxAndInsurance = ref("");
const showMoreWithDelay = ref(true);

const refreshIcon = ref("");
let imageList = await Promise.all([import("@/assets/images/rates-offers/refresh.svg")]);
refreshIcon.value = imageList[0].default;

const toggleSelection = (year) => {
  if (!selectedYears.value.includes(year)) {
    selectedYears.value.push(year);
  }
  ratesAndAccountStore.setFilterProducts({
    prop: "RepaymentTerm",
    value: selectedYears.value,
  });
};

const deselectYear = (year) => {
  selectedYears.value = selectedYears.value.filter((y) => y !== year);
  ratesAndAccountStore.setFilterProducts({
    prop: "RepaymentTerm",
    value: selectedYears.value,
  });
};

const onShow = () => {
  isShowMore.value = !isShowMore.value;
};

const updateResult = () => {
  if (ratesAndAccountStore.getFilterProducts()) {
    ratesAndAccountStore.getLoanProductsData(ratesAndAccountStore.getFilterProducts());
  }
};

const onRateTypeChange = (val) => {
  selectedYears.value = [];
  rateType.value = val;
};
onMounted(() => {
  if (ratesAndAccountStore.RatesOffers) {
    rateType.value = ratesAndAccountStore.RatesOffers.RateType || null;
    selectedYears.value = ratesAndAccountStore.RatesOffers.RepaymentTerms || [];
    includeTaxAndInsurance.value = ratesAndAccountStore.RatesOffers.MonthlyPayment;
  }
});

const title = computed(() => {
  return "Filters";
});

watch(
  () => isShowMore.value,
  (newValue) => {
    if (!newValue) {
      setTimeout(() => {
        showMoreWithDelay.value = false;
      }, 100);
    } else {
      showMoreWithDelay.value = true;
    }
  },
  { deep: true }
);
</script>
<template>
  <div class="content-container image-content-type mt-0">
    <div class="content-header-container w-100">
      <div class="header-text">{{ title }}</div>
      <v-btn class="updateResultBtn" elevation="0" @click="updateResult()">
        <span class="v-btn__content">Update Results</span>
        <inline-svg :src="refreshIcon"></inline-svg>
      </v-btn>
    </div>
    <div class="p-4 w-100">
      <v-row class="section_1">
        <v-col sm="4" lg="3" md="4" cols="12" class="loan-amount">
          <TextBox :hide-details="true" prefix="$" :smVal="12" class="p-0" placeholder="Loan Amount"
            :value="getFormattedValue(generalStore.currentLoan.LoanAmount)" :readOnly="true" />
        </v-col>
        <!-- <div class="purchase-estimated  w-100">
          <p class="mb-0">Purchase Estimated Value</p>
          <v-text-field outlined dense :hide-details="true" prefix="$" @keypress="(e) => isOnlyNum(e)"
            placeholder="5000000" :value="getFormattedValue(500000)" />
        </div> -->
        <v-col sm="4" lg="3" md="4" cols="12" class="down-payment">
          <div class="position-relative">
            <TextBox :hide-details="true" prefix="$" :smVal="12" class="p-0"
              :value="getFormattedValue(generalStore.currentLoan.DownPaymentAmount)" :disabled="true"
              placeholder="Down Payment" />
            <TextBox class="position-absolute" :readOnly="true"
              :value="(generalStore.currentLoan.DownPaymentPercentage || 0) + '%'"></TextBox>
          </div>
        </v-col>

        <v-col sm="4" lg="3" md="4" cols="12" class="loan-value">
          <TextBox :hide-details="true" prefix="%" class="p-0" :value="+(generalStore.currentLoan.LoanToValueRatio || 0) * 100"
            :readOnly="true" :smVal="12" placeholder="Loan to Value" />
        </v-col>
        <v-col sm="4" lg="3" md="4" cols="12" class="property-type h-100 w-100 shrink"
          :class="{ 'p-0': !showMoreWithDelay }">
          <v-expand-transition>
            <div v-if="isShowMore">
              <TextBox :hide-details="true" :readOnly="true" :smVal="12" class="p-0"
                :value="generalStore.currentLoan?.Property?.PropertyType" placeholder="Property Type"></TextBox>
            </div>
          </v-expand-transition>
        </v-col>

        <v-col sm="4" lg="3" md="3" cols="12" class="rate-type h-100 w-100 shrink"
          :class="{ 'p-0': !showMoreWithDelay }">
          <v-expand-transition>
            <div v-if="isShowMore">
              <p class="mb-0 fw-4">Rate Type</p>
              <!-- <v-radio-group :value="rateType" @change="(val) => onRateTypeChange(val)">
                <v-radio
                  color="primary"
                  v-for="option in options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></v-radio>
              </v-radio-group> -->
              <Radio :options="options" :value="rateType" @change="(val) => onRateTypeChange(val)"></Radio>
            </div>
          </v-expand-transition>
        </v-col>
        <v-col sm="8" lg="5" md="7" cols="12" class="year-selection-main col-span-2 w-100 h-100 shrink"
          :class="{ 'p-0': !showMoreWithDelay }">
          <v-expand-transition>
            <div v-if="isShowMore">
              <p class="mb-0">
                What repayment term are you looking for?
                <v-icon>mdi-information-outline</v-icon>
              </p>
              <div class="year-selection" v-if="rateType == 'Fixed'">
                <div v-for="year in years" :key="year.title" class="year-button"
                  :class="{ selected: selectedYears.includes(year.value) }" @click="toggleSelection(year.value)">
                  <span>{{ year.title.replace("fixed", "") }}</span>
                  <v-icon class="close-icon" v-if="selectedYears.includes(year.value)"
                    @click.stop="deselectYear(year.value)">mdi-close</v-icon>
                </div>
              </div>
              <div class="year-selection" v-if="rateType == 'Adjustable'">
                <div v-for="year in adjustableRate" :key="year.title" class="year-button"
                  :class="{ selected: selectedYears.includes(year.value) }" @click="toggleSelection(year.value)">
                  <span>{{ year.title }}</span>
                  <v-icon class="close-icon" v-if="selectedYears.includes(year.value)"
                    @click.stop="deselectYear(year.value)">mdi-close</v-icon>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </v-col>
        <v-col sm="4" lg="4" md="4" cols="12" class="monthly-payment w-100 h-100 shrink"
          :class="{ 'p-0': !showMoreWithDelay }">
          <v-expand-transition>
            <div v-if="isShowMore">
              <p class="mb-0">Monthly Payment Details</p>
              <CheckBox class="transparent-checkbox" label="Include tax and insurance" hide-details @toggle="(val) =>
                ratesAndAccountStore.setFilterProducts({ prop: 'insuranceTaxAndInsurance', value: val })
        " :isChecked="includeTaxAndInsurance">
              </CheckBox>
            </div>
          </v-expand-transition>
        </v-col>
      </v-row>
    </div>

    <div class="show_btn">
      <v-btn class="showing_btn" elevation="0" @click="onShow()">Show {{ isShowMore ? "Less" : "More" }}</v-btn>
    </div>
  </div>
</template>
<style lang="scss" scoped>

.image-content-type {
  min-height: fit-content !important;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 5px !important;
}

.p-0 {
  padding: 0 !important;
}

.p-4 {
  padding: 16px;
}

.space-between {
  justify-content: space-between;
}

:deep(.v-text-field > .v-input__control > .v-input__slot:before) {
  border: 0px !important;
}

:deep(.content-header-container .v-btn__content) {
  color: $action-primary-bg-color;
  text-transform: none;
  display: flex;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
}

:deep(.updateResultBtn) {
  box-shadow: 0px 0px 4px 0px #00000024, 0px 0px 1px 0px #00000024 !important;
  background-color: $white !important;
}

:deep(.v-input--selection-controls) {
  margin: 0px;
  padding: 0px;
}

:deep(.v-input--selection-controls__input + .v-label) {
  font-size: 14px;
  font-weight: 400;
}

:deep(.v-input--radio-group__input) {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

:deep(.v-input--radio-group__input .v-radio) {
  margin-bottom: 0 !important;
}

.w-100 {
  width: 100% !important;
}

:deep(.v-input--selection-controls .v-input__slot) {
  min-height: 20px !important;
  margin-top: 10px;
}

:deep(.v-text-field--enclosed .v-input__append-inner) {
  margin-top: 8px !important;

  .v-icon {
    color: $dark-grayV2 !important;
  }
}

.content-header-container {
  background: $table-header-bg;
  padding: 16px 15px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section_1 {
  p {
    font-size: 14px;
    font-weight: 400;
  }
}

.year-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.year-button {
  padding: 2px 8px;
  border: 1px solid $light-grayV2;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    color: $dark-grayV2;
    font-weight: 500;
    font-size: 14px;
  }
}

.year-button.selected {
  background-color: $dark-purpleV3;
  border-color: $dark-purpleV3;
  cursor: default;
}

.show_btn {
  text-align: end;
  width: 100%;
  padding: 16px;
  display: none;
}

:deep(.showing_btn.v-btn) {
  background: transparent !important;
  text-transform: none;
  color: $orangeV2;
}

.close-icon {
  margin-left: 5px;
  cursor: pointer;
  font-size: 12px;
}

.mdi-information-outline {
  font-size: 14px !important;
}

.v-btn:not(.v-btn--round).v-size--default {
  min-width: 100px !important;
}

:deep(.v-input--radio-group .v-messages.theme--light) {
  display: none !important;
}

:deep(.v-radio .primary--text) {
  color: $primaryV2 !important;
}

:deep(.v-list-item) {
  min-height: 40px;
}

:deep(.v-list-item__content) {
  padding: 0 !important;
}

.position-relative {
  position: relative;
}

.position-absolute {
  margin: 0;
  padding: 0 !important;
  bottom: 0px;
  right: 0;
  width: 70px;
  padding: 5px;

  :deep(.v-input__control::after) {
    display: none !important;
  }

  :deep(.v-field__outline) {
    --v-field-border-width: 0px
  }

  :deep(.v-field__input) {
    padding: 0 0 0 3px  !important;
    border-left: 2px solid $gray4;
    line-height: 0px;
  }
}

@media (max-width: $tablet-width) {
  .show_btn {
    display: block;
  }
}



:deep(.titleText) {
  font-size: 14px;
}

:deep(.rate-type) {
  .v-radio-group {
    .v-selection-control-group {
      flex-direction: row;
      margin-left: -8px;
      margin-top: 2px;
      gap: 8px;

      .v-selection-control {
        flex: inherit;

        i{
          font-size: 24px;
        }
      }
    }

    .v-selection-control .v-label {
      font-size: 14px;
      letter-spacing: 0;
      word-break: normal
    }
  }
}

:deep(.monthly-payment) {
  .transparent-checkbox{
    margin: 10px 0 0 0;
  }
  .v-selection-control {
    margin-left: -8px;
    min-height: 0;

    .v-label {
      font-size: 14px;
      letter-spacing: normal;
      line-height: 20px;
      font-weight: 400;
    }
    i{
      font-size: 24px;
    }
  }
}

.year-selection-main,
.monthly-payment {
  padding-bottom: 4px !important;
}
:deep(.v-field--disabled .v-text-field__prefix){
  color: $black !important;

}
</style>
