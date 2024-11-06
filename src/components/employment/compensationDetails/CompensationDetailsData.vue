<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { defineProps, onBeforeMount, ref, watch, computed } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import { debtToIncomeAndHousingRatios } from "@/mixins/debtToIncomeAndHousingRatios";
import { useRoute } from "vue-router";

const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const { setDebtToIncomeAndHousingRatios } = debtToIncomeAndHousingRatios();
const route = useRoute();

const { isOnlyNum } = number();

const props = defineProps({
  status: {
    type: String,
    default: "",
  },
  classification: {
    type: String,
    default: "",
  },
  index: {
    type: Number,
    default: -1,
  },
});

const types = ref(["Base", "Overtime", "Bonus", "Commission", "Other"]);
const willContinueToReceiveTypes = ref([
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Unsure", value: "Unsure" },
]);
const additional = ref(null);
const statusType = ref("Current");
const classificationType = ref("Primary");

const setEmploymentIncome = (prop, val, index) => {
  const Income = income.value.map((item, i) =>
    index !== i ? item : { ...item, [prop]: val }
  );
  setEmploymentProp("Income", Income);
};

const setWillContinueToReceiveType = (val, index) => {
  const Income = income.value.map((item, i) =>
    index !== i ? item : { ...item, ["WillContinueToRecieveGoingForward"]: val }
  );
  setEmploymentProp("Income", Income);
};

const setEmploymentProp = (prop, value) => {
  if (currentEmployment.value.EmploymentClassificationType === "Secondary") {
    return setAdditionalEmploymentProp(prop, value);
  } else if (
    currentEmployment.value.EmploymentClassificationType &&
    currentEmployment.value.EmploymentClassificationType !== "Secondary"
  ) {
    const employments = borrowersStore.getBorrowerEmployment().map((item) => {
      return item.EmploymentClassificationType === classificationType.value &&
        item.EmploymentStatusType === statusType.value
        ? { ...item, [prop]: value }
        : item;
    });
    return borrowersStore.updateBorrower({ prop: "Employment", value: employments });
  }
  borrowersStore.updateBorrower({
    prop: "Employment",
    value: [
      ...borrowersStore.getBorrowerEmployment(),
      {
        EmploymentStatusType: statusType.value,
        EmploymentClassificationType: classificationType.value,
        [prop]: value,
      },
    ],
  });
};

const setAdditionalEmploymentProp = (prop, val) => {
  let additional = [...employmentStore.getAdditionalEmployments()];
  additional[employmentEditingIndex.value] = {
    ...currentEmployment.value,
    [prop]: val,
  };
  const filtered = borrowersStore.getBorrowerEmployment().length
    ? borrowersStore
        .getBorrowerEmployment()
        .filter((item) => item.EmploymentClassificationType !== "Secondary")
    : [];
  borrowersStore.updateBorrower({
    prop: "Employment",
    value: [...filtered, ...additional],
  });
};

const setTypeText = (val, index) => {
  setEmploymentIncome("IncomeTypeOtherDescription", val, index);
};

const setType = (val, index) => {
  if (val !== "Other") {
    setEmploymentIncome("IncomeTypeOtherDescription", null, index);
  }
  setEmploymentIncome("IncomeType", val, index);
};

const setAmount = (val, index) => {
  setEmploymentIncome("CurrentIncomeMonthlyTotalAmount", val, index);
};

const setAdditionalType = (type) => {
  const Income = [
    ...income.value,
    {
      IncomeType: type,
      EmploymentIncomeIndicator: true,
    },
  ];
  setEmploymentProp("Income", Income);
  additional.value = null;
};

const remove = (index) => {
  const filtered = income.value.filter((item, i) => index !== i);
  setEmploymentProp("Income", filtered);
};

const addType = () => {
  additional.value = { IncomeType: "" };
};

const otherCompensationTypes = (incomeTypeOtherDescription) => {
  let compensationTypes = ["Tip Income", "Shift Differential", "Auto Allowance"];
  if (
    incomeTypeOtherDescription == null ||
    incomeTypeOtherDescription === "" ||
    compensationTypes.includes(incomeTypeOtherDescription)
  ) {
    return compensationTypes;
  }
  compensationTypes.push(incomeTypeOtherDescription);
  return compensationTypes;
};

const currentEmployment = computed(() => {
  if (classificationType.value === "Secondary") {
    return (
      employmentStore.getAdditionalEmployments()[employmentEditingIndex.value] || {
        EmploymentClassificationType: "Secondary",
      }
    );
  }
  if (borrowersStore.getBorrowerEmployment().length) {
    const employment = borrowersStore
      .getBorrowerEmployment()
      .find(
        (item) =>
          item.EmploymentClassificationType === classificationType.value &&
          item.EmploymentStatusType === statusType.value
      );
    return employment || {};
  }
  return {};
});

const employmentEditingIndex = computed(() => {
  return props.index !== -1
    ? props.index
    : employmentStore.getAdditionalEmploymentIndex();
});

const income = computed(() => {
  return currentEmployment.value.Income || [];
});

const total = computed(() => {
  return income.value.length
    ? income.value.reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
            ? +cur.CurrentIncomeMonthlyTotalAmount
            : 0),
        0
      )
    : 0;
});

const filteredTypes = computed(() => {
  const incomeTypes = income.value.map((item) => item.IncomeType);
  return types.value.filter((item) => incomeTypes.indexOf(item) === -1);
});

onBeforeMount(() => {
  const { status, classification } = route.meta;
  statusType.value = props.status || status;
  classificationType.value = props.classification || classification;
});

watch(total, (newVal) => {
  setEmploymentProp("EmploymentMonthlyIncomeAmount", newVal);
});

watch(
  () => borrowersStore.getBorrowerEmployment(),
  () => {
    setDebtToIncomeAndHousingRatios();
  },
  { deep: true }
);
</script>
<template>
  <div style="display: contents">
    <v-row
      class="form-container deleteAbleItem"
      v-for="(item, index) in income"
      :key="index"
    >
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="remove(index)" elevation="0">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <ComboBox
        :value="item.IncomeType"
        :items="filteredTypes"
        placeholder="Compensation Type"
        @change="(e) =&gt; setType(e, index)"
      />
      <ComboBox
        v-if="item.IncomeType === 'Other'"
        :value="item.IncomeTypeOtherDescription"
        :items="otherCompensationTypes(item.IncomeTypeOtherDescription)"
        placeholder="Other Compensation Type"
        @search="(e) =&gt; setTypeText(e, index)"
      />
      <v-col
        class="itemContainer"
        cols="12"
        v-if="
          item.IncomeType === 'Overtime' ||
          item.IncomeType === 'Bonus' ||
          item.IncomeType === 'Commission'
        "
      >
        <div class="mb-3 agree-title">
          Will you continue to receive this type of income going forward?
        </div>
        <AgreeToggle
          :options="willContinueToReceiveTypes"
          :value="item.WillContinueToRecieveGoingForward"
          @input="(e) =&gt; setWillContinueToReceiveType(e, index)"
        ></AgreeToggle>
      </v-col>
      <TextBox
        prefix="$"
        placeholder="Gross Monthly Income"
        :value="getFormattedValue(item.CurrentIncomeMonthlyTotalAmount)"
        @input="(e) =&gt; setAmount(+e.target.value.replace(/,/g, ''), index)"
        @keypress="(e) =&gt; isOnlyNum(e, true)"
      />
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
      />
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
          ><span class="addBtnText">Add Compensation</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12"
        >Total: ${{ getFormattedValue(total) || 0 }}</v-col
      >
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
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

.form-container.addItemBtnContainer {
  margin-top: -30px !important;
  .addItemBtn {
    max-width: unset !important;
  }
  i {
    padding: 12px !important;
    font-size: 16px !important;
  }
}
:deep(.v-btn-toggle) {
  justify-content: start !important;
  padding: 0px !important;
}
.v-btn-group--density-default.v-btn-group {
  padding: 0;
  overflow: visible;
}
.agree-title {
  color: $input-label-active-color;
  z-index: 5;
  position: relative;
}

:deep(.v-combobox--single:not(.v-combobox--selection-slot).v-text-field input) {
  padding-left: auto !important;
}
</style>
