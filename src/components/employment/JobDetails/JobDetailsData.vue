<script setup>
import { phone } from "@/mixins/phoneFormat";
import { computed, defineProps, onBeforeMount, ref, watch } from "vue";
import { number } from "@/mixins/onlyNum";
import moment from "moment";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import { useRoute } from "vue-router";
import { googleAutoComplete } from "@/mixins/googleAutoComplete.js";
import EmploymentTypeAndPartyTransaction from "@/components/employment/summaries/EmploymentTypeAndPartyTransaction.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";

const { getFormattedPhone } = phone();
const { isOnlyNum } = number();
const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const route = useRoute();

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
    default: true,
  },
  isEmploymentTypeAndPartyTransaction: {
    type: Boolean,
    default: false,
  },
});

const countries = ref(["United States"]);
const statusType = ref("Current");
const classificationType = ref("Primary");
const { inputId, geoLocate } = googleAutoComplete(statusType.value.toLowerCase());

watch(
  () => borrowersStore.autoCompleteAddress,
  (newValue) => {
    handleAddressData(newValue.inputId, newValue.value);
  },
  { deep: true }
);

const validatePhone = (e) => {
  if (e.target.value.length === 14) {
    e.preventDefault();
    return false;
  }
  return isOnlyNum(e);
};

const clearEndDate = () => {
  updateEndDate(null);
};

const clearUpdateDate = () => {
  updateDate(null);
};

const handleAddressData = (inputId, addressData) => {
  if (inputId) {
    const Employments = [...borrowersStore.getBorrowerEmployment()];
    const updatedEmployment = { ...currentEmployment.value, ...addressData };
    if (classificationType.value !== "Secondary") {
      const primaryIndex = Employments.findIndex(
        (item) =>
          item &&
          item.EmploymentClassificationType === classificationType.value &&
          item.EmploymentStatusType === statusType.value
      );
      if (primaryIndex !== -1) {
        Employments[primaryIndex] = updatedEmployment;
      } else {
        Employments.push(updatedEmployment);
      }
      borrowersStore.updateBorrower({ prop: "Employment", value: Employments });
    } else {
      setAdditionalEmploymentProp(null, updatedEmployment);
    }
  }
};

const setEmploymentProp = (prop, val) => {
  if (prop.indexOf("Phone") !== -1) {
    val = val.replace(/[()]|-| /g, "");
  }
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

const setAdditionalEmploymentProp = (prop, val) => {
  if (prop.indexOf("Phone") !== -1) {
    val = val.replace(/[()]|-| /g, "");
  }
  let additional = [...employmentStore.getAdditionalEmployments()];
  if (!prop) {
    additional[employmentEditingIndex.value] = { ...val };
  } else {
    additional[employmentEditingIndex.value] = {
      ...currentEmployment.value,
      [prop]: val,
    };
  }
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

const updateEndDate = (date) => {
  setEmploymentProp(
    "EmploymentEndDate",
    date == null ? null : moment(date).format("YYYY-MM-DD")
  );
};

const updateDate = (date) => {
  setEmploymentProp(
    "EmploymentStartDate",
    date == null ? null : moment(date).format("YYYY-MM-DD")
  );
};

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

onBeforeMount(() => {
  const { status, classification } = route.meta;
  statusType.value = props.status || status;
  classificationType.value = props.classification || classification;
});
</script>
<template>
  <v-form class="fast-fail form-outer-container">
    <v-row class="form-container">
      <TextBox
        placeholder="Position or Title"
        :lgVal="statusType === 'Current' ? 4 : null"
        :isRequired="true"
        :value="currentEmployment.EmploymentPositionDescription"
        @input="(e) => setPosition(e.target.value)"
        hide-details="hide-details"
      ></TextBox>
      <TextBox
        :lgVal="6"
        v-if="statusType === 'Previous'"
        placeholder="Employer or Business Name"
        :isRequired="true"
        :value="currentEmployment.FullName"
        hide-details="hide-details"
        @input="(e) => setEmploymentProp('FullName', e.target.value)"
      ></TextBox>
      <DateInput
        placeholder="Start Date"
        :lgVal="statusType === 'Current' ? 4 : null"
        :isRequired="true"
        @dateUpdated="updateDate"
        @dateCleared="clearUpdateDate"
        :value="currentEmployment == null ? null : currentEmployment.EmploymentStartDate"
        :maxDate="maxDate"
      ></DateInput>
      <TextBox
        placeholder="Time on job"
        :lgVal="4"
        :value="timeOnJob"
        disabled="disabled"
        v-if="statusType === 'Current'"
        hide-details="hide-details"
      ></TextBox>
      <DateInput
        placeholder="End Date"
        v-if="statusType === 'Previous'"
        :isRequired="true"
        @dateUpdated="updateEndDate"
        @dateCleared="clearEndDate"
        :value="currentEmployment == null ? null : currentEmployment.EmploymentEndDate"
        :maxDate="maxDate"
      ></DateInput>
      <template v-else>
        <v-col class="itemContianer pb-0" sm="12" cols="8" v-if="statusType === 'Current'"
          >How long have you been employed in this line of work?</v-col
        >
        <v-col class="itemContianer pb-0" sm="12" cols="8" v-else
          >How long had you been employed in this line of work?</v-col
        >
        <TextBox
          :smVal="6"
          :mdVal="3"
          :lgVal="6"
          placeholder="Line of Work Years"
          inputmode="numeric"
          pattern="[0-9]*"
          :value="duration.years"
          @input="(e) => setYears(e.target.value)"
          @keypress="isOnlyNum"
          hide-details="hide-details"
          :maskValue="'##'"
        ></TextBox>
        <TextBox
          :smVal="6"
          :mdVal="3"
          :lgVal="6"
          placeholder="Line of Work Months"
          inputmode="numeric"
          pattern="[0-9]*"
          :value="duration.months"
          @input="(e) => setMonths(e.target.value)"
          @keypress="isOnlyNum"
          :maskValue="'##'"
        ></TextBox>
      </template>
      <TextBox
        :lgVal="6"
        v-if="statusType !== 'Previous'"
        :isRequired="true"
        placeholder="Employer or Business Name"
        :value="currentEmployment.FullName"
        hide-details="hide-details"
        @input="(e) => setEmploymentProp('FullName', e.target.value)"
      ></TextBox>
      <TextBox
        :lgVal="4"
        placeholder="Employer Phone"
        inputmode="tel"
        pattern="[0-9]*"
        :value="
          currentEmployment.PhoneNumber
            ? getFormattedPhone(currentEmployment.PhoneNumber)
            : ''
        "
        @input="(e) => setEmploymentProp('PhoneNumber', e.target.value)"
        @keypress="(e) => validatePhone(e)"
        hide-details="hide-details"
      ></TextBox>
      <TextBox
        :lgVal="2"
        placeholder="Ext"
        :value="currentEmployment.Ext || ''"
        type="number"
        hide-details="hide-details"
      ></TextBox>
      <TextBox
        :id="inputId"
        @focus="geoLocate"
        placeholder="Employer Address"
        :value="currentEmployment.AddressLineText"
        @input="(e) => setEmploymentProp('AddressLineText', e.target.value)"
        hide-details="hide-details"
      ></TextBox>
      <TextBox
        placeholder="Unit #"
        :value="currentEmployment.AddressUnitIdentifier"
        @input="(e) => setEmploymentProp('AddressUnitIdentifier', e.target.value)"
        hide-details="hide-details"
      ></TextBox>
      <TextBox
        placeholder="Zip Code"
        :value="currentEmployment.PostalCode"
        @input="
          (e) =>
            setEmploymentProp(
              'PostalCode',
              e.target.value ? e.target.value.replace(/-/g, '') : ''
            )
        "
        hide-details="hide-details"
        :maskValue="'#####-####'"
      ></TextBox>
      <TextBox
        placeholder="City"
        :value="currentEmployment.CityName"
        @input="(e) => setEmploymentProp('CityName', e.target.value)"
        hide-details="hide-details"
      ></TextBox>
      <TextBox
        placeholder="State"
        :value="currentEmployment.StateCode"
        @input="(e) => setEmploymentProp('StateCode', e.target.value)"
        hide-details="hide-details"
      ></TextBox>
      <ComboBox
        :value="currentEmployment.CountryCode"
        :items="countries"
        placeholder="Country"
        @change="(val) => setEmploymentProp('CountryCode', val)"
        hide-details="hide-details"
      ></ComboBox>
      <EmploymentTypeAndPartyTransaction
        v-if="isEmploymentTypeAndPartyTransaction"
        :status="status"
        :classification="classification"
      />
      <TextBox
        v-if="currentEmployment.EmploymentBorrowerSelfEmployedIndicator"
        :isRequired="true"
        placeholder="Monthly Income (or Loss)"
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
            )
        "
        @keypress="(e) => isOnlyNum(e, true, true)"
        hide-details="hide-details"
      ></TextBox>
      <TextBox
        v-if="!isEmploymentTypeAndPartyTransaction"
        :isRequired="true"
        placeholder="Previous Gross Monthly Income"
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
            )
        "
        @keypress="(e) => isOnlyNum(e, true, true)"
        hide-details="hide-details"
      ></TextBox>
    </v-row>
  </v-form>
</template>