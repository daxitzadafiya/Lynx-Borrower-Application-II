<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import AddressEditor from "../../core-components/AddressEditor.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { onMounted, ref, defineProps, watch, defineEmits, computed } from "vue";
import { useGeneralStore } from "@/stores/generalStore";
import { number } from "@/mixins/onlyNum";
import { residencyLength } from "@/mixins/residencyLength.js";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { googleAutoComplete } from "@/mixins/googleAutoComplete.js";

const icon = ref(null);
const props = defineProps({
  isEmptyMailing: {
    type: Boolean,
    default: false,
  },
  showAddPriorResidenceButton: {
    type: Boolean,
    default: false,
  },
});

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const type = ref("Current");
const uniqueInputId = ref("autocomplete-current");
const dataBeforeEdit = ref(null);
const emit = defineEmits(["toggleMailingAddress"]);
const { isOnlyNum } = number();
const { updatePeriod } = residencyLength();
const isEmptyMailings = ref(props.isEmptyMailing);
const { formattedAddress } = googleAutoComplete(uniqueInputId.value);
const showAddPriorResidenceBtn = ref(props.showAddPriorResidenceButton);
const livingStatuses = ref([
  { text: "Rent", value: "Rent" },
  { text: "Own", value: "Own" },
  { text: "Live Rent Free", value: "None" },
]);

onMounted(async () => {
  let image = await import("@/assets/images/borrowers/current-residence.svg");
  icon.value = image.default;
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

const updateMailing = (bool) => {
  borrowersStore.removeResidence("Mailing");
  borrowersStore.updateResidenceProp({
    type: type.value,
    value: bool,
    prop: 'IsMailingAddress',
  });
  if (bool) {
    emit("toggleMailingAddress", { value: !bool });
  } else {
    borrowersStore.setInitialMailingResidence();
  }
};
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

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(currentResidence.value));
};

const onCancelClicked = () => {
  borrowersStore.updateResidence({type:type.value,value:dataBeforeEdit.value});
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const currentResidence = ref(borrowersStore.getSpecificResidence("Current"))

watch(
  () => borrowersStore.Borrower,
  (newValue) => {
    currentResidence.value = borrowersStore.getSpecificResidence("Current");
  },
  { deep: true }
);

watch(
  () => props.isEmptyMailing,
  (newValue) => {
    isEmptyMailings.value = newValue;
  },
  { deep: true }
);

watch(
  () => props.showAddPriorResidenceButton,
  (newValue) => {
    showAddPriorResidenceBtn.value = newValue;
  },
  { deep: true }
);

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

const isMailing = computed(() => {
  if (currentResidence.value && currentResidence.value.IsMailingAddress) {
    return true;
  } else {
    const Mailing = borrowersStore.getSpecificResidence("Mailing");
    const mailingKeys = [
      "AddressLineText",
      "AddressUnitIdentifier",
      "CityName",
      "CountryCode",
      "PostalCode",
      "StateCode",
    ];
    if (!Mailing) return false;
    for (let key of mailingKeys) {
      if (
        key !== "BorrowerResidencyType" &&
        currentResidence.value[key] !== Mailing[key]
      ) {
        return false;
      } 
    }
    return true
  }
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
watch(
  () => isMailing.value,
  (newValue) => {
    updateMailing(newValue)
  },
  { deep: true }
);
</script>

<template>
  <div class="personal-info">
    <NewSummaryControl
      header="Current Residence"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
    >
      <template v-slot:displayContent>
        <div class="summary-content-container">
          <div class="summaryItem">
            <div class="summaryTitle">Residency Type:</div>
            <div class="summaryValue">{{ currentResidence?.BorrowerResidencyType }}</div>
          </div>
          <div sm="6" lg="9" cols="12" class="summaryItem">
            <div class="summaryTitle">Address:</div>
            <div class="summaryValue truncate">{{ addressText }}</div>
          </div>
          <div class="summaryItem">
            <div class="summaryTitle">Duration:</div>
            <div class="summaryValue truncate">{{ period?.text }}</div>
          </div>
          <div class="summaryItem">
            <div class="summaryTitle">Mailing Address:</div>
            <div class="summaryValue">{{ isMailing ? "Yes" : "No" }}</div>
          </div>
          <div class="summaryItem">
            <div class="summaryTitle">Living Expenses:</div>
            <div class="summaryValue">{{ currentResidence?.ResidencyBasisType }}</div>
          </div>
        </div>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail>
          <div class="currentRes ga-6 pa-0 ma-0 d-flex flex-column">
            <AddressEditor
              :mdVal="0"
              :lgVal="0"
              class="address-editor d-flex w-100 flex-wrap ga-6 order-1"
              :isSummary="true"
              :addressObj="currentResidence"
              :uniqueInputId="uniqueInputId"
              :isMailing="isMailing"
              :showMailingAddressSelector="true"
              @addressUpdated="updateAddress"
              @addressPropUpdated="updateAddressProp"
              @mailingUpdated="updateMailing"
              mainAddressInputText="Street Address"
            ></AddressEditor>

            <v-row class="ma-0 howLongInputBox ga-6">
              <TextBox
                :mdVal="3"
                placeholder="Years"
                :value="period.years"
                isRequired
                pattern="[0-9]*"
                @input="(e) => updatePeriod(e, 'years', type, period)"
                @keypress="(e) => isOnlyNum(e)"
              />
              <TextBox
                :mdVal="3"
                placeholder="Months"
                :value="period.months"
                isRequired
                pattern="[0-9]*"
                @input="(e) => updatePeriod(e, 'months', type, period)"
                @keypress="(e) => isOnlyNum(e)"
              />
              <SelectBox
                appendIcon="mdi-chevron-down"
                :mdVal="3"
                placeholder="Living Status"
                :items="livingStatuses"
                itemText="text"
                itemValue="value"
                @change="(e) => setResidencyBasisType(e)"
                :value="currentResidence?.ResidencyBasisType"
              />
              <TextBox
                :mdVal="3"
                v-if="currentResidence?.ResidencyBasisType !== 'None'"
                :value="getFormattedValue(currentResidence?.MonthlyRentAmount)"
                placeholder="Rental Amount"
                prefix="$"
                hide-details
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
                  }
                "
                @keypress="(e) => isOnlyNum(e, true)"
              />
            </v-row>

            <div class="W-100 howLongText pb-4">
              How long have you lived at this residence?
            </div>
          </div>
          <v-row
            class="form-container addItemBtnContainer"
            v-if="!isMailing && !isEmptyMailings"
          >
            <v-col cols="12" sm="12" class="itemContainer">
              <v-btn
                dense
                plain
                elevation="0"
                class="addItemBtn negativeLeftMargin"
                @click="emit('toggleMailingAddress', { value: true })"
              >
                <v-icon small>mdi-plus</v-icon>
                <span class="addBtnText">Add Mailing Address</span>
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            class="form-container addItemBtnContainer"
            v-if="
              showAddPriorResidenceBtn &&
              currentResidence &&
              currentResidence?.ResidencyDurationMonthsCount < 24
            "
          >
            <v-col cols="12" sm="12" class="itemContainer">
              <v-btn
                dense
                plain
                elevation="0"
                class="addItemBtn negativeLeftMargin"
                @click="emit('toggleMailingAddress', { value: true })"
              >
                <v-icon small>mdi-plus</v-icon>
                <span class="addBtnText">Add Prior Residence Button</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";
.w-fit {
  width: fit-content;
}

:deep(.add-button__inner) {
  margin-top: -3px;
}

:deep(.v-card__text) {
  margin-left: -12px;
  margin-right: -12px;
}
:deep(.v-selection-control-group) {
  display: flex;
  align-items: center;
  column-gap: 10px;
  i{
    font-size: 24px;
  }
  flex-direction: row;
  width:fit-content;
  .v-label{
    font-size: 16px;
  }
}
:deep(.items-center) {
  align-items: center;
}
:deep(.v-label--clickable) {
  text-wrap: nowrap !important;
}

.form-container.addItemBtnContainer{
  padding:25px 30px 30px;
  margin-top: -30px;
}

:deep(.addItemBtn i) {
  padding: 12px !important;
  font-size: 16px !important;
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

:deep(.summaryCardViewMode){
  padding: 16px !important;
  .summary-content-container{
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
      font-weight: 400 !important;
      line-height: 21px !important;
      letter-spacing: 0.0016em;
      padding: 0 !important;
      opacity: 1;
    }
  }
}
</style>
