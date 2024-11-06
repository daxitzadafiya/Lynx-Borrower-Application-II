<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { computed, onMounted, ref, defineProps, watch, defineEmits } from "vue";
import AddressEditor from "../../core-components/AddressEditor.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import { googleAutoComplete } from "@/mixins/googleAutoComplete.js";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { residencyLength } from "@/mixins/residencyLength.js";


const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const isEditMode = ref(props.isEditMode);
const icon = ref(null);
const uniqueInputId = ref("autocomplete-prior");
const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const { formattedAddress } = googleAutoComplete(uniqueInputId.value);
const dataBeforeEdit = ref(null);
const type = ref("Prior");
const { isOnlyNum } = number();
const { updatePeriod } = residencyLength();

watch(
  () => props.isEditMode,
  (newValue) => {
    isEditMode.value = newValue;
  },
  { deep: true }
);

onMounted(async () => {
  let image = await import("@/assets/images/borrowers/current-residence.svg");
  icon.value = image.default;
});

const livingStatuses = ref([
  { text: "Rent", value: "Rent" },
  { text: "Own", value: "Own" },
  { text: "Live Rent Free", value: "None" },
]);

const currentResidence = computed(() => {
  return borrowersStore.getSpecificResidence("Prior");
});

const updateAddress = (addressData) => {
    borrowersStore.updateResidence({ type: type.value, value: addressData });
};

const updateAddressProp = ({ prop, value }) => {
  borrowersStore.updateResidenceProp({
    type: type.value,
    value: value,
    prop: prop,
  });
};

const emit = defineEmits(['onCancelEdit'])
const setResidencyBasisType = (e) => {
  borrowersStore.updateResidenceProp({
    type: type.value,
    value: e,
    prop: "ResidencyBasisType",
  });
  borrowersStore.updateResidenceProp({
    type: type.value,
    value: "",
    prop: "MonthlyRentAmount",
  });
};

const period = computed(() => {
  let result = { years: 0, months: 0 };
  if (currentResidence.value.ResidencyDurationMonthsCount) {
    if (currentResidence.value.ResidencyDurationMonthsCount >= 12) {
      const years =
        Math.floor(+currentResidence.value.ResidencyDurationMonthsCount / 12) || 0;
      const months = currentResidence.value.ResidencyDurationMonthsCount % 12 || "";
      result = { years, months };
    } else {
      result.months = currentResidence.value.ResidencyDurationMonthsCount;
    }
  }
  let resText = "";
  resText = result.years !== 0 ? result.years + " Years" : "";
  if (result.months !== 0) {
    resText += result.months !== 0 && resText !== "" ? " " : "";
    resText += result.months + " Months";
  }
  return {
    years: result.years,
    months: result.months,
    text: resText,
  };
});

const addressText = computed(() => {
  const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
  if (currentResidence.value) {
    return keys.reduce((acc, cur) => {
      if (currentResidence.value[cur]) {
        acc += `${currentResidence.value[cur]}${cur === "PostalCode" ? " " : ", "}`;
      }
      return acc;
    }, "");
  }
  return formattedAddress;
});

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = currentResidence.value
    ? JSON.parse(JSON.stringify(currentResidence.value))
    : undefined;
};

const onCancelClicked = () => {
  borrowersStore.updateResidence({ type: type.value, value: dataBeforeEdit.value });
  emit('onCancelEdit')
};

const onSaveClicked = async () => {
  generalStore.saveLoanPatches();
};
</script>

<template>
  <div class="personal-info">
    <NewSummaryControl
      header="Prior Residence"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
      ref="summaryControl"
      :isEditMode="isEditMode"
    >
      <template v-slot:displayContent>
        <div class="summary-content-container">
          <div  class="summaryItem">
            <div class="summaryTitle">Residency Type:</div>
            <div class="summaryValue">{{ currentResidence?.BorrowerResidencyType }}</div>
          </div>
          <div class="summaryItem">
            <div class="summaryTitle">Address:</div>
            <div class="summaryValue">{{ addressText }}</div>
          </div>
          <div  class="summaryItem">
            <div class="summaryTitle">Duration:</div>
            <div class="summaryValue truncate">{{ period.text }}</div>
          </div>
          <div  class="summaryItem">
            <div class="summaryTitle">Duration:</div>
            <div class="summaryValue truncate">{{ period.text }}</div>
          </div>
          <div  class="summaryItem">
            <div class="summaryTitle">Living Expenses:</div>
            <div class="summaryValue">{{ currentResidence.ResidencyBasisType }}</div>
          </div>
          <div  class="summaryItem">
            <div class="summaryTitle">Rent Amount:</div>
            <div class="summaryValue">$ {{ getFormattedValue(currentResidence?.MonthlyRentAmount) }}</div>
          </div>
        </div>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail>
          <v-row class="ga-6 pa-0 ma-0 d-flex flex-column currentRes">
            <AddressEditor
              :mdVal="0"
              :lgVal="0"
              class="d-flex w-100 flex-wrap address-editor ga-6"
              :addressObj="currentResidence"
              :uniqueInputId="uniqueInputId"
              :showMailingAddressSelector="false"
              @addressUpdated="updateAddress"
              @addressPropUpdated="updateAddressProp"
              mainAddressInputText="Street Address"
            ></AddressEditor>
            <v-row class="ma-0 howLongInputBox ga-6">
              <TextBox
                placeholder="Years"
                :value="period.years"
                pattern="[0-9]*"
                hide-details
                @input="(e) => updatePeriod(e, 'years', type, period)"
                @keypress="(e) => isOnlyNum(e)"
              />
              <TextBox
                placeholder="Months"
                pattern="[0-9]*"
                hide-details
                :value="period.months"
                @input="(e) => updatePeriod(e, 'months', type, period)"
                @keypress="(e) => isOnlyNum(e)"
              />
              <SelectBox
                appendIcon="mdi-chevron-down"
                placeholder="Type of living Statuses"
                :items="livingStatuses"
                itemText="text"
                itemValue="value"
                @change="(e) => setResidencyBasisType(e)"
                :value="currentResidence?.ResidencyBasisType"
              />
              <TextBox
                placeholder="Rental Amount"
                prefix="$"
                hide-details
                :value="getFormattedValue(currentResidence?.MonthlyRentAmount)"
                @input="
                  (e) => {
                    const value =
                      typeof e === 'string'
                        ? e.replace(/,/g, '')
                        : e.target.value.replace(/,/g, '');
                    borrowersStore.updateResidenceProp({
                      type,
                      value: +value,
                      prop: 'MonthlyRentAmount',
                    });
                  }"
                @keypress="(e) => isOnlyNum(e, true)"
              />
            </v-row>

            <div class="W-100 howLongText pb-4">
              How long have you lived at this residence?
            </div>
          </v-row>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";
:deep(.v-card__text) {
  margin-left: -12px;
  margin-right: -12px;
}

:deep(.add-button__inner) {
  margin-top: -3px;
}
:deep(.currentRes){
  padding: 40px;
}
:deep(.v-selection-control-group){
  display: flex;
  align-items: center;
  flex-direction: row;
  column-gap: 10px;
}
:deep(.items-center){
  align-items: center;
}
:deep(.v-label--clickable){
  text-wrap: nowrap !important;
}

:deep(.header){
  padding: 12px 16px !important;
}
:deep(.headerText){
  color: $dark-grayV2 !important;
  font-size: 16px !important;
  line-height: 24px !important;
  letter-spacing: 0.02em;
  font-weight: 500!important;
}
:deep(.summaryCardViewMode) {
  padding: 0 !important;

  .summary-content-container {
    padding-left: 0 !important;
    margin: 0 !important;
    column-gap: 24px;
    row-gap: 8px;
    display: grid;
    grid-template-columns: 1fr 3fr;

    @media (max-width:$xxl-desktop-width) {
      grid-template-columns: 1fr 1fr;
    }
    
    @media (max-width: $tablet-width) {
      grid-template-columns: 1fr 1fr;
      row-gap: 16px;
    }
    @media (max-width: $lg-mobile-width) {
      grid-template-columns: 1fr;
    }
  }
}
:deep(.address-editor) {
  gap: 24px;
}

:deep(.itemContainer) {
  .titleText {
    margin-top: 0px !important;
    margin-bottom: 4px !important;
    color: $dark-grayV2;
    font-size: 14px;
    font-weight: 400 !important;
    line-height: 21px !important;
    letter-spacing: 0.0016em;
    padding: 0 !important;
    white-space: nowrap;
  }

  padding: 0 !important;
  max-width: calc(25% - 18px) !important;

  @media (max-width:$desktop-width) {
    max-width: calc(33.33% - 16px) !important;
  }

  @media (max-width:$tablet-width) {
    max-width: calc(50% - 12px) !important;
  }

  @media (max-width: $mobile-width) {
    max-width: 100% !important;
  }

  .v-selection-control-group {
    gap: 24px;
    height: 40px;

    .v-label {
      white-space: nowrap !important;
      color: $dark-grayV2 !important;
      font-size: 14px;
      font-weight: 500 !important;
      line-height: 21px !important;
      letter-spacing: 0.0016em;
      padding: 0 !important;
      opacity: 1;
    }
  }
}
</style>
