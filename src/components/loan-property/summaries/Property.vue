<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import AddressEditor from "@/components/core-components/AddressEditor.vue";
import { onMounted, ref, watch, computed, defineProps } from "vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { useGeneralStore } from "@/stores/generalStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { getFormattedValue, getFormattedValueStatic } from "@/mixins/currencyFormat.js";
import config from "@/configs";
import { number } from "@/mixins/onlyNum";

const props = defineProps({
  Property: {
      type: Object,
      default: () => {
        return null;
      }
    }
})

const loanPropertyStore = useLoanPropertyStore();
const Property = ref(props.Property);
const realEstateStore = useRealEstateStore();
const lenderInfoStore = useLenderInfoStore();
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const loanPurposeType = ref(loanPropertyStore.getLoanPurposeType());
const { isOnlyNum } = number();
const addressEditor = ref(null);

watch(
  () => props.Property,
  (newValue) => {
    Property.value = newValue;
    setMapOptions();
  },
  { deep: true }
);

const coord = ref(null);
const years = ref([]);
const types = ref([
  "Single Family Detached",
  "Condominium",
  "Townhouse",
  "Co-operative",
  "Two-to-four unit property",
  "Multifamily",
  "Manufactured/Mobile",
]);
const occupancies = ref([
  "Single Family Detached",
  "Primary Residence",
  "Second Home",
  "Investment",
  "FHA Secondary Residence",
]);
const mapTypeControlOptions = ref(null);
const housingExpenseTypes = ref([
  { id: 1, text: "Property Taxes", value: "RealEstateTax" },
  { id: 2, text: "Hazzard Insurance", value: "HomeownersInsurance" },
  {
    id: 3,
    text: "HOA/Condo Fees",
    value: "HomeownersAssociationDuesAndCondominiumFees",
  },
  { id: 4, text: "Flood Insurance", value: "HomeownersInsurance" },
  { id: 5, text: "Wind Insurance", value: "HomeownersInsurance" },
  { id: 6, text: "Earthquake Insurance", value: "HomeownersInsurance" },
  {
    id: 7,
    text: "HOA Fees",
    value: "HomeownersAssociationDuesAndCondominiumFee",
  },
  {
    id: 8,
    text: "Condo Fees",
    value: "HomeownersAssociationDuesAndCondominiumFee",
  },
  {
    id: 9,
    text: "Master Association Fees",
    value: "HomeownersAssociationDuesAndCondominiumFee",
  },
  { id: 10, text: "Mortgage Insurance", value: "MIPremium" },
  { id: 11, text: "Other", value: "Other" },
]);
const propertyDataBeforeEdit = ref(null);
const propertyValueBeforeEdit = ref(null);
const housingExpensesBeforeEdit = ref(null);
const expectedRentalIncomeBeforeEdit = ref(null);
const currentYear = new Date().getFullYear() + 1;

years.value = Array.from({ length: currentYear - 1799 }, (_, index) =>
  (currentYear - index).toString()
);

onMounted(() => {
  if (google) {
    mapTypeControlOptions.value = {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT,
    };
  }
  setFinancedUnitCount(1);
  setMapOptions();
});

const updateAddress = (addressData) => {
  let property = Property.value ? { ...Property.value, ...addressData } : addressData;
  loanPropertyStore.setProperty(property);
};

const updateAddressProp = ({ prop, value }) => {
  loanPropertyStore.setProperty({ ...Property.value, [prop]: value });
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  propertyDataBeforeEdit.value = [
    { prop: "AddressLineText", value: Property.value.AddressLineText },
    {
      prop: "AddressUnitIdentifier",
      value: Property.value.AddressUnitIdentifier,
    },
    { prop: "CityName", value: Property.value.CityName },
    { prop: "StateCode", value: Property.value.StateCode },
    {
      prop: "PostalCode",
      value: Property.value.PostalCode,
    },
    {
      prop: "PropertyType",
      value: Property.value.PropertyType,
    },
    {
      prop: "YearBuilt",
      value: Property.value.YearBuilt,
    },
    {
      prop: "FinancedUnitCount",
      value: Property.value.FinancedUnitCount,
    },
    {
      prop: "PropertyUsageType",
      value: Property.value.PropertyUsageType,
    },
  ];
  propertyValueBeforeEdit.value = getCorrectValue();
  housingExpensesBeforeEdit.value = JSON.parse(
    JSON.stringify(realEstateStore.getHousingExpenses())
  );
  expectedRentalIncomeBeforeEdit.value = RentalEstimatedGrossMonthlyRentAmount.value;
};

const onCancelClicked = () => {
  const property = Property.value || {};
  for (let i = 0; i < propertyDataBeforeEdit.value.length; i++) {
    property[propertyDataBeforeEdit.value[i].prop] =
      propertyDataBeforeEdit.value[i].value;
  }
  loanPropertyStore.setProperty({ ...property });
  setEstimatedValue(Property.valueValueBeforeEdit);

  lenderInfoStore.updateMortgageLoanInfo({
    prop: "HousingExpenses",
    value: housingExpensesBeforeEdit.value,
  });

  setPropertyValue(expectedRentalIncomeBeforeEdit.value);
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const setPropertyType = (type) => {
  const property = Property.value
    ? { ...Property.value, PropertyType: type ? type.replace(/ /g, "") : "" }
    : { PropertyType: type ? type.replace(/ /g, "") : "" };
  loanPropertyStore.setProperty(property);
};

const setOccupancy = (occupancy) => {
  const isFHA = occupancy === "FHA Secondary Residence";
  let property = Property.value
    ? {
        ...Property.value,
        PropertyUsageType: occupancy ? occupancy.replace(/ /g, "") : "",
      }
    : { PropertyUsageType: occupancy ? occupancy.replace(/ /g, "") : "" };
  if (isFHA) {
    property.FHASecondaryResidenceIndicator = true;
  } else {
    delete property.FHASecondaryResidenceIndicator;
  }
  loanPropertyStore.setProperty(property);
};

const setEstimatedValue = (e) => {
  let prop = "EstimatedPurchasePrice";
  prop = loanPurposeType.value === "Refinance" ? "PropertyEstimatedValueAmount" : prop;
  if (prop === "PropertyEstimatedValueAmount") {
    const property = Property.value ? { ...Property.value, [prop]: e } : { [prop]: e };
    loanPropertyStore.setProperty(property);
  } else {
    borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, [prop]: e });
  }
};

const setFinancedUnitCount = (val) => {
  const property = Property.value
    ? { ...Property.value, FinancedUnitCount: val }
    : { FinancedUnitCount: val };
  loanPropertyStore.setProperty(property);
};

const getCorrectValue = () => {
  if (generalStore.currentLoan) {
    return loanPurposeType.value === "Refinance" && Property.value
      ? getFormattedValue(Property.value.PropertyEstimatedValueAmount)
      : getFormattedValue(generalStore.currentLoan.EstimatedPurchasePrice);
  }
  return "";
};

const getSplittedOccupancy = (val) => {
  return val.substring(0, 3) === "FHA"
    ? `${val.substring(0, 3)} ${val.substring(3).replace(/([a-z])([A-Z])/g, "$1 $2")}`
    : val.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const updateHousingExpense = (type, note, value, term = "Monthly") => {
  let HousingExpenses = [...realEstateStore.getHousingExpenses()];

  const expenseIndex = HousingExpenses.findIndex(
    (item) => item.HousingExpenseType === type && item.HousingExpenseNote === note
  );

  if (expenseIndex !== -1) {
    if (value === "") {
      HousingExpenses[expenseIndex].HousingExpensePaymentAmount = null;
    } else {
      HousingExpenses[expenseIndex].HousingExpensePaymentAmount = value;
    }
  } else if (value !== "") {
    HousingExpenses.push({
      HousingExpenseTimingType: "Proposed",
      HousingExpenseType: type,
      HousingExpenseNote: note,
      HousingExpensePaymentAmount: value,
      HousingExpenseTerm: term,
      HousingExpenseTypeOtherDescription: type === "Other" ? "" : undefined,
    });
  }

  lenderInfoStore.updateMortgageLoanInfo({
    prop: "HousingExpenses",
    value: HousingExpenses,
  });
};

const setMapOptions = () => {
  if (address.value != null && address.value !== "") {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        address: address.value,
      },
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          coord.value = {
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng(),
          };
          return;
        }
      }.bind(this)
    );
  } else {
    coord.value = null;
  }
};

const setPropertyValue = (e) => {
  const property = Property.value || {};
  const RentalIncome = property.RentalIncome
    ? { ...property.RentalIncome, RentalEstimatedGrossMonthlyRentAmount: e }
    : { RentalEstimatedGrossMonthlyRentAmount: e };

  loanPropertyStore.setProperty({ ...property, RentalIncome });
};

const updateOtherDescription = (text, description) => {
  let HousingExpenses = [...realEstateStore.getHousingExpenses()];

  const index = HousingExpenses.findIndex(
    (e) => e.HousingExpenseType === "Other" && e.HousingExpenseNote === text
  );
  if (index !== -1) {
    HousingExpenses[index] = {
      ...HousingExpenses[index],
      HousingExpenseTypeOtherDescription: description,
    };
    lenderInfoStore.updateMortgageLoanInfo({
      prop: "HousingExpenses",
      value: HousingExpenses,
    });
  }
};

const getExpenseDisplayText = (expenseType, expenseNote, expenseTerm) => {
  let displayText;

  if (
    expenseType === "HomeownersInsurance" ||
    expenseType === "HomeownersAssociationDuesAndCondominiumFee" ||
    expenseType === "Other"
  ) {
    displayText = expenseNote;
  } else {
    const expenseTypeObj = housingExpenseTypes.value.find((t) => t.value === expenseType);
    displayText = expenseTypeObj ? expenseTypeObj.text : expenseNote;
  }

  if (expenseTerm) {
    const termDisplay = expenseTerm === "Yearly" ? "Yearly" : "Monthly";
    return `${displayText} (${termDisplay})`;
  } else {
    return displayText;
  }
};

const getUniqueExpenses = () => {
  const uniqueExpenses = [];
  const usedTypes = new Set();

  realEstateStore.getHousingExpenses().forEach((expense) => {
    uniqueExpenses.push(expense);
    usedTypes.add(expense.HousingExpenseType);
  });

  housingExpenseTypes.value.forEach((expenseType) => {
    if (!usedTypes.has(expenseType.value)) {
      uniqueExpenses.push({
        HousingExpenseType: expenseType.value,
        HousingExpenseNote: expenseType.text,
        HousingExpensePaymentAmount: null,
        HousingExpenseTerm: "Monthly",
      });
    }
  });

  return uniqueExpenses;
};

const mapZoomLevel = computed(() => {
  return config.mapZoomLevel;
});

const address = computed(() => {
  const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
  if (Property.value) {
    return keys.reduce((acc, cur) => {
      if (Property.value[cur]) {
        acc += `${Property.value[cur]}${cur === "PostalCode" ? " " : ", "}`;
      }
      return acc;
    }, "");
  }
  return "";
});

const isSubmitDisabled = computed(() => {
  return (
    (addressEditor.value == null || !addressEditor.value?.isGoogleAddressFound) &&
    (Property.value.AddressLineText == "" ||
      Property.value.AddressUnitIdentifier == "" ||
      Property.value.CityName == "" ||
      Property.value.StateCode == "")
  );
});

const displayExpectedMonthlyRentalIncome = computed(() => {
  if (
    loanPurposeType.value === "Purchase" &&
    ((Property.value.PropertyUsageType === "PrimaryResidence" &&
      Property.value.PropertyType === "Two-to-fourUnitProperty") ||
      (Property.value.PropertyUsageType === "Investment" &&
        Property.value.PropertyType == null))
  ) {
    return true;
  }
  return false;
});

const houseDescription = computed(() => {
  if (Property.value == null) {
    return "";
  }
  let propertyType =
    Property.value.PropertyType != null ? Property.value.PropertyType : "";
  let unitCount =
    Property.value.FinancedUnitCount != null
      ? `, containing ${Property.value.FinancedUnitCount} unit(s)`
      : "";
  let yearBuilt =
    Property.value.YearBuilt != null ? `built in ${Property.value.YearBuilt}` : "";

  if (
    ["SingleFamilyDetached", "Multifamily", "Manufactured/Mobile"].includes(propertyType)
  ) {
    return `A home ${yearBuilt} ${unitCount}`;
  } else if (
    ["Condominium", "Co-operative", "Two-to-fourUnitProperty"].includes(propertyType)
  ) {
    return `A ${propertyType} ${yearBuilt} ${unitCount}`;
  } else {
    return `A property ${yearBuilt} ${unitCount}`;
  }
});

const totalHousingExpenseValue = computed(() => {
  const total = filteredExpenses.value.reduce((total, item) => {
    const value = parseFloat(item.value.replace(/,/g, ""));
    return total + (isNaN(value) ? 0 : value);
  }, 0);

  return getFormattedValue(total);
});

const RentalEstimatedGrossMonthlyRentAmount = computed(() => {
  return Property.value && Property.value.RentalIncome
    ? Property.value.RentalIncome.RentalEstimatedGrossMonthlyRentAmount
    : "";
});

const occupancyType = computed(() => {
  return Property.value.PropertyUsageType
    ? Property.value.PropertyUsageType.replace(/([a-z])([A-Z])/g, "$1 $2")
    : "";
});

const filteredExpenses = computed(() => {
  return realEstateStore
    .getHousingExpenses()
    .map((expense) => {
      let value = expense.HousingExpensePaymentAmount;

      if (expense.HousingExpenseTerm === "Yearly" && value !== null) {
        value = value / 12;
      }

      const displayText = getExpenseDisplayText(
        expense.HousingExpenseType,
        expense.HousingExpenseNote
      );
      return {
        id: expense.id || `${expense.HousingExpenseType}-${expense.HousingExpenseNote}`,
        text: displayText,
        value: value,
        type: expense.HousingExpenseType,
      };
    })
    .filter((item) => item.value !== null && item.value !== "")
    .map((item) => ({
      ...item,
      value: getFormattedValueStatic(item.value),
    }));
});
</script>
<template>
  <div class="property">
    <NewSummaryControl
      header="Property Details"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
      :submitDisabled="isSubmitDisabled"
    >
      <template v-slot:displayContent>
        <v-row class="ml-1 my-0  ml-sm-2 align-center">
          <v-col sm="12" md="8" cols="12" class="pb-2 pt-0">
            <v-row class="pb-2">
              <v-col sm="3" cols="12" class="py-0 px-3 primary-text">Address:</v-col>
              <v-col sm="9" cols="12" class="py-0 px-3 content-color">{{ address }}</v-col>
            </v-row>
            <v-row class="py-2">
              <v-col sm="3" cols="12" class="py-0 px-3 primary-text">Description:</v-col>
              <v-col sm="9" cols="12" class="py-0 px-3 content-color"> {{ houseDescription }}</v-col>
            </v-row>
            <v-row
              class="py-2"
              v-if="
                Property &&
                Property.PropertyDetail &&
                Property.PropertyDetail.AssessedValue
              "
            >
              <v-col sm="3" cols="12" class="py-0 px-3 primary-text">Assessed Value:</v-col>
              <v-col sm="9" cols="12" class="py-0 px-3 content-color">
                ${{ getFormattedValue(Property.PropertyDetail.AssessedValue) }}</v-col
              >
            </v-row>
            <v-row class="py-2">
              <v-col sm="3" cols="12" class="py-0 px-3 primary-text">Occupancy Type:</v-col>
              <v-col sm="9" cols="12" class="py-0 px-3 content-color"> {{ occupancyType }} </v-col>
            </v-row>
            <v-row class="pt-2">
              <v-col sm="3" cols="12" class="py-0 px-3 primary-text">Housing Expenses:</v-col>
              <v-col sm="9" cols="12" class="py-0 px-3 content-color">
                <div class="mb-2">
                  The proposed Monthly Housing Expenses are ${{
                    totalHousingExpenseValue
                  }}
                </div>
                <span
                  v-for="item in filteredExpenses"
                  :key="item.id"
                  class="py-1 d-block content-color"
                >
                  ${{ item.value }} for {{ item.text }}
                </span>
              </v-col>
            </v-row>
            <v-row class="py-2" v-if="displayExpectedMonthlyRentalIncome">
              <v-col sm="3" cols="12" class="py-0 primary-text">Rental Income:</v-col>
              <v-col sm="9" cols="12" class="py-0 content-color">
                ${{ getFormattedValue(RentalEstimatedGrossMonthlyRentAmount) }}</v-col
              >
            </v-row>
          </v-col>
          <v-col sm="8" md="4" cols="12" class="px-0">
            <GoogleMap
              class="display-section-map"
              style="min-height:200px;width:100%;"
              v-if="coord != null"
              :center="{ lat: +coord.latitude, lng: +coord.longitude }"
              :zoom="mapZoomLevel"
              :streetViewControl="false"
              :mapTypeId="'hybrid'"
              :mapTypeControl="true"
              :scaleControl="false"
              :rotateControl="false"
              :fullscreenControl="false"
              :disableDefaultUi="false"
              :mapTypeControlOptions="mapTypeControlOptions"
            >
              <Marker
                :options="{ position: { lat: +coord.latitude, lng: +coord.longitude } }"
              ></Marker>
            </GoogleMap>
          </v-col>
        </v-row>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail class="d-flex flex-column flex-lg-row">
          <v-row class="form-container d-flex editSectionInputs pr-lg-0 pr-md-5">
            <AddressEditor
              ref="addressEditor"
              :mdVal="6"
              :lgVal="4"
              :isAddressRequired="true"
              :addressObj="Property"
              mainAddressInputText="Street Address"
              uniqueInputId="autocomplete-property"
              :showCountry="false"
              @addressUpdated="updateAddress"
              @addressPropUpdated="updateAddressProp"
            >
            </AddressEditor>
            <ComboBox
              :mdVal="6"
              :lgVal="4"
              :items="types"
              :value="
                Property && Property.PropertyType
                  ? Property.PropertyType.replace(/([a-z])([A-Z])/g, '$1 $2')
                  : ''
              "
              placeholder="Property Type"
              @change="(type) => setPropertyType(type)"
            />
            <SelectBox
              :mdVal="6"
              :lgVal="4"
              :items="years"
              :value="Property.YearBuilt"
              placeholder="Year Built"
              @change="(value) => (Property.YearBuilt = value)"
            />
            <TextBox
              :mdVal="6"
              :lgVal="4"
              placeholder="Enter unit count"
              inputmode="numeric"
              pattern="[0-9]*"
              :value="Property ? Property.FinancedUnitCount : ''"
              @input="(e) => setFinancedUnitCount(+e.target.value)"
              @keypress="(e) => isOnlyNum(e)"
            />
            <ComboBox
              :mdVal="6"
              :lgVal="4"
              placeholder="Select occupancy type"
              :items="occupancies"
              @change="(occupancy) => setOccupancy(occupancy)"
              :value="
                Property && Property.PropertyUsageType
                  ? getSplittedOccupancy(Property.PropertyUsageType)
                  : ''
              "
            />
            <TextBox
              :mdVal="6"
              :lgVal="4"
              prefix="$"
              class="prefix"
              placeholder="Property value"
              :value="getCorrectValue()"
              @input="(e) => setEstimatedValue(+e.target.value.replace(/,/g, ''))"
              @keypress="(e) => isOnlyNum(e, true)"
            />
            <template v-for="(expense, index) in getUniqueExpenses()" :key="index">
              <TextBox
                :mdVal="6"
                :lgVal="4"
                prefix="$"
                class="prefix"
                :placeholder="
                  getExpenseDisplayText(
                    expense.HousingExpenseType,
                    expense.HousingExpenseNote,
                    expense.HousingExpenseTerm
                  )
                "
                :value="
                  expense.HousingExpensePaymentAmount !== null
                    ? getFormattedValue(expense.HousingExpensePaymentAmount)
                    : ''
                "
                @input="
                  (e) =>
                    updateHousingExpense(
                      expense.HousingExpenseType,
                      expense.HousingExpenseNote,
                      e.target.value === '' ? '' : +e.target.value.replace(/,/g, ''),
                      expense.HousingExpenseTerm
                    )
                "
                @keypress="(e) => isOnlyNum(e, true)"
              />
              <TextBox
                v-if="
                  expense.HousingExpenseType === 'Other' &&
                  expense.HousingExpensePaymentAmount > 0
                "
                :key="`other-description-${expense.HousingExpenseType}-${expense.HousingExpenseNote}-${index}`"
                :mdVal="6"
                :lgVal="4"
                placeholder="Other Description"
                :value="expense.HousingExpenseTypeOtherDescription || ''"
                @input="
                  (e) =>
                    updateOtherDescription(expense.HousingExpenseNote, e.target.value)
                "
              />
            </template>
            <TextBox
              v-if="displayExpectedMonthlyRentalIncome"
              :mdVal="6"
              :lgVal="4"
              hide-details
              prefix="$"
              placeholder="Rental income"
              :value="getFormattedValue(RentalEstimatedGrossMonthlyRentAmount)"
              @input="(e) => setPropertyValue(+e.target.value.replace(/,/g, ''))"
              @keypress="(e) => isOnlyNum(e, true)"
            />
          </v-row>
          <v-row class="form-container editSectionMap pl-lg-0 pt-0 pt-lg-5 mt-0 mt-lg-5">
            <v-col class="itemContainer" sm="12" cols="12">
              <GoogleMap
                class="h-100 w-100"
                v-if="coord != null"
                :center="{ lat: +coord.latitude, lng: +coord.longitude }"
                :zoom="mapZoomLevel"
                :streetViewControl="false"
                :mapTypeId="'hybrid'"
                :mapTypeControl="true"
                :scaleControl="false"
                :rotateControl="false"
                :fullscreenControl="false"
                :disableDefaultUi="false"
                :mapTypeControlOptions="mapTypeControlOptions"
              >
                <Marker
                  :options="{ position: { lat: +coord.latitude, lng: +coord.longitude } }"
                ></Marker>
              </GoogleMap>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>
<style lang="scss" scoped>
:deep(.text-block__col) {
  padding-left: 0px;
}
.content-color{
  color: $content-black;
}
.main {
  &__title {
    margin-bottom: 0;
  }
}
.form-container{
  padding: 20px ;
}

.display-section-map {
  padding: 12px;
  position: relative;
  height: 224px;
  width: 336px;
}
:deep(.editSectionInputs) {
  margin: 0 !important;
}
  :deep(.v-row){
    margin: 0 !important;
  }
@media (max-width: $tablet-width) {
  :deep(.summaryCard .header) {
    padding: 30px 20px !important;
  }
  .form-container {
    padding: 20px 10px;
  }
}

.label-12 {
  margin-bottom: 0;
  @media (max-width: $sm-tablet-width) {
    margin-bottom: 15px;
  }
}

@media (max-width: $mobile-width) {
  :deep(.summaryCard .header) {
    padding: 30px 10px !important;
  }
  .form-container {
    padding: 20px 0px;
  }
  .display-section-map{
    width: 100%;
  }
}

:deep(.v-combobox .v-theme--light){
  max-height: 40px !important;
}
.editSectionInputs {
  flex: 3;
}
.editSectionMap {
  flex: 1;
  min-height: 250px;
  padding-top: 30px !important;
}

:deep(.titleText) {
  max-width: 100%;
  text-overflow: ellipsis;
  max-height: 20px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 20px;
}
</style>
