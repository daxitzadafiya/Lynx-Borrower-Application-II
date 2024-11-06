<script setup>
import moment from "moment";
import { computed, ref } from "vue";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";

const loanPropertyStore = useLoanPropertyStore();
const lenderInfoStore = useLenderInfoStore();
const { isOnlyNum } = number();
const lotAcquiredModal = ref(false);
const PropertyAndLoanInformation = ref(
  loanPropertyStore.lenderLoanInformation.PropertyAndLoanInformation
);

const constructionToPermanentClosingTypes = ref([
  {
    label: "One Closing",
    value: "OneClosing",
  },
  {
    label: "Two Closing",
    value: "TwoClosing",
  },
]);

const refinanceCashOutDeterminationTypes = ref([
  {
    label: "Cash Out",
    value: "CashOut",
  },
  {
    label: "Limited Cash Out",
    value: "LimitedCashOut",
  },
  {
    label: "No Cash Out",
    value: "NoCashOut",
  },
]);

const governmentRefinanceTypes = ref([
  {
    text: "Full Documentation",
    value: "FullDocumentation",
  },
  {
    text: "Interest Rate Reduction Refinance Loan",
    value: "InterestRateReductionRefinanceLoan",
  },
  {
    text: "Other",
    value: "Other",
  },
  {
    text: "Prior FHA",
    value: "PriorFHA",
  },
  {
    text: "Streamline With Appraisal",
    value: "StreamlineWithAppraisal",
  },
  {
    text: "Streamline Without Appraisal",
    value: "StreamlineWithoutAppraisal",
  },
]);

const setPropertyAcquiredDate = (date) => {
  const formatted = moment(new Date(date)).format("YYYY-MM-DD");
  lenderInfoStore.updatePropertyAndLoanInfo({
    prop: "PropertyAcquiredDate",
    value: formatted,
  });
  lotAcquiredModal.value = false;
};

const lotAcquiredDateFormatted = computed(() => {
  return loanPropertyStore.lenderLoanInformation.PropertyAndLoanInformation
    .PropertyAcquiredDate
    ? moment(
        new Date(
          loanPropertyStore.lenderLoanInformation.PropertyAndLoanInformation.PropertyAcquiredDate
        )
      ).format("DD/MM/YYYY")
    : "";
});

const getDateObject = (dateStr) => {
  return dateStr ? new Date(dateStr) : null;
};
</script>
<template>
  <v-row class="property-and-loaninfo flex-wrap mt-3">
    <v-col cols="12" class="pa-0 mb-0 mt-3 d-flex justify-start loan-border-bottom">
      <p
        class="ma-0 px-3 subheader-1 font-weight-bold white--text black loan-border-bottom loan-form-chapter"
      >
        L1. Property and Loan Information
      </p>
    </v-col>
    <v-col cols="12" class="pa-0">
      <v-row class="pa-0 ma-0 flex-column flex-sm-row">
        <v-col
          :sm="6"
          class="pa-2 d-flex flex-column loan-border-right loan-border-bottom"
        >
          <span class="mb-1 font-weight-bold">Community Property State</span>
          <span id="l1-1">
            <v-checkbox
              light
              label="At least one borrower lives in a community property state."
              :model-value="
                PropertyAndLoanInformation.CommunityPropertyStateResidentIndicator
              "
              @change="
                lenderInfoStore.updatePropertyAndLoanInfoBoolean(
                  'CommunityPropertyStateResidentIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details
            ></v-checkbox>
          </span>

          <span id="l1-2">
            <v-checkbox
              light
              label="The property is in a community property state."
              :model-value="PropertyAndLoanInformation.CommunityPropertyStateIndicator"
              @change="
                lenderInfoStore.updatePropertyAndLoanInfoBoolean(
                  'CommunityPropertyStateIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details="true"
            ></v-checkbox>
          </span>

          <span class="mb-1 mt-3 font-weight-bold">Transaction Detail</span>
          <span id="l1-3-1">
            <v-checkbox
              light
              label="Conversion of Contract for Deed or Land Contract"
              :model-value="
                PropertyAndLoanInformation.ConversionOfContractForDeedIndicator
              "
              @change="
                lenderInfoStore.updatePropertyAndLoanInfoBoolean(
                  'ConversionOfContractForDeedIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details="true"
            ></v-checkbox>
          </span>
          <span id="l1-3-2">
            <v-checkbox
              light
              label="Renovation"
              :model-value="PropertyAndLoanInformation.RenovationLoanIndicator"
              @change="
                lenderInfoStore.updatePropertyAndLoanInfoBoolean(
                  'RenovationLoanIndicator'
                )
              "
              class="ma-0 pa-0"
              dense
              hide-details="true"
            ></v-checkbox>
          </span>

          <v-checkbox
            light
            label="Construction-Conversion/Construction-to-Permanent"
            :model-value="PropertyAndLoanInformation.ConstructionLoanIndicator"
            @change="
              lenderInfoStore.updatePropertyAndLoanInfoBoolean(
                'ConstructionLoanIndicator'
              )
            "
            class="ma-0 pa-0"
            dense
            hide-details="true"
            id="l1-3-3"
          ></v-checkbox>
          <div class="d-flex">
            <!-- <span
              v-for="(status, index) in constructionToPermanentClosingTypes"
              :key="status.value"
              :id="'l1-3-3-1___' + index"
            > -->
            <!-- <VuetifyRadio
                class="mr-3 mt-1 ml-6"
                iconGeneralClass="v-icon v-icon--dense"
                labelClass="theme--light v-label"
                :key="index"
                :label="status.text"
                :isOn="
                  status.value ===
                  PropertyAndLoanInformation.ConstructionToPermanentClosingType
                "
                @toggleRadio="
                  updatePropertyAndLoanRadioOption({
                    prop: 'ConstructionToPermanentClosingType',
                    value: status.value,
                  })
                "
              /> -->
            <!-- </span> -->
            <Radio
              class="closing-radio"
              :options="constructionToPermanentClosingTypes"
              :value="PropertyAndLoanInformation.ConstructionToPermanentClosingType"
              @change="
                (val) => {
                  lenderInfoStore.updatePropertyAndLoanRadioOption({
                    prop: 'ConstructionToPermanentClosingType',
                    value: val,
                  });
                }
              "
            ></Radio>
          </div>

          <div class="d-flex flex-column flex-sm-row align-sm-center mr-5 nt-sm-1">
            <p class="ma-0 mt-1" id="l1-4">Construction/Improvement Costs</p>
            <v-text-field
              light
              variant="underlined"
              dense
              class="ml-sm-4"
              :model-value="
                getFormattedValue(
                  PropertyAndLoanInformation.ConstructionImprovementCostsAmount
                ) || ''
              "
              @input="
                (e) =>
                  lenderInfoStore.updatePropertyAndLoanInfo({
                    prop: 'ConstructionImprovementCostsAmount',
                    value: +e.target.value.replace(/,/g, ''),
                  })
              "
              @keypress="(e) => isOnlyNum(e, true)"
              placeholder="Construction/Improvement Costs"
              prefix="$"
              hide-details
            ></v-text-field>
          </div>
          <div class="d-flex align-sm-center flex-column flex-sm-row pt-3 pt-sm-0">
            <p class="ma-0 mr-sm-3 acquired-label" id="l1-5">Lot Acquired Date</p>
            <div class="d-flex w-sm-66 w-100">
              <v-menu
                v-model="lotAcquiredModal"
                :close-on-content-click="false"
                :location="'bottom'"
                :offset="[0, 10]"
                transition="scale-transition"
                min-width="290"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="lotAcquiredDateFormatted"
                    placeholder="Lot Acquired Date"
                    prepend-icon="mdi-calendar-range"
                    readonly
                    style="max-width: 300px !important"
                    hide-details
                    class="ma-0 pa-0 textfield-1"
                    variant="underlined"
                  ></v-text-field>
                </template>
                <v-date-picker
                  color="primary"
                  :model-value="
                    getDateObject(PropertyAndLoanInformation.PropertyAcquiredDate)
                  "
                  @update:model-value="setPropertyAcquiredDate"
                  show-current="true"
                ></v-date-picker>
              </v-menu>
              <p class="ma-0 font-italic acquired-label">(mm/dd/yyyy)</p>
            </div>
          </div>
          <div class="d-flex mb-2 mr-5 cost-label">
            <p class="align-self-center ma-0 mt-1" id="l1-6">Original Cost of Lot</p>
            <v-text-field
              light
              variant="underlined"
              class="ml-4"
              :model-value="
                getFormattedValue(PropertyAndLoanInformation.LandOriginalCostAmount) || ''
              "
              @input="
                (e) =>
                  lenderInfoStore.updatePropertyAndLoanInfo({
                    prop: 'LandOriginalCostAmount',
                    value: +e.target.value.replace(/,/g, ''),
                  })
              "
              @keypress="(e) => isOnlyNum(e, true)"
              placeholder="Original Cost of Lot"
              prefix="$"
              hide-details
            ></v-text-field>
          </div>
        </v-col>
        <v-col :sm="6" class="pa-0 d-flex flex-column loan-border-bottom">
          <v-row class="ma-0 flex-wrap flex-column flex-sm-row">
            <v-col :sm="5" class="pa-2">
              <span class="font-weight-bold">Refinance Type</span>
              <div class="refinance-type">
                <Radio
                  class="refinance-type-radio"
                  :options="refinanceCashOutDeterminationTypes"
                  :value="PropertyAndLoanInformation.RefinanceCashOutDeterminationType"
                  @change="
                    (val) => {
                      lenderInfoStore.updatePropertyAndLoanRadioOption({
                        prop: 'RefinanceCashOutDeterminationType',
                        value: val,
                      });
                    }
                  "
                ></Radio>
              </div>
            </v-col>
            <v-col :sm="7" class="pa-2 refinance-programme">
              <span class="font-weight-bold">Refinance Program</span>

              <v-radio-group
                light
                dense
                :model-value="PropertyAndLoanInformation.GovernmentRefinanceType"
                class="pa-0 ma-0 mx-1 refinance-type-radio"
                hide-details
                @change="
                  (e) =>
                    lenderInfoStore.updatePropertyAndLoanRadioOption({
                      prop: 'GovernmentRefinanceType',
                      value: e.target.value,
                    })
                "
              >
                <div
                  class="d-flex other-option align-center ga-2 ga-sm-0"
                  v-for="(status, index) in governmentRefinanceTypes"
                  :key="status.value"
                >
                  <span :id="'l1-8___' + index">
                    <v-radio :label="status.text" :value="status.value" />
                  </span>

                  <v-text-field
                    light
                    variant="underlined"
                    class="my-0 ml-4"
                    :model-value="
                      PropertyAndLoanInformation.GovernmentRefinanceTypeOtherDescription
                    "
                    @input="
                      (e) =>
                        lenderInfoStore.updatePropertyAndLoanInfo({
                          prop: 'GovernmentRefinanceTypeOtherDescription',
                          value: e.target.value,
                        })
                    "
                    placeholder="Other"
                    hide-details
                    v-if="status.value == 'Other'"
                  ></v-text-field>
                </div>
              </v-radio-group>
            </v-col>
            <v-col :sm="12" class="pa-2 mt-sm-8 energy-checkbox">
              <span class="font-weight-bold">Energy Improvement</span>
              <span id="l1-9">
                <v-checkbox
                  light
                  label="Mortgage loan will finance energy-related improvements."
                  :model-value="
                    PropertyAndLoanInformation.EnergyRelatedImprovementsIndicator
                  "
                  @change="
                    lenderInfoStore.updatePropertyAndLoanInfoBoolean(
                      'EnergyRelatedImprovementsIndicator'
                    )
                  "
                  class="ma-0 pa-0"
                  dense
                  hide-details="true"
                ></v-checkbox>
              </span>

              <div class="d-flex align-start" id="l1-10">
                <v-checkbox
                  light
                  :model-value="
                    PropertyAndLoanInformation.PropertyExistingCleanEnergyLienIndicator
                  "
                  @change="
                    lenderInfoStore.updatePropertyAndLoanInfoBoolean(
                      'PropertyExistingCleanEnergyLienIndicator'
                    )
                  "
                  class="ma-0 pa-0"
                  dense
                  hide-details="true"
                ></v-checkbox>

                <span class="mt-1 text-black--text">
                  Property is currently subject to a lien that could take priority over
                  the first mortgage lien, such as a clean energy lien paid through
                  property taxes
                  <span class="font-italic"
                    >(e.g., the Property Assessed Clean Energy program).</span
                  >
                </span>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="pl-2 loan-border-bottom d-flex flex-column flex-sm-row">
      <div>
        <span class="font-weight-bold align-self-center">Project Type</span>
      </div>
      <div class="d-flex project-type flex-wrap flex-lg-nowrap">
        <span id="l1-11___0">
          <v-checkbox
            light
            label="Condominium"
            :model-value="
              PropertyAndLoanInformation.ProjectLegalStructureType === 'Condominium'
            "
            @change="
              (e) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'ProjectLegalStructureType',
                  value: e ? 'Condominium' : null,
                })
            "
            class="ma-0 pa-0 ml-sm-8"
            dense
            hide-details
          ></v-checkbox>
        </span>
        <span id="l1-11___1">
          <v-checkbox
            light
            label="Cooperative"
            :model-value="
              PropertyAndLoanInformation.ProjectLegalStructureType === 'Cooperative'
            "
            @change="
              (e) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'ProjectLegalStructureType',
                  value: e ? 'Cooperative' : null,
                })
            "
            class="ma-0 pa-0 ml-sm-8"
            dense
            hide-details
          ></v-checkbox>
        </span>
        <span id="l1-12">
          <v-checkbox
            light
            label="Planned Unit Development (PUD)"
            :model-value="PropertyAndLoanInformation.PUDIndicator"
            @change="lenderInfoStore.updatePropertyAndLoanInfoBoolean('PUDIndicator')"
            class="ma-0 pa-0 ml-sm-8"
            dense
            hide-details
          ></v-checkbox>
        </span>
        <span id="l1-13">
          <v-checkbox
            light
            label="Property is not located in a project"
            :model-value="PropertyAndLoanInformation.PropertyInProjectIndicator"
            @change="
              lenderInfoStore.updatePropertyAndLoanInfoBoolean(
                'PropertyInProjectIndicator'
              )
            "
            class="ma-0 pa-0 ml-sm-8"
            dense
            hide-details
          ></v-checkbox>
        </span>
      </div>
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped>
:deep(.v-input .v-text-field__prefix) {
  opacity: 1 !important;
  visibility: visible !important;
}

// .-mt-3 {
//   margin-top: -3px;
// }

:deep(.closing-radio) {
  .v-input__control {
    margin-left: 20px;
    margin-top: 3px;
    @media (max-width: $lg-mobile-width) {
      margin-left: 0;
    }
  }

  .v-selection-control-group {
    flex-direction: row !important;
    width: fit-content;
    gap: 32px;
    @media (max-width: $lg-mobile-width) {
      gap: 10px;
    }

    .v-selection-control--density-default {
      --v-selection-control-size: 24px !important;
    }

    .v-selection-control .v-label {
      white-space: nowrap !important;
      margin-left: 10px;
      letter-spacing: normal;
    }
  }
}

:deep(.v-text-field__prefix) {
  min-height: 30px;
  padding-bottom: 0px;
  padding-top: 5px !important;
}

:deep(.v-field--active.v-field--focused .v-text-field__prefix) {
  color: $black !important;
}

:deep(.v-text-field--prefixed.v-text-field .v-field__input) {
  padding: 3px 4px 0px !important;
  min-height: 30px;
  padding-bottom: 0px;
  letter-spacing: normal;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

:deep(.v-field__field) {
  align-items: center !important;
  height: 30px;
}

.v-input__prepend {
  padding: 0px !important;
}

:deep(.refinance-type) {
  padding-left: 3px;
  margin-top: -1px;
  @media (max-width: $lg-mobile-width) {
    padding-left: 0;
  }
  .refinance-type-radio {
    .v-selection-control {
      gap: 7px;
    }

    .v-selection-control--density-default {
      --v-selection-control-size: 24px !important;
    }
  }
}

:deep(.refinance-programme) {
  .v-selection-control--density-default {
    --v-selection-control-size: 24px !important;
  }

  .v-input {
    padding-left: 3px !important;
    margin-top: -2px !important;
    @media (max-width: $lg-mobile-width) {
      padding-left: 0 !important;
      margin: 0 !important;
    }
  }

  .v-selection-control {
    gap: 7px;

    // label {
    //   white-space: nowrap !important;
    //   letter-spacing: normal !important;
    // }
  }
}

.text-black--text {
  color: $content-black !important;
  margin-left: 18px;
  @media (max-width: $lg-mobile-width) {
    margin-left: 27px;
  }
}

@media (max-width: $tablet-width) {
  :deep(.v-checkbox .v-selection-control) {
    min-height: 40px !important;
    height: 40px !important;
  }
}

@media (max-width: $desktop-width) {
  :deep(.v-checkbox .v-selection-control) {
    min-height: 100% !important;
    height: 100% !important;
  }
}

:deep(.v-input__prepend) {
  padding-top: 5px !important;
  margin-right: 9px !important;
}

:deep(.textfield-1) {
  .v-field__input {
    padding-bottom: 23px;
    letter-spacing: normal;
  }

  .v-field__outline {
    margin-top: -3px;
  }
}

.acquired-label {
  margin-top: 2px !important;
}

:deep(.cost-label) {
  padding-top: 2px;

  p {
    margin-top: 2px !important;
  }

  .v-field__field {
    margin-top: 1px;
  }

  .v-text-field__prefix {
    padding-top: 4px !important;
  }
}
:deep(.other-option) {
  &:nth-child(4) {
    margin-top: -3px !important;
  }
  .v-field__input {
    padding-bottom: 17px !important;
  }
  .v-input__control {
    margin-top: 1px;
  }
}
.energy-checkbox {
  padding-top: 10px !important;
}

:deep(.refinance-type-radio) {
  .v-selection-control-group {
    .v-label {
      letter-spacing: normal !important;
    }
  }
}
:deep(.project-type) {
  .v-selection-control {
    height: auto !important;
  }
}
</style>
