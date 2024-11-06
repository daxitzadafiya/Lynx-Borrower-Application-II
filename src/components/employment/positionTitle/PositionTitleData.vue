<script setup>
import { computed, defineProps, onBeforeMount, ref } from "vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import moment from "moment";
import { useRoute } from "vue-router";

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
  hasIncomeLossData: {
    type: Boolean,
    default: false,
  },
});

const { isOnlyNum } = number();
const statusType = ref("Current");
const classificationType = ref("Primary");
const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const route = useRoute();

const setEmploymentProp = (prop, val) => {
  if (currentEmployment.value.EmploymentClassificationType === "Secondary") {
    return setAdditionalEmploymentProp(prop, val);
  } else if (
    currentEmployment.value.EmploymentClassificationType &&
    currentEmployment.value.EmploymentClassificationType !== "Secondary"
  ) {
    const Employment = borrowersStore.getBorrowerEmployment().map((item) => {
      if (
        item.EmploymentClassificationType === classificationType.value &&
        item.EmploymentStatusType === statusType.value
      ) {
        item[prop] = val;
      }
      return item;
    });
    borrowersStore.updateBorrower({ prop: "Employment", value: Employment });
  } else {
    borrowersStore.updateBorrower({
      prop: "Employment",
      value: [
        ...borrowersStore.getBorrowerEmployment(),
        {
          EmploymentStatusType: statusType.value,
          EmploymentClassificationType: classificationType.value,
          [prop]: val,
        },
      ],
    });
  }
};

const clearEndDate = () => {
  updateEndDate(null);
};

const clearStartDate = () => {
  updateDate(null);
};

const setAdditionalEmploymentProp = (prop, val) => {
    console.log(employmentStore.getAdditionalEmploymentIndex());
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

const setPosition = (val) => {
  setEmploymentProp("EmploymentPositionDescription", val);
};

const setYears = (val) => {
  const totalMonths = duration.value.months + +val * 12;
  setEmploymentProp("EmploymentTimeInLineOfWorkMonthsCount", totalMonths);
};

const setMonths = (val) => {
  const totalMonths = duration.value.years * 12 + +val;
  setEmploymentProp("EmploymentTimeInLineOfWorkMonthsCount", totalMonths);
};

const updateDate = (date) => {
  setEmploymentProp(
    "EmploymentStartDate",
    date == null ? null : moment(date).format("YYYY-MM-DD")
  );
};

const updateEndDate = (date) => {
  setEmploymentProp(
    "EmploymentEndDate",
    date == null ? null : moment(date).format("YYYY-MM-DD")
  );
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

const maxDate = computed(() => {
  return new Date().toISOString().slice(0, 10);
});

const duration = computed(() => {
  let years = 0;
  let months = 0;
  if (currentEmployment.value.EmploymentTimeInLineOfWorkMonthsCount) {
    months = currentEmployment.value.EmploymentTimeInLineOfWorkMonthsCount % 12;
    years = (currentEmployment.value.EmploymentTimeInLineOfWorkMonthsCount - months) / 12;
  }
  return { years, months };
});

const timeOnJob = computed(() => {
  if (currentEmployment.value.EmploymentStartDate) {
    var currenDate = moment(new Date());
    var endDate = moment(currentEmployment.value.EmploymentStartDate);
    let returnText = "";
    let yearDiff = currenDate.diff(endDate, "year");
    if (yearDiff !== 0) {
      endDate.add(yearDiff, "years");
      returnText += `${yearDiff} year${yearDiff === 1 ? "" : "s"}`;
    }
    let monthsDiff = currenDate.diff(endDate, "months");
    if (monthsDiff !== 0) {
      if (returnText !== "") {
        returnText += " and ";
      }
      returnText += `${monthsDiff} month${monthsDiff === 1 ? "" : "s"}`;
    }
    return returnText;
  }
  return "";
});

onBeforeMount(() => {
  const { status, classification } = route.meta;
  statusType.value = props.status || status;
  classificationType.value = props.classification || classification;
});
</script>

<template>
  <div style="display: contents">
    <TextBox
      placeholder="Position or Title"
      :value="currentEmployment.EmploymentPositionDescription"
      @input="(e) => setPosition(e.target.value)"
      :lgVal="statusType === 'Current' ? 4 : null"
    ></TextBox>
    <DateInput
      placeholder="Start Date"
      :lgVal="statusType === 'Current' ? 4 : null"
      @dateUpdated="updateDate"
      @dateCleared="clearStartDate"
      :value="currentEmployment.EmploymentStartDate"
      :maxDate="maxDate"
    ></DateInput>
    <TextBox
      placeholder="Time on job"
      :value="timeOnJob"
      disabled="disabled"
      v-if="statusType === 'Current'"
      hide-details="hide-details"
      :lgVal="4"
    ></TextBox>
    <DateInput
      v-if="statusType === 'Previous'"
      placeholder="End Date"
      @dateUpdated="updateEndDate"
      @dateCleared="clearEndDate"
      :value="currentEmployment.EmploymentEndDate"
      :maxDate="maxDate"
    ></DateInput>
    <template v-else>
      <v-col class="pb-0" sm="12" cols="12">
        <div class="titleText">How long have you been employed in this line of work?</div>
      </v-col>
      <TextBox
        placeholder="Line of Work Years"
        inputmode="numeric"
        pattern="[0-9]*"
        :value="duration.years"
        @input="(e) => setYears(e.target.value)"
        @keypress="isOnlyNum"
        :maskValue="'##'"
      ></TextBox>
      <TextBox
        placeholder="Line of Work Months"
        inputmode="numeric"
        pattern="[0-9]*"
        :value="duration.months"
        @input="(e) => setMonths(e.target.value)"
        @keypress="isOnlyNum"
        :maskValue="'##'"
      ></TextBox>
    </template>
    <slot></slot>
    <TextBox
      v-if="hasIncomeLossData"
      placeholder="Monthly Income or Loss"
      prefix="$"
      :value="
        currentEmployment.EmploymentMonthlyIncomeAmount
          ? getFormattedValue(currentEmployment.EmploymentMonthlyIncomeAmount)
          : ''
      "
      @input="
        (e) =>
          setEmploymentProp(
            'EmploymentMonthlyIncomeAmount',
            parseInt(e.target.value.replace(/,/g, ''))
          )"
      @keypress="(e) => isOnlyNum(e, true, true)"
    ></TextBox>
  </div>
</template>

