<script setup>
import moment from "moment";
import { computed, ref } from "vue";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { useGeneralStore } from "@/stores/generalStore";

const { isOnlyNum } = number();
const generalStore = useGeneralStore();

const lenderInfoStore = useLenderInfoStore();
const loanPropertyStore = useLoanPropertyStore();

const isDatePicker = ref(false);
const refinanceImprovementsTypes = ref([
  { text: "Made", value: "Made" },
  { text: "To Be Made", value: "ToBeMade" },
  { text: "Unknown", value: "Unknown" },
]);
const attachmentTypes = ref([
  { text: "Attached", value: "Attached" },
  { text: "Detached", value: "Detached" },
]);
const propertyEstateTypes = ref([
  { text: "Fee Simple", value: "FeeSimple" },
  { text: "Leashold", value: "Leashold" },
]);
const refinancePrimaryPurposeTypes = ref([
  { text: "Debt Consolidation", value: "DebtConsolidation" },
  { text: "Home Improvement", value: "HomeImprovement" },
  { text: "Other", value: "Other" },
]);

const setGroundLeaseExpirationDate = (date) => {
  const formatted = moment(new Date(date)).format("YYYY-MM-DD");
  lenderInfoStore.updatePropertyAndLoanInfo({
    prop: "PropertyGroundLeaseExpirationDate",
    value: formatted,
  });
  isDatePicker.value = false;
};

const setValuationAmount = (val) => {
  const property = loanPropertyStore.getProperty()
    ? { ...loanPropertyStore.getProperty(), PropertyValuationAmount: val }
    : { PropertyValuationAmount: val };
  loanPropertyStore.setProperty(property);
};

const formattedDate = computed(() => {
  return lenderInfoStore.getPropertyAndLoanInformation().PropertyGroundLeaseExpirationDate
    ? moment(
        new Date(
          lenderInfoStore.getPropertyAndLoanInformation().PropertyGroundLeaseExpirationDate
        )
      ).format("DD/MM/YYYY")
    : "";
});

const getDateObject = (dateStr) => {
  return dateStr ? new Date(dateStr) : null;
};
</script>
<template>
  <v-card class="pb-1" light>
    <v-card-title class="p-4">Property & Loan Information</v-card-title>
    <v-card-text>
      <v-row class="ma-0 pa-0 d-flex flex-wrap">
        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="font-weight-medium align-self-center ls-1"
            >Refinance Improvements Type</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0 select-input"
            light
            dense
            :items="refinanceImprovementsTypes"
            item-title="text"
            item-value="value"
            placeholder="Refinance Improvements Type"
            :model-value="
              lenderInfoStore.getPropertyAndLoanInformation().RefinanceImprovementsType
            "
            @update:model-value="
              (value) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'RefinanceImprovementsType',
                  value,
                })
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="font-weight-medium align-self-center ls-1"
            >Refinance Improvement Cost</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="
              getFormattedValue(
                lenderInfoStore.getPropertyAndLoanInformation()
                  .RefinanceImprovementCostsAmount
              ) || ''
            "
            @input="
              (e) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'RefinanceImprovementCostsAmount',
                  value: +e.target.value.replace(/,/g, ''),
                })
            "
            placeholder="Refinance Improvement Cost"
            hide-details
            style="max-width: 300px"
            prefix="$"
            @keypress="(e) => isOnlyNum(e, true)"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="font-weight-medium align-self-center ls-1"
            >Energy Improvement Cost</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="
              getFormattedValue(
                lenderInfoStore.getPropertyAndLoanInformation().DUEnergyImprovementAmount
              ) || ''
            "
            @input="
              (e) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'DUEnergyImprovementAmount',
                  value: +e.target.value.replace(/,/g, ''),
                })
            "
            placeholder="Energy Improvement Cost"
            hide-details
            style="max-width: 300px"
            prefix="$"
            @keypress="(e) => isOnlyNum(e, true)"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="font-weight-medium align-self-center ls-1"
            >Project Design Type</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            light
            dense
            :items="[{ text: 'Highrise Project', value: 'HighriseProject' }]"
            item-title="text"
            item-value="value"
            placeholder="Project Design Type"
            :model-value="
              lenderInfoStore.getPropertyAndLoanInformation().ProjectDesignType
            "
            @update:model-value="
              (value) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'ProjectDesignType',
                  value,
                })
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="font-weight-medium align-self-center ls-1">Attachment Type</span>
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0 pt-1"
            light
            dense
            :items="attachmentTypes"
            item-title="text"
            item-value="value"
            placeholder="Attachment Type"
            :model-value="lenderInfoStore.getPropertyAndLoanInformation().AttachmentType"
            @update:model-value="
              (value) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'AttachmentType',
                  value,
                })
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls-1"
            >Property Structure Built Year</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="
              lenderInfoStore.getPropertyAndLoanInformation().PropertyStructureBuiltYear
            "
            @input="
              (e) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'PropertyStructureBuiltYear',
                  value: +e.target.value,
                })
            "
            placeholder="Property Structure Built Year"
            hide-details
            type="number"
            min="1800"
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls-1"
            >Property Valuation Amount</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="
              getFormattedValue(
                loanPropertyStore.getProperty().PropertyValuationAmount
              ) || ''
            "
            @input="(e) => setValuationAmount(+e.target.value.replace(/,/g, ''))"
            placeholder="Property Valuation Amount"
            hide-details
            prefix="$"
            @keypress="(e) => isOnlyNum(e, true)"
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls-1"
            >Appraisal Identifier</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="
              lenderInfoStore.getPropertyAndLoanInformation().AppraisalIdentifier
            "
            @input="
              (e) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'AppraisalIdentifier',
                  value: e.target.value,
                })
            "
            placeholder="Appraisal Identifier"
            hide-details
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="mr-6 font-weight-medium align-self-center ls-1"
            >Property Ground Lease Expiration Date</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-menu
            light
            v-model="isDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ props }">
              <v-text-field
                variant="underlined"
                light
                dense
                :model-value="formattedDate"
                placeholder="Property Ground Lease Expiration Date"
                prepend-icon="mdi-calendar-range"
                readonly
                v-bind="props"
                style="max-width: 300px !important"
                hide-details
                class="ma-0 pa-0 date-input"
              />
            </template>
            <v-date-picker
              light
              color="primary"
              :model-value="
                getDateObject(
                  lenderInfoStore.getPropertyAndLoanInformation()
                    .PropertyGroundLeaseExpirationDate
                )
              "
              @update:model-value="setGroundLeaseExpirationDate"
            />
          </v-menu>
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="font-weight-medium align-self-center ls-1"
            >Property Estate Type</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0 pt-1"
            light
            dense
            :items="propertyEstateTypes"
            item-title="text"
            item-value="value"
            placeholder="Property Estate Type"
            :model-value="
              lenderInfoStore.getPropertyAndLoanInformation().PropertyEstateType
            "
            @update:model-value="
              (value) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'PropertyEstateType',
                  value,
                })
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="font-weight-medium align-self-center ls-1"
            >Construction Loan Type</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0 pt-1"
            light
            dense
            :items="[
              { text: 'Construction To Permanent', value: 'ConstructionToPermanent' },
            ]"
            item-title="text"
            item-value="value"
            placeholder="Construction Loan Type"
            :model-value="
              lenderInfoStore.getPropertyAndLoanInformation().ConstructionLoanType
            "
            @update:model-value="
              (value) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'ConstructionLoanType',
                  value,
                })
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>
        <v-col class="pa-1 d-flex" lg="2" cols="4">
          <span class="font-weight-medium align-self-center ls-1"
            >Refinance Primary Purpose Type</span
          >
        </v-col>
        <v-col class="pa-1" lg="10" cols="6">
          <v-select
            class="mx-1 my-0 pt-1"
            :items="refinancePrimaryPurposeTypes"
            item-title="text"
            item-value="value"
            placeholder="Refinance Primary Purpose Type"
            :model-value="
              lenderInfoStore.getPropertyAndLoanInformation().RefinancePrimaryPurposeType
            "
            @update:model-value="
              (value) =>
                lenderInfoStore.updatePropertyAndLoanInfo({
                  prop: 'RefinancePrimaryPurposeType',
                  value,
                })
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
            light
            dense
            variant="underlined"
          ></v-select>
        </v-col>
      </v-row>
      <CustomButton
      class="button"
        value="Save"
        customClass="primary-button"
        @onHandleClick="generalStore.saveLoanPatches"
      />
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
.p-4 {
  padding: 16px;
}

:deep(.v-select) {
  .v-field__input {
    padding-top: 4px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    min-height: 26px;
    font-size: 13px !important;
    letter-spacing: normal !important;
  }
  .v-field__append-inner,
  .v-field__clearable {
    padding-top: 0px !important;
    padding-bottom: 2px !important;
    min-height: 23px;
  }
}
:deep(.v-input .v-text-field__prefix) {
  opacity: 1 !important;
  visibility: visible !important;
}
.font-weight-medium {
  color: #00000099 !important;
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
.ls-1 {
  letter-spacing: 0.1px !important;
  line-height: 21.8px !important;
}
:deep(.date-input) {
  label {
    font-size: 9.9px !important;
    margin-top: 4px !important;
    letter-spacing: normal !important;
  }
  input {
    padding-top: 4px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    min-height: 23px;
    font-size: 13px !important;
    letter-spacing: normal !important;
  }
  .v-input__prepend {
    padding-top: 4px !important;
    padding-bottom: 0px !important;
    min-height: 23px;
    margin-right: 8px !important;
  }
}
.button{
  margin-top: 30px !important;
  margin-left: -1px !important
}
</style>
