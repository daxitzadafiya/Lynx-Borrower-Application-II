<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { number } from "@/mixins/onlyNum";

const options = ref([
  {
    label: "Monthly",
    value: "Monthly",
  },
  {
    label: "Yearly",
    value: "Yearly",
  },
]);

const newItemVisible = ref(false);
const realEstateStore = useRealEstateStore();
const loanPropertyStore = useLoanPropertyStore();
const lenderInfoStore = useLenderInfoStore();
const housingExpenses = ref(realEstateStore.getHousingExpenses());
const Property = ref(loanPropertyStore.getProperty());
const { isOnlyNum } = number();

watch(
  () => loanPropertyStore.lenderLoanInformation,
  (newValue) => {
    housingExpenses.value = realEstateStore.getHousingExpenses();
    Property.value = loanPropertyStore.getProperty();
  },
  { deep: true }
);

const nonDefaultHousingExpenseTypes = ref([
  { text: "Flood Insurance", expenseType: "HomeownersInsurance" },
  { text: "Wind Insurance", expenseType: "HomeownersInsurance" },
  { text: "Earthquake Insurance", expenseType: "HomeownersInsurance" },
  {
    text: "HOA Fees",
    expenseType: "HomeownersAssociationDuesAndCondominiumFee",
  },
  {
    text: "Condo Fees",
    expenseType: "HomeownersAssociationDuesAndCondominiumFee",
  },
  {
    text: "Master Association Fees",
    expenseType: "HomeownersAssociationDuesAndCondominiumFee",
  },
  { text: "Mortgage Insurance", expenseType: "MIPremium" },
  { text: "Other", expenseType: "Other" },
]);

const activeRows = ref({});

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

const defaultHousingExpenseTypes = computed(() => {
  let housingExpenseTypes = [
    { text: "Property Taxes", value: "RealEstateTax" },
    { text: "Hazzard Insurance", value: "HomeownersInsurance" },
    {
      text: "HOA/Condo Fees",
      value: "HomeownersAssociationDuesAndCondominiumFees",
    },
  ];

  if (Property.value && Property.value.PropertyType) {
    let PropertyFormatted = Property.value.PropertyType.replace(
      /([a-z])([A-Z])/g,
      "$1 $2"
    );
    if (
      PropertyFormatted === "Condominium" ||
      PropertyFormatted === "Townhouse" ||
      PropertyFormatted === "Co-operative"
    ) {
      housingExpenseTypes.push({
        text: "Contents Insurance",
        value: "ContentsInsurance",
      });
    }
  }

  return housingExpenseTypes.map((expenseType) => {
    const matchingExpense = housingExpenses.value.find(
      (expense) => expense.HousingExpenseType === expenseType.value
    );
    return {
      ...expenseType,
      id: matchingExpense ? matchingExpense.id : undefined,
    };
  });
});

const nonDefaultHousingExpenses = computed(() => {
  const defaultTypes = defaultHousingExpenseTypes.value.map(
    (type) => `${type.value}-${type.text}`
  );
  return housingExpenses.value.filter(
    (expense) =>
      !defaultTypes.includes(
        `${expense.HousingExpenseType}-${expense.HousingExpenseNote}`
      )
  );
});

const isNextDisabled = computed(() => {
  const activeExpenses = housingExpenses.value.filter((expense) =>
    isExpenseActive(expense.HousingExpenseType, expense.HousingExpenseNote)
  );

  const hasActiveDefaultExpense = defaultHousingExpenseTypes.value.some((expenseType) => {
    const hasActive = activeExpenses.some(
      (expense) =>
        expense.HousingExpenseType === expenseType.value &&
        expense.HousingExpenseNote === expenseType.text
    );
    return hasActive;
  });

  if (!hasActiveDefaultExpense) {
    return true;
  }

  const allActiveExpensesValid = activeExpenses.every((expense) => {
    const hasValidAmount =
      expense.HousingExpensePaymentAmount !== undefined &&
      expense.HousingExpensePaymentAmount !== null &&
      expense.HousingExpensePaymentAmount !== "" &&
      parseFloat(expense.HousingExpensePaymentAmount) > 0;

    const hasValidTerm =
      expense.HousingExpenseTerm === "Monthly" || expense.HousingExpenseTerm === "Yearly";

    return hasValidAmount && hasValidTerm;
  });

  return !allActiveExpensesValid;
});

const housingExpenseValue = (type, note) => {
  const expense = housingExpenses.value.find(
    (e) => e.HousingExpenseType === type && e.HousingExpenseNote === note
  );

  if (expense && expense.HousingExpensePaymentAmount) {
    return getFormattedValue(expense.HousingExpensePaymentAmount);
  }

  const activeRowKey = Object.keys(activeRows.value).find((key) =>
    key.startsWith(`${type}-${note}-`)
  );
  if (activeRowKey && activeRows.value[activeRowKey].value) {
    return getFormattedValue(activeRows.value[activeRowKey].value);
  }

  return "";
};

const housingExpenseTerm = (type, note) => {
  const expense = housingExpenses.value.find(
    (e) => e.HousingExpenseType === type && e.HousingExpenseNote === note
  );
  if (expense && expense.HousingExpenseTerm) {
    return expense.HousingExpenseTerm;
  }

  const activeRowKey = Object.keys(activeRows.value).find((key) =>
    key.startsWith(`${type}-${note}`)
  );
  if (activeRowKey && activeRows.value[activeRowKey].term) {
    return activeRows.value[activeRowKey].term;
  }

  return null;
};

const updateHousingExpense = (type, note, prop, value) => {
  let HousingExpenses = [...housingExpenses.value];

  let expenseIndex = HousingExpenses.findIndex(
    (item) => item.HousingExpenseType === type && item.HousingExpenseNote === note
  );

  if (expenseIndex === -1) {
    expenseIndex = HousingExpenses.length;
    HousingExpenses.push({
      HousingExpenseTimingType: "Proposed",
      HousingExpenseType: type,
      HousingExpenseNote: note,
      HousingExpenseTerm: null,
      HousingExpensePaymentAmount: null,
    });
  }

  HousingExpenses[expenseIndex][prop] = value;
  lenderInfoStore.updateMortgageLoanInfo({
    prop: "HousingExpenses",
    value: HousingExpenses,
  });

  const activeRowKey = `${type}-${note}`;
  if (!activeRows.value[activeRowKey]) {
    activeRows.value[activeRowKey] = {
      active: true,
      term: HousingExpenses[expenseIndex].HousingExpenseTerm,
      value: HousingExpenses[expenseIndex].HousingExpensePaymentAmount,
    };
  } else {
    if (prop === "HousingExpenseTerm") {
      activeRows.value[activeRowKey].term = value;
    } else if (prop === "HousingExpensePaymentAmount") {
      activeRows.value[activeRowKey].value = value;
    }
  }
};

const updateActiveRows = (HousingExpenses) => {
  activeRows.value = {};
  let counter = {};

  HousingExpenses.forEach((expense) => {
    const key = `${expense.HousingExpenseType}-${expense.HousingExpenseNote}-${expense.HousingExpensePaymentAmount}`;

    if (!counter[key]) {
      counter[key] = 0;
    }

    const expenseKey = `${key}-${counter[key]}`;
    counter[key]++;

    const isActive =
      expense.HousingExpensePaymentAmount !== 0 &&
      expense.HousingExpensePaymentAmount !== null &&
      expense.HousingExpensePaymentAmount !== "" &&
      parseFloat(expense.HousingExpensePaymentAmount) > 0;

    activeRows.value[expenseKey] = {
      active: isActive,
      term: expense.HousingExpenseTerm,
      value: expense.HousingExpensePaymentAmount,
    };
  });
};

const removeHousingExpense = (type, note) => {
  let HousingExpenses = [...housingExpenses.value];

  const expenseIndex = HousingExpenses.findIndex(
    (expense) =>
      expense.HousingExpenseType === type && expense.HousingExpenseNote === note
  );

  if (expenseIndex !== -1) {
    HousingExpenses.splice(expenseIndex, 1);

    const baseNote = note.split(" (")[0];
    const sameTypeExpenses = HousingExpenses.filter(
      (expense) =>
        expense.HousingExpenseType === type &&
        expense.HousingExpenseNote.startsWith(baseNote)
    );

    sameTypeExpenses.forEach((expense, index) => {
      if (index === 0) {
        expense.HousingExpenseNote = baseNote;
      } else {
        expense.HousingExpenseNote = `${baseNote} (${index + 1})`;
      }
    });

    lenderInfoStore.updateMortgageLoanInfo({
      prop: "HousingExpenses",
      value: HousingExpenses,
    });

    updateActiveRows(HousingExpenses);
  }
};

const getRemainingHousingExpenses = (noteText) => {
  const alwaysInclude = [
    "Mortgage Insurance",
    "Other",
    "Flood Insurance",
    "Wind Insurance",
    "Earthquake Insurance",
  ];

  const baseExpenseTypes = nonDefaultHousingExpenseTypes.value.map((x) => x.text);
  const result = nonDefaultHousingExpenseTypes.value.filter(
    (x) =>
      alwaysInclude.includes(x.text) ||
      noteText === x.text ||
      noteText.startsWith(x.text + " (") ||
      !housingExpenses.value.some(
        (y) => y.HousingExpenseNote && y.HousingExpenseNote.split(" (")[0] === x.text
      )
  );

  if (noteText && !baseExpenseTypes.includes(noteText)) {
    const baseNote = noteText.split(" (")[0];
    const matchingType = nonDefaultHousingExpenseTypes.value.find(
      (x) => x.text === baseNote
    );
    if (matchingType) {
      result.push({ ...matchingType, text: noteText });
    }
  }

  return result;
};

const getExpenseNoteDisplayValue = (housingExpense) => {
  const baseNotes = nonDefaultHousingExpenseTypes.value.map((x) => x.text);

  if (baseNotes.includes(housingExpense.HousingExpenseNote)) {
    return housingExpense.HousingExpenseNote;
  }

  const baseNote = housingExpense.HousingExpenseNote.split(" (")[0];
  const matchingType = nonDefaultHousingExpenseTypes.value.find(
    (x) => x.text === baseNote
  );

  return matchingType ? housingExpense.HousingExpenseNote : null;
};

const addHousingExpense = (newType, oldType, oldNote) => {
  let HousingExpenses = [...housingExpenses.value];

  const existingExpenses = HousingExpenses.filter((expense) =>
    expense.HousingExpenseNote.startsWith(newType)
  );

  let newNote = newType;
  if (existingExpenses.length > 0) {
    newNote = `${newType} (${existingExpenses.length + 1})`;
  }

  const newExpenseType = getExpenseTypeFromNote(newType);

  if (oldType && oldNote) {
    const existingExpenseIndex = HousingExpenses.findIndex(
      (expense) =>
        expense.HousingExpenseType === oldType && expense.HousingExpenseNote === oldNote
    );

    if (existingExpenseIndex !== -1) {
      const expense = HousingExpenses[existingExpenseIndex];
      const oldAmount = expense.HousingExpensePaymentAmount;
      const oldTerm = expense.HousingExpenseTerm;

      expense.HousingExpenseNote = newNote;
      expense.HousingExpenseType = newExpenseType;

      const oldActiveRowKey = `${oldType}-${oldNote}`;
      const newActiveRowKey = `${newExpenseType}-${newNote}`;

      if (activeRows.value[oldActiveRowKey]) {
        activeRows.value[newActiveRowKey] = {
          ...activeRows.value[oldActiveRowKey],
          value: oldAmount,
          term: oldTerm,
        };

        delete activeRows.value[oldActiveRowKey];
      }
    }
  } else {
    const newExpense = {
      HousingExpenseTimingType: "Proposed",
      HousingExpenseType: newExpenseType,
      HousingExpenseNote: newNote,
      HousingExpenseTerm: null,
      HousingExpensePaymentAmount: 0,
    };
    HousingExpenses.push(newExpense);

    const newActiveRowKey = `${newExpenseType}-${newNote}`;
    activeRows.value[newActiveRowKey] = {
      active: true,
      term: null,
      value: 0,
    };
  }

  lenderInfoStore.updateMortgageLoanInfo({
    prop: "HousingExpenses",
    value: HousingExpenses,
  });
  newItemVisible.value = false;
};

const getExpenseTypeFromNote = (note) => {
  const expenseNote = nonDefaultHousingExpenseTypes.value.find((e) => e.text === note);
  return expenseNote ? expenseNote.expenseType : null;
};

const activateExpense = (type, note, amount = 0) => {
  let expense = housingExpenses.value.find(
    (item) =>
      item.HousingExpenseType === type &&
      item.HousingExpenseNote === note &&
      (amount === null || item.HousingExpensePaymentAmount === amount)
  );

  if (!expense) {
    updateHousingExpense(type, note, "HousingExpensePaymentAmount", 0);
    updateHousingExpense(type, note, "HousingExpenseTerm", null);
  } else {
    const key = `${type}-${note}-${expense.HousingExpensePaymentAmount}`;
    const expenseKey = `${key}-0`;

    activeRows.value[expenseKey] = {
      active: true,
      term: expense.HousingExpenseTerm,
      value: expense.HousingExpensePaymentAmount,
    };
  }
};

const deactivateExpense = (type, note, amount = 0) => {
  let expenseKey = `${type}-${note}-${amount}`;
  if (isDefaultExpense(type, note)) {
    expenseKey = `${type}-${note}`;
  }

  let HousingExpenses = [...housingExpenses.value];

  const expenseIndex = HousingExpenses.findIndex(
    (item) => item.HousingExpenseType === type && item.HousingExpenseNote === note
  );

  if (expenseIndex !== -1) {
    HousingExpenses.splice(expenseIndex, 1);

    lenderInfoStore.updateMortgageLoanInfo({
      prop: "HousingExpenses",
      value: HousingExpenses,
    });
  }

  if (activeRows.value[expenseKey]) {
    if (isDefaultExpense(type, note)) {
      activeRows.value[expenseKey] = {
        active: false,
        term: null,
        value: 0,
      };
    } else {
      delete activeRows.value[expenseKey];
    }
  }
};

const isDefaultExpense = (type, note) => {
  return defaultHousingExpenseTypes.value.some(
    (defaultType) => defaultType.value === type && defaultType.text === note
  );
};

const initializeActiveRows = () => {
  activeRows.value = {};
  let counter = {};

  housingExpenses.value.forEach((expense) => {
    let key = `${expense.HousingExpenseType}-${expense.HousingExpenseNote}-${expense.HousingExpensePaymentAmount}`;
    if (isDefaultExpense(expense.HousingExpenseType, expense.HousingExpenseNote)) {
      key = `${expense.HousingExpenseType}-${expense.HousingExpenseNote}`;
    }

    if (!counter[key]) {
      counter[key] = 0;
    }

    let expenseKey = `${key}-${counter[key]}`;

    if (isDefaultExpense(expense.HousingExpenseType, expense.HousingExpenseNote)) {
      expenseKey = key;
    }
    counter[key]++;

    const isActive =
      expense.HousingExpensePaymentAmount !== 0 &&
      expense.HousingExpensePaymentAmount !== null &&
      expense.HousingExpensePaymentAmount !== "" &&
      parseFloat(expense.HousingExpensePaymentAmount) > 0;

    activeRows.value[expenseKey] = {
      active: isActive,
      term: expense.HousingExpenseTerm,
      value: expense.HousingExpensePaymentAmount,
    };
  });
};

const isExpenseActive = (type, note, amount = null) => {
  const isActive = Object.entries(activeRows.value).some(([key, value]) => {
    const [expenseType, expenseNote] = key.split("-");
    const typeMatch = expenseType === type;
    const noteMatch = expenseNote.includes(note);
    const amountMatch = amount === null || value.value === amount;
    return typeMatch && noteMatch && amountMatch && value.active;
  });
  return isActive;
};

onMounted(() => {
  initializeActiveRows();
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please list any expenses associated with the home. <br />
        Typical Expenses include Property Taxes, Homeowner Association Dues and Condo
        Fees.
      </div>
    </div>
    <div class="image-container">
      <div class="titleSecondaryText primary-text font-weight-bold mb-0">
        Please Itemize the Proposed Housing Expenses for {{ address }}
      </div>
      <div
        class="flex-grow-1 d-flex jusify-content-center align-center flex-column expensesContianer"
      >
        <v-row
          class="expenseItemRow justify-content-center px-1 mt-7"
          v-for="(expenseType, index) in defaultHousingExpenseTypes"
          :key="`${expenseType.value}-Default-${index}`"
          :class="{
            active: isExpenseActive(expenseType.value, expenseType.text),
          }"
        >
          <!-- rightBordered: $vuetify.breakpoint.smAndUp, -->
          <v-col
            sm="5"
            cols="12"
            class="d-flex align-center expenseItemHeaderRow rightBordered"
          >
            <div class="flex-grow-1 expense-text">{{ expenseType.text }}</div>
            <div class="expenseQuestionButton">
              <v-icon class="px-1 py-1" small="small">mdi-help</v-icon>
            </div>
          </v-col>
          <v-col class="d-flex align-center flex-wrap radio-input" sm="7" cols="12">
            <div
              class="flex-shrink-0 v-input--is-label-active v-input--is-dirty theme--light v-input--selection-controls monthly-radio v-input--radio-group v-input--radio-group--row"
            >
              <Radio
                :value="housingExpenseTerm(expenseType.value, expenseType.text)"
                :options="options"
                @change="
                  (e) =>
                    updateHousingExpense(
                      expenseType.value,
                      expenseType.text,
                      'HousingExpenseTerm',
                      e
                    )
                "
              ></Radio>
            </div>
            <v-col class="px-0 py-0 textbox-col">
              <TextBox
                prefix="$"
                :value="housingExpenseValue(expenseType.value, expenseType.text)"
                :smVal="0"
                @input="
                  (e) =>
                    updateHousingExpense(
                      expenseType.value,
                      expenseType.text,
                      'HousingExpensePaymentAmount',
                      +e.target.value.replace(/,/g, '')
                    )
                "
                @keypress="(e) => isOnlyNum(e, true)"
              ></TextBox>
            </v-col>
            <div v-if="isExpenseActive(expenseType.value, expenseType.text)">
              <v-icon
                class="ml-2"
                @click.stop="
                  deactivateExpense(
                    expenseType.value,
                    expenseType.text,
                    housingExpenseValue(expenseType.value, expenseType.text)
                  )
                "
              >
                mdi-close
              </v-icon>
            </div>
          </v-col>
          <v-icon class="checkCircle">mdi-check-circle</v-icon>
        </v-row>
        <v-row
          class="expenseItemRow select-radio justify-content-center px-1 mt-7 active"
          v-for="(housingExpense, index) in nonDefaultHousingExpenses"
          :key="`${housingExpense.HousingExpenseType}-${housingExpense.HousingExpenseNote}-${index}`"
          @click="
            activateExpense(
              housingExpense.HousingExpenseType,
              housingExpense.HousingExpenseNote,
              housingExpense.HousingExpensePaymentAmount
            )
          "
        >
          <v-col
            class="d-flex align-center expenseItemHeaderRow rightBordered"
            sm="5"
            cols="12"
          >
            <div class="d-flex flex-column flex-grow-1">
              <div>
                <SelectBox :items="getRemainingHousingExpenses(housingExpense.HousingExpenseNote)" :smVal="12"
                  class="py-0 px-0" itemText="text" itemValue="text" @change="(e) =>
            addHousingExpense(
              e,
              housingExpense.HousingExpenseType,
              housingExpense.HousingExpenseNote
            )
          " :value="getExpenseNoteDisplayValue(housingExpense)"></SelectBox>
              </div>
              <div v-if="housingExpense.HousingExpenseNote.startsWith('Other')">
                <TextBox :value="housingExpense.HousingExpenseTypeOtherDescription" @input="(e) =>
            updateHousingExpense(
              housingExpense.HousingExpenseType,
              housingExpense.HousingExpenseNote,
              'HousingExpenseTypeOtherDescription',
              e.target.value
            )
          " :smVal="12" class="py-0 px-0 mt-2" defaultPlaceholder="Other Description"></TextBox>
              </div>
            </div>
            <div class="expenseQuestionButton ml-2">
              <v-icon class="" small="small"> mdi-help </v-icon>
            </div>
          </v-col>
          <v-col class="d-flex align-center flex-wrap radio-input" sm="" cols="12">
            <div
              class="flex-shrink-0 v-input--is-label-active v-input--is-dirty theme--light v-input--selection-controls monthly-radio v-input--radio-group v-input--radio-group--row">
              <Radio :options="options" :value="housingExpenseTerm(
          housingExpense.HousingExpenseType,
          housingExpense.HousingExpenseNote
        )
          " @change="(e) =>
            updateHousingExpense(
              housingExpense.HousingExpenseType,
              housingExpense.HousingExpenseNote,
              'HousingExpenseTerm',
              e
            )
          "></Radio>
            </div>
            <v-col class="px-0 py-0 textbox-col">
              <TextBox prefix="$" :smVal="0" :value="housingExpenseValue(
          housingExpense.HousingExpenseType,
          housingExpense.HousingExpenseNote
        )
          " @input="(e) =>
            updateHousingExpense(
              housingExpense.HousingExpenseType,
              housingExpense.HousingExpenseNote,
              'HousingExpensePaymentAmount',
              +e.target.value.replace(/,/g, ''),
              housingExpense.id
            )
          " @keypress="(e) => isOnlyNum(e, true)"></TextBox>
            </v-col>
            <!-- <v-btn class="mr-1 px-1 py-1 flex-shrink-0" icon="icon"> -->
            <div class="delete-icon">
              <v-icon @click.stop="
          removeHousingExpense(
            housingExpense.HousingExpenseType,
            housingExpense.HousingExpenseNote
          )
          ">mdi-delete</v-icon>
            </div>
            <!-- </v-btn> -->
          </v-col>
          <v-icon class="checkCircle">mdi-check-circle</v-icon>
        </v-row>
        <div class="expenseAddNewItem d-flex justify-content-center px-3 mt-7 py-3" @click="newItemVisible = true"
          v-if="!newItemVisible">
          <div class="plusicon mr-3">
            <v-icon class="plusIcon">mdi-plus</v-icon>
          </div>
          <div class="plusText font-weight-bold">
            Please add any additional Insurances(Wind, Flood, Earthquake) items, or HOA
            Dues / Condo Fess you are expecting to pay
          </div>
        </div>
        <v-row class="expenseItemRow justify-content-start px-1 mt-7" v-if="newItemVisible">
          <div class="other-option">
            <SelectBox :smVal="8" :items="nonDefaultHousingExpenseTypes" itemText="text" itemValue="text"
              @change="addHousingExpense" :value="null"></SelectBox>
            <div class="delete-icon">
              <v-icon @click="newItemVisible = false">mdi-delete</v-icon>
            </div>
          </div>
        </v-row>
      </div>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.expensesContianer {
  width: 100%;
  max-width: 800px;
}

.expenseItemRow {
  background-color: $gray1;
  position: relative;
  border: 2px solid transparent;
  width: 100%;
  cursor: pointer;
  border-radius: 7px;
  transition: opacity 0.2s ease-in-out, border-color 0.2s ease-in-out,
    background-color 0.2s ease-in-out;

  &.active {
    border-color: $icon-color !important;
    background-color: #fff;

    .checkCircle {
      opacity: 1;
      pointer-events: all;
    }
  }

  .checkCircle {
    position: absolute;
    right: -10px;
    top: -10px;
    border-radius: 50%;
    color: $icon-color !important;
    z-index: 2;
    background-color: white;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-in-out;
  }
}

.expenseAddNewItem {
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  flex-flow: unset;
  user-select: none;
  flex-direction: row !important;

  &:hover,
  &:focus {
    background: rgba($color: #ddd, $alpha: 0.2);
  }

  &:active {
    background: rgba($color: #ddd, $alpha: 0.5);
  }
}

.expenseQuestionButton {
  border: 2px solid #bdbdbd;
  border-radius: 50%;
  color: #bdbdbd;
  font-size: 10px;
  padding: 4px;
  width: 28px;
  height: 28px;
}

:deep(.titleText) {
  max-width: 1000px !important;
  margin: 0;
}

.plusicon {
  height: 32px;
  width: 32px;
  background-color: $add-new-text-color;
  color: white;
  border-radius: 50%;
  padding: 6px;
  margin-top: 5px;
  margin-bottom: auto;
  align-items: center;
  justify-content: center;

  .plusIcon {
    font-size: 20px;
    vertical-align: unset;
  }
}

.plusText {
  color: $add-new-text-color;
}

.titleText {
  font-weight: 500;
  font-size: 26px;
  line-height: 39px;
  margin: 20px 0px;
  max-width: 800px;
  text-align: center;

  @media (max-width: $mobile-width) {
    font-size: 16px;
    line-height: 28px;
  }
}

.expenseItemHeaderRow {
  padding-left: 12px;
  padding-right: 12px;
  max-width: calc(100% - 24px);
  min-height: 66px;

  &.rightBordered {
    border-right: 1px solid $gray4;
    border-bottom: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
    margin-top: 12px;
    margin-bottom: 12px;
    padding-left: 12px;
    padding-right: 12px;
    margin-left: 0px;
    margin-right: 0px;
  }

  .expense-text {
    color: $content-black;
  }
}


.delete-icon {
  color: #757575;
  padding: 4px;
  margin-right: 4px;
  height: 36px;
  width: 36px;
}

:deep(.v-selection-control-group) {
  display: flex;
  align-items: center;
  flex-direction: row;
  column-gap: 10px;

  .v-input__details {
    display: none;
  }
  .v-selection-control{
    margin-right: 16px
  }
  .v-selection-control__wrapper{
    width: 24px;
    height: 24px;
  }
}

:deep(.v-selection-control) {
  flex: auto;
}

.other-option {
  display: flex;
  align-items: center;
  width: 54%;
}


:deep(.v-selection-control-group) {
  column-gap: 0;
}

:deep(.v-selection-control__wrapper) {
  height: auto;
  width: auto;
  margin-right: 8px;
}


.radio-input :deep(.v-input__control) {
  height: auto;
}


:deep(.v-selection-control__input) {
  height: auto;
  width: auto;
  i{
    font-size: 24px;
  }
}

.textbox-col {
  .itemContainer {
    padding-right: 0px !important;
    padding-left: 0px;
  }
}

@media (max-width: $lg-mobile-width) {
  .textbox-col {
    .itemContainer {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .expenseItemHeaderRow {
    max-width: 100%;
  }
}

@media (max-width: 416px) {
  .textbox-col {
    flex-basis: auto;
  }

  .other-option {
    width: 90%;
  }
}


</style>
