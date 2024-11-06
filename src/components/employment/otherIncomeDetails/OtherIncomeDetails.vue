<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { computed, ref, watch } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import moment from "moment";
import { debtToIncomeAndHousingRatios } from "@/mixins/debtToIncomeAndHousingRatios";

const { isOnlyNum } = number();
const startDateMenuOpenIndex = ref(-1);
const endDateMenuOpenIndex = ref(-1);
const menuOpenedStartDate = ref(null);
const menuOpenedEndDate = ref(null);
const additional = ref(null);
const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const { setDebtToIncomeAndHousingRatios } = debtToIncomeAndHousingRatios();

const types = ref([
  "Accessory Unit Income",
  "Alimony",
  "Automobile Allowance",
  "Boarder Income",
  "Capital Gains",
  "Child Support",
  "Defined Contribution Plan",
  "Disability",
  "Dividends Interest",
  "Employment Related Account",
  "Foster Care",
  "Housing Allowance",
  "Housing Choice Voucher Program",
  "Mortgage Credit Certificate",
  "Mortgage Differential",
  "Non Borrower Household Income",
  "Notes Receivable Installment",
  "Pension",
  "Public Assistance",
  "Royalties",
  "Separate Maintenance",
  "Social Security",
  "Temporary Leave",
  "Tip Income",
  "Trust",
  "Unemployment",
  "VA Benefits Non Educational",
  "Other",
]);

const currentDate = ref(new Date().toISOString().slice(0, 10));

const setOtherIncome = (prop, val, index) => {
  if (prop == "StartDate") {
    val = moment(new Date(val)).format("YYYY-MM-DD");
  }
  const Income = employmentStore
    .getOtherIncome()
    .map((item, i) => (index !== i ? item : { ...item, [prop]: val }));
  borrowersStore.updateBorrower({ prop: "OtherIncome", value: Income });
};

const clearDate = (index, date) => {
  removeProp(index, date);
  if (date == "StartDate") {
    startDateMenuOpenIndex.value = -1;
  } else {
    endDateMenuOpenIndex.value = -1;
  }
};

const setType = (val, index) => {
  setOtherIncome("IncomeType", val.replace(/ /g, ""), index);
};

const setAmount = (val, index) => {
  setOtherIncome("CurrentIncomeMonthlyTotalAmount", val, index);
};

const setOngoing = (val, index) => {
  setOtherIncome("Ongoing", val, index);
  setOtherIncome("Unsure", !val, index);
  setOtherIncome("EndDate", null, index);
};
const setUnsure = (val, index) => {
  setOtherIncome("Ongoing", !val, index);
  setOtherIncome("Unsure", val, index);
  setOtherIncome("EndDate", null, index);
};
const setEndDate = (val, index) => {
  setOtherIncome("Ongoing", !val, index);
  setOtherIncome("Unsure", !val, index);
  setOtherIncome("EndDate", moment(new Date(val)).format("YYYY-MM-DD"), index);
};

const setAdditionalType = (type) => {
  if (!type) return;
  const Income = [
    ...employmentStore.getOtherIncome(),
    {
      IncomeType: type.replace(/ /g, ""),
      EmploymentIncomeIndicator: false,
      StartDate: moment(new Date()).format("YYYY-MM-DD"),
    },
  ];
  borrowersStore.updateBorrower({ prop: "OtherIncome", value: Income });
  additional.value = null;
};

const removeProp = (index, prop) => {
  let income = [...employmentStore.getOtherIncome()];
  delete income[index][prop];
  borrowersStore.updateBorrower({ prop: "OtherIncome", value: income });
};

const remove = (index) => {
  const filtered = employmentStore.getOtherIncome().filter((item, i) => index !== i);
  borrowersStore.updateBorrower({ prop: "OtherIncome", value: filtered });
};

const addType = () => {
  additional.value = { IncomeType: "" };
};

const getSelectedDateProp = (index, propDateName) => {
  const currentIncomeItem = employmentStore.getOtherIncome()[index];
  return currentIncomeItem && currentIncomeItem[propDateName]
    ? moment(currentIncomeItem[propDateName]).format("MMMM DD, YYYY")
    : "";
};

const total = computed(() => {
  return employmentStore.getOtherIncome().length
    ? employmentStore
        .getOtherIncome()
        .reduce(
          (acc, cur) =>
            (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
              ? +cur.CurrentIncomeMonthlyTotalAmount
              : 0),
          0
        )
    : 0;
});

const filteredTypes = computed(() => {
  const incomeTypes = employmentStore.getOtherIncome().map((item) => item.IncomeType);
  return types.value.filter((item) => incomeTypes.indexOf(item) === -1);
});

watch(
  () => employmentStore.getOtherIncome(),
  () => {
    setDebtToIncomeAndHousingRatios();
  },
  { deep: true }
);

watch(startDateMenuOpenIndex, (val) => {
  menuOpenedStartDate.value = getSelectedDateProp(val, "StartDate");
});

watch(endDateMenuOpenIndex, (val) => {
  menuOpenedEndDate.value = getSelectedDateProp(val, "EndDate");
});
</script>

<template>
  <v-form class="fast-fail form-outer-container">
    <v-row
      class="form-container deleteAbleItem"
      v-for="(item, index) in employmentStore.getOtherIncome()"
      :key="index"
    >
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="remove(index)" elevation="0">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <ComboBox
        :value="
          item.IncomeType ? item.IncomeType.replace(/([a-z])([A-Z])/g, '$1 $2') : ''
        "
        :items="filteredTypes"
        placeholder="Compensation Type"
        @change="(e) => setType(e, index)"
      ></ComboBox>
      <DateInput
        placeholder="Start Date of Income"
        @dateUpdated="(date) => setOtherIncome('StartDate', date, index)"
        @dateCleared="() => clearDate(index, 'StartDate')"
        :value="item.StartDate"
      ></DateInput>
      <TextBox
        prefix="$"
        placeholder="Gross Monthly Income"
        :value="getFormattedValue(item.CurrentIncomeMonthlyTotalAmount)"
        @input="(e) => setAmount(+e.target.value.replace(/,/g, ''), index)"
        @keypress="(e) => isOnlyNum(e, true)"
      ></TextBox>
      <v-col class="itemContainer pb-0" sm="12">
        <div class="titleText">
          For how long do you expect to receive this type of income
        </div>
      </v-col>
      <v-col class="itemContainer mt-26 align-center d-flex pt-0 flex-wrap basis-1" sm="auto">
        <CheckBox
          class="defaultCheckbox"
          label="Ongoing"
          :isChecked="item.Ongoing"
          @toggle="(e) => setOngoing(e, index)"
          :hideDetails="true"
        ></CheckBox>
        <div class="checkbox titleText pl-3 mb-0">Or</div>
      </v-col>
      <v-col class="itemContainer mt-26 align-center d-flex pt-0 flex-wrap" sm="auto">
        <CheckBox
          class="defaultCheckbox"
          label="Unsure"
          :isChecked="item.Unsure"
          @toggle="(e) => setUnsure(e, index)"
          :hideDetails="true"
        ></CheckBox>
        <div class="checkbox titleText pl-3 mb-0">Or</div>
      </v-col>
      <DateInput
        class="pt-0"
        placeholder="Expected End Date"
        :disabled="item.OngoingUnsure == true"
        @dateUpdated="(date) => setEndDate(date, index)"
        @dateCleared="() => clearDate(index, 'EndDate')"
        :value="item.EndDate"
      ></DateInput>
      <v-col class="itemContainer d-flex pt-0 pl-0" sm="auto">
        <div class="titleText pt-5 mt-4">?</div>
      </v-col>
    </v-row>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional = null" elevation="0">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <ComboBox
        :value="additional.IncomeType"
        :items="filteredTypes"
        placeholder="Compensation Type"
        @change="setAdditionalType"
      ></ComboBox>
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="addType"
          v-if="filteredTypes.length"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add Other Income Source</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12"
        >Total: ${{ getFormattedValue(total) || 0 }}</v-col
      >
    </v-row>
  </v-form>
</template>
<style lang="scss" scoped>
.flex-wrap {
  flex-wrap: wrap;
}

.totals {
  font-weight: 500;
  font-size: 18px;
  &__title {
    margin-right: 10px;
  }
}

:deep(.v-checkbox) {
  .v-label {
    color: $text-black !important;
    opacity: 1;
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
:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}


.form-container.addItemBtnContainer {
  margin-top: -30px !important;
}
.form-container.addItemBtnContainer .addItemBtn {
  max-width: unset !important;
}
:deep(.defaultCheckbox .v-label) {
  text-wrap: nowrap !important;
}
:deep(.defaultCheckbox) {
  padding-top: 0px !important;
  :deep(.v-checkbox .v-selection-control) {
    padding-top: 28px !important;
  }
  i{
    font-size: 24px;
  }
}

@media (max-width: $lg-mobile-width) {
  :deep(.v-col) {
    flex-basis: max-content !important;
  }
  :deep(.checkbox.titleText) {
    display: flex;
    padding: 0px !important;
    margin-bottom: 0px !important;
    margin-top: 0px !important;
    margin-left: 8px !important;
    justify-content: center;
    align-items: center;
    max-height: 40px !important;
  }
  :deep(.defaultCheckbox .v-checkbox .v-selection-control) {
    min-height: 32px !important;
    padding: 0px !important;
  }
}
.mt-26{
  margin-top: 26px;
}
</style>
