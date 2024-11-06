<script setup>
import { ref, defineProps, watch, computed, defineEmits, onMounted } from "vue";
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { phone } from "@/mixins/phoneFormat";
import moment from "moment";
import { number } from "@/mixins/onlyNum";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import { dependents } from "@/mixins/dependents.js";

const props = defineProps({
  currentBorrower: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const currentBorrower = ref(props.currentBorrower);
const { getFormattedPhone } = phone();
const { isOnlyNum } = number();
const { updateAges, tabToNext, updateCount } = dependents();

watch(
  () => props.currentBorrower,
  (newValue) => {
    currentBorrower.value = newValue;
    agesCount.value = borrowersStore.Borrower.Dependents?.Count;
    Ages.value = borrowersStore.Borrower.Dependents?.Ages;
  },
  { deep: true }
);

const emit = defineEmits(["edit", "updateBorrower"]);

const dataBeforeEdit = ref([]);
const AgesBeforeEdit = ref([]);
const maxDate = ref(null);
const icon = ref(null);
const agesCount = ref(0);
const Ages = ref(null);
const selectedDate = ref(null);
const emailRegex = ref(
  /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/
);
const maritalStatuses = ref(["Married", "Unmarried", "Separated"]);
const residencyStatuses = ref([
  "Non Permanent Resident Alien",
  "Permanent Resident Alien",
  "U S Citizen",
]);
const visaTypes = ref([
  {
    text: "E-1",
    value: "E-1",
  },
  {
    text: "E-2",
    value: "E-2",
  },
  {
    text: "E-3",
    value: "E-3",
  },
  {
    text: "G-1",
    value: "G-1",
  },
  {
    text: "G-2",
    value: "G-2",
  },
  {
    text: "G-3",
    value: "G-3",
  },
  {
    text: "G-4",
    value: "G-4",
  },
  {
    text: "G-5",
    value: "G-5",
  },
  {
    text: "H-1",
    value: "H-1",
  },
  {
    text: "H-1B",
    value: "H-1B",
  },
  {
    text: "L1",
    value: "L1",
  },
  {
    text: "TC",
    value: "TC",
  },
  {
    text: "TN-1",
    value: "TN-1",
  },
  {
    text: "Other",
    value: "Other",
  },
]);

onMounted(async () => {
  let image = await import("@/assets/images/borrowers/person.svg");
  icon.value = image.default;
  agesCount.value = borrowersStore.Borrower.Dependents?.Count;
  Ages.value = borrowersStore.Borrower.Dependents?.Ages;
});

const formattedBorrowerBirthDate = computed(() => {
  if (currentBorrower.value?.BorrowerBirthDate) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Date(currentBorrower.value?.BorrowerBirthDate).toLocaleDateString(
      "en-US",
      options
    );
  }
  return "";
});

const formattedMobilePhone = computed(() => {
  if (currentBorrower.value?.MobilePhoneNumber) {
    return getFormattedPhone(currentBorrower.value.MobilePhoneNumber);
  }
  return "";
});

const formattedHomePhone = computed(() => {
  if (currentBorrower.value?.HomePhoneNumber) {
    return getFormattedPhone(currentBorrower.value?.HomePhoneNumber);
  }
  return "";
});

const formattedWorkPhone = computed(() => {
  if (currentBorrower.value?.WorkPhoneNumber) {
    return getFormattedPhone(currentBorrower.value?.WorkPhoneNumber);
  }
  return "";
});

const residencyStatusText = computed(() => {
  if (currentBorrower.value?.CitizenshipResidencyType) {
    for (var i = 0; i < residencyStatuses.value.length; i++) {
      if (
        currentBorrower.value?.CitizenshipResidencyType ===
        residencyStatuses.value[i].replace(/ /g, "")
      ) {
        return residencyStatuses.value[i];
      }
    }
  }
  return null;
});

const visaType = computed(() => {
  if (currentBorrower.value?.VisaType) {
    return currentBorrower.value?.VisaType;
  }
  return "";
});

const visaExpirationDate = computed(() => {
  return currentBorrower.value?.VisaExpirationDate
  ? moment(currentBorrower.value?.VisaExpirationDate).format("MMMM DD, YYYY")
  : "";
});

const visaExpirationValue = computed(() => {
  return currentBorrower.value?.VisaExpirationDate && currentBorrower.value?.VisaExpirationDate.includes('T00:00:00') ? currentBorrower.value?.VisaExpirationDate.replace('T00:00:00','') : currentBorrower.value?.VisaExpirationDate
});

const validatePhone = (e) => {
  if (e.target.value.length === 14) {
    e.preventDefault();
    return false;
  }
  return isOnlyNum(e);
};

const updateBorrowerResidencyType = (e) => {
  if (e === "U S Citizen" || e === "Permanent Resident Alien") {
    emit("updateBorrower", {
      prop: "VisaType",
      value: "",
    });
    emit("updateBorrower", {
      prop: "VisaExpirationDate",
      value: "",
    });
  }
  emit("updateBorrower", {
    prop: "CitizenshipResidencyType",
    value: e ? e.replace(/ /g, "") : "",
  });
};

const updateVisaExpirationDate = (date) => {
  emit("updateBorrower", {
    prop: "VisaExpirationDate",
    value:
      date != null && date != "Invalid Date" ? moment(date).format("YYYY-MM-DD") : null,
  });
};

const clearExpirationDate = () => {
  updateVisaExpirationDate(null);
};

const onChange = (val) => {
  let e = parseInt(val) > 9 ? 9 : parseInt(val);
  updateCount(e);
};

const updateBorrowerDate = (date) => {
  selectedDate.value = date;
  emit("updateBorrower", {
    prop: "BorrowerBirthDate",
    value:
      date != null && date != "Invalid Date" ? moment(date).format("YYYY-MM-DD") : null,
  });
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = [
    { prop: "FirstName", value: currentBorrower.value.FirstName },
    { prop: "LastName", value: currentBorrower.value.LastName },
    { prop: "MiddleName", value: currentBorrower.value.MiddleName },
    { prop: "SuffixName", value: currentBorrower.value.SuffixName },
    {
      prop: "MobilePhoneNumber",
      value: currentBorrower.value.MobilePhoneNumber,
    },
    {
      prop: "HomePhoneNumber",
      value: currentBorrower.value.HomePhoneNumber,
    },
    {
      prop: "WorkPhoneNumber",
      value: currentBorrower.value.WorkPhoneNumber,
    },
    {
      prop: "MaritalStatusType",
      value: currentBorrower.value.MaritalStatusType,
    },
    {
      prop: "CitizenshipResidencyType",
      value: currentBorrower.value.CitizenshipResidencyType,
    },
    {
      prop: "Dependents",
      value: currentBorrower.value.Dependents
        ? JSON.parse(JSON.stringify(currentBorrower.value.Dependents))
        : null,
    },
  ];
  AgesBeforeEdit.value = currentBorrower.value.Dependents
    ? JSON.parse(JSON.stringify(currentBorrower.value.Dependents.Ages || []))
    : [];
};

const onCancelClicked = () => {
  borrowersStore.updateBorrower(dataBeforeEdit.value);
  borrowersStore.updateDependents({ prop: "Ages", value: AgesBeforeEdit.value });
};
const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const validFirstName = computed(() => {
  return currentBorrower.value?.FirstName.length != 0;
});

const validLastName = computed(() => {
  return currentBorrower.value?.LastName.length != 0;
});

const validCellPhone = computed(() => {
  return currentBorrower.value?.MobilePhoneNumber.toString().length == 10;
});

const validEmail = computed(() => {
  return emailRegex.value.test(currentBorrower.value?.Email);
});

const adultDateValidation = computed(() => {
  if (selectedDate.value == null) return false;
  const selected = selectedDate.value;
  return (
    new Date(selected.getFullYear() + 18, selected.getMonth(), selected.getDate()) >
    new Date()
  );
});

const isSubmitDisabled = computed(() => {
  return (
    !validFirstName.value ||
    !validLastName.value ||
    !validCellPhone.value ||
    !validEmail.value ||
    adultDateValidation.value
  );
});

const clearBirthDate = () => {
  updateBorrowerDate(null)
};
</script>

<template>
  <NewSummaryControl
    header="Personal Information"
    :icon="icon"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
    :submitDisabled="isSubmitDisabled"
  >
    <template v-slot:displayContent>
      <div class="summary-content-container">
        <div class="summaryItem">
          <div class="summaryTitle">First Name:</div>
          <div class="summaryValue">
            {{ currentBorrower?.FirstName }}
          </div>
        </div>
        <div
          class="summaryItem"
          v-if="currentBorrower?.SuffixName"
        >
          <div class="summaryTitle">Suffix name:</div>
          <div class="summaryValue">
            {{ currentBorrower?.SuffixName }}
          </div>
        </div>
        <div class="summaryItem">
          <div class="summaryTitle">Last Name:</div>
          <div class="summaryValue">
            {{ currentBorrower?.LastName }}
          </div>
        </div>
        <div class="summaryItem">
          <div class="summaryTitle">Email:</div>
          <div class="summaryValue">{{ currentBorrower?.Email }}</div>
        </div>
        <div class="summaryItem">
          <div class="summaryTitle">Date of Birth:</div>
          <div class="summaryValue">{{ formattedBorrowerBirthDate }}</div>
        </div>
        <div class="summaryItem">
          <div class="summaryTitle">Cell Phone:</div>
          <div class="summaryValue">{{ formattedMobilePhone }}</div>
        </div>
        <div
          class="summaryItem"
          v-if="currentBorrower?.HomePhoneNumber"
        >
          <div class="summaryTitle">Home Phone:</div>
          <div class="summaryValue">{{ formattedHomePhone }}</div>
        </div>
        <div
          class="summaryItem"
          v-if="currentBorrower?.HomePhoneNumber"
        >
          <div class="summaryTitle">Work Phone:</div>
          <div class="summaryValue">{{ formattedWorkPhone }}</div>
        </div>
        
        <div
          class="summaryItem"
          v-if="currentBorrower?.MaritalStatusType"
        >
          <div class="summaryTitle">Marital Status:</div>
          <div class="summaryValue">
            {{ currentBorrower?.MaritalStatusType }}
          </div>
        </div>
        <div class="summaryItem" v-if="residencyStatusText">
          <div class="summaryTitle text-no-wrap">Residency Status:</div>
          <div class="summaryValue">{{ residencyStatusText }}</div>
        </div>

        <div
          class="summaryItem"
          v-if="
            currentBorrower?.CitizenshipResidencyType === 'NonPermanentResidentAlien' &&
            visaType
          "
        >
          <div class="summaryTitle">Visa Type:</div>
          <div class="summaryValue">{{ visaType }}</div>
        </div>
        <div class="summaryItem" v-if="currentBorrower?.CitizenshipResidencyType === 'NonPermanentResidentAlien' &&
    visaExpirationDate
    ">
          <div class="summaryTitle">Visa Expiration Date:</div>
          <div class="summaryValue">{{ visaExpirationDate }}</div>
        </div>
        <div class="summaryItem"
          v-if="currentBorrower?.Dependents && currentBorrower?.Dependents.Count">
          <div class="summaryTitle">Dependents:</div>
          <div class="summaryValue">
            {{ currentBorrower?.Dependents.Count }}
          </div>
        </div>
      </div>
    </template>
    <template v-slot:editContent>
      <v-form fast-fail>
        <v-row class="form-container">
          <TextBox
            :mdVal="0"
            :smVal="0"
            placeholder="First Name"
            :value="currentBorrower?.FirstName"
            :isRequired="true"
            @input="
              (e) => emit('updateBorrower', { prop: 'FirstName', value: e.target.value })"
          ></TextBox>
          <TextBox
            
            :mdVal="0"
            :smVal="0"
            placeholder="Last Name"
            :value="currentBorrower?.LastName"
            @input="
              (e) => emit('updateBorrower', { prop: 'LastName', value: e.target.value })"
            :isRequired="true"
          ></TextBox>
          <TextBox
            :mdVal="0"
            :smVal="0"
            placeholder="Middle Name"
            :value="currentBorrower?.MiddleName"
            @input="
              (e) => emit('updateBorrower', { prop: 'MiddleName', value: e.target.value })"
          ></TextBox>
          <TextBox
            :mdVal="0"
            :smVal="0"
            placeholder="Suffix"
            :value="currentBorrower?.SuffixName"
            @input="
              (e) => emit('updateBorrower', { prop: 'SuffixName', value: e.target.value })"
          ></TextBox>
          <TextBox
            :mdVal="0"
            :smVal="0"
            placeholder="Email"
            :isEmail="true"
            :value="currentBorrower?.Email"
            @input="
              (e) => emit('updateBorrower', { prop: 'Email', value: e.target.value })"
            :isRequired="true"
          ></TextBox>
          <DateInput
            :mdVal="0"
            :smVal="0"
            :placeholder="'Date of Birth'"
            @dateUpdated="updateBorrowerDate"
            @dateCleared="clearBirthDate"
            :value="currentBorrower == null ? null : currentBorrower?.BorrowerBirthDate"
            :maxDate="maxDate"
            :isRequired="true"
          ></DateInput>
          <TextBox
            :mdVal="0"
            :smVal="0"
            placeholder="Cell Phone"
            isRequired
            inputmode="tel"
            pattern="[0-9]*"
            :value="formattedMobilePhone"
            hint="Example (999)999-9999"
            @keypress="(e) => validatePhone(e)"
            @input="
              (e) =>
                emit('updateBorrower', {
                  prop: 'MobilePhoneNumber',
                  value: e.target.value,
                })"
          ></TextBox>
          <TextBox
            :mdVal="0"
            :smVal="0"
            placeholder="Home Phone"
            inputmode="tel"
            pattern="[0-9]*"
            :value="formattedHomePhone"
            hint="Example (999)999-9999"
            @keypress="(e) => validatePhone(e)"
            @input="
              (e) =>
                emit('updateBorrower', {
                  prop: 'HomePhoneNumber',
                  value: e.target.value,
                })"
          ></TextBox>
          <TextBox
            :mdVal="0"
            :smVal="0"
            placeholder="Work Phone"
            inputmode="tel"
            pattern="[0-9]*"
            :value="formattedWorkPhone"
            hint="Example (999)999-9999"
            @keypress="(e) => validatePhone(e)"
            @input="
              (e) =>
                emit('updateBorrower', {
                  prop: 'WorkPhoneNumber',
                  value: e.target.value,
                })"
          ></TextBox>
          <SelectBox
            appendIcon="mdi-chevron-down"
            :mdVal="0"
            :smVal="0"
            placeholder="Marital Status"
            :value="currentBorrower?.MaritalStatusType"
            :items="maritalStatuses"
            itemText="text"
            itemValue="value"
            isRequired
            @change="
              (e) => emit('updateBorrower', { prop: 'MaritalStatusType', value: e })"
          />
          <SelectBox
            appendIcon="mdi-chevron-down"
            :mdVal="0"
            :smVal="0"
            placeholder="Residency Status"
            :items="residencyStatuses"
            itemText="text"
            itemValue="value"
            isRequired
            :value="
              currentBorrower?.CitizenshipResidencyType
                ? currentBorrower?.CitizenshipResidencyType.replace(
                    /([a-z])([A-Z])/g,
                    '$1 $2'
                  )
                : '' "
            @change="updateBorrowerResidencyType"
          />
          
          <SelectBox
            v-if="currentBorrower?.CitizenshipResidencyType ==='NonPermanentResidentAlien'"
            placeholder="Visa Type"
            :items="visaTypes"
            itemText="text"
            itemValue="value"
            :value="currentBorrower?.VisaType ? currentBorrower?.VisaType : ''"
            @change="(e) => emit('updateBorrower', { prop: 'VisaType', value: e })"
            isRequired
            :mdVal="0"
            :smVal="0"
          />
          <DateInput
            v-if="
              currentBorrower?.CitizenshipResidencyType === 'NonPermanentResidentAlien'"
            :mdVal="0"
            :smVal="0"
            :placeholder="'Visa Expiration Date'"
            @dateUpdated="updateVisaExpirationDate"
            @dateCleared="clearExpirationDate"
            :value="visaExpirationValue"
            :maxDate="maxDate"
            :isRequired="true"
          ></DateInput>
          <TextBox
            :mdVal="0"
            :smVal="0"
            placeholder="Dependents"
            @onChange="onChange"
            :value="agesCount || ''"
            pattern="[0-9]*"
            :maxNum="9"
            @keypress="(e) => isOnlyNum(e)"
            hint="Max - 9"
            inputmode="numeric"
            maxLength="1"
            @keyup="tabToNext"
          ></TextBox>
          <div class="textBox-main-Wrapper  dependentsContainer p-0" v-if="agesCount">
            <div class="titleText dependents-ages-title">Dependents Ages</div>
              <div class="textBox-wrapper d-flex ga-5 flex-wrap">
                <TextBox
                  v-for="(age, i) in agesCount"
                  :key="i"
                  :smVal="2"
                  class="ageInput"
                  inputmode="numeric"
                  :value="Ages ? Ages[i] : ''"
                  @input="(e) => updateAges(e.target.value, i)"
                  @keypress="(e) => isOnlyNum(e)"
                  :tabIndexValue="i + 1"
                  :autoFocus="i === 0"
                  :maximumLength="2"
                  @keyup="tabToNext"
                ></TextBox>
              </div>
          </div>
        </v-row>
      </v-form>
    </template>
  </NewSummaryControl>
</template>

<style lang="scss" scoped>
.ages-col {
  padding-top: 0;
  flex-wrap: wrap !important;
  @media (max-width: 450px) {
    padding-right: 5px;
  }

  .v-text-field {
    padding-top: 0;
  }
}
.calendar {
  margin-left: 0px;
}
.ages-col {
  gap: 10px
}
.truncate{
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width:$lg-mobile-width) {
  .truncate {
    width: 100%
  }
}

.titleText {
  padding: 0px 30px;
}
.ageInput {
  :deep(.v-input__slot) {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  :deep(input) {
    text-align: start;
  }
}
:deep(.header){
  padding: 12px 16px !important;
  @media(max-width:$tablet-width){
    padding: 30px 20px !important; 
  }
  @media(max-width:$mobile-width){
    padding: 30px 10px !important; 
  }
}
.summaryTitle{
  flex-shrink: 0;
}

:deep(.summaryCardViewMode) {
  padding: 0 !important;

  .summary-content-container {
    padding-left: 0 !important;
    margin: 0 !important;
    column-gap: 24px;
    row-gap: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    @media (max-width:$lg-desktop-width) {
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
:deep(.textBox-main-Wrapper.dependentsContainer){
  width: calc(50% - 12px);
  .textBox-wrapper{
    .itemContainer{
      max-width: calc(16.66% - 17px) !important;
      @media (max-width: $mobile-width) {
                max-width: 100% !important;
            }
      .titleText{
        display: none !important;
      }
      
    }
  }
  @media (max-width: $xl-desktop-width) {
    width: 100%;      
  }
}
</style>
