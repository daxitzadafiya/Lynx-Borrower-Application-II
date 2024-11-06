<script setup>
import moment from "moment";
import { ref, defineEmits, computed, defineProps, watch } from "vue";

const statuses = ref([
  {
    text: "Non Permanent Resident",
    value: "NonPermanentResidentAlien",
  },
  {
    text: "Permanent Resident Card Holder",
    value: "PermanentResidentAlien",
  },
  {
    text: "US Citizen",
    value: "USCitizen",
  },
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
const props = defineProps({
  currentBorrower: {
    type: Object,
    default: () => {},
  },
});
const currentBorrower = ref(props.currentBorrower);
watch(
  () => props.currentBorrower,
  (newValue) => {
    currentBorrower.value = newValue;
  },
  { deep: true }
);

const emit = defineEmits(["updateBorrower"]);
const updateBorrower = (event, data) => {
  if (data.prop == "VisaTypeOtherDescription") {
    emit("updateBorrower", { ...data, value: event.target.value });
  } else {
    emit("updateBorrower", { ...data, value: event });
  }
};

const CitizenshipResidencyType = computed(() => {
  if (currentBorrower.value) {
    if (!currentBorrower.value?.CitizenshipResidencyType) {
      emit("updateBorrower", {
        prop: "CitizenshipResidencyType",
        value: "USCitizen",
      });
    }
  }
  return currentBorrower.value?.CitizenshipResidencyType;
});

const isVisa = computed(() => {
  return (
    currentBorrower.value?.CitizenshipResidencyType &&
    currentBorrower.value?.CitizenshipResidencyType !== "USCitizen" &&
    currentBorrower.value?.CitizenshipResidencyType !== "PermanentResidentAlien"
  );
});

const isVisaTypeOther = computed(() => {
  return (
    currentBorrower.value?.CitizenshipResidencyType &&
    currentBorrower.value?.CitizenshipResidencyType === "NonPermanentResidentAlien" &&
    currentBorrower.value?.VisaType === "Other"
  );
});

const isNextDisabled = computed(() => {
  return (
    currentBorrower.value?.CitizenshipResidencyType === "NonPermanentResidentAlien" &&
    currentBorrower.value.VisaExpirationDate == null
  );
});

const clearExpirationDate = () => {
  updateVisaExpirationDate(null);
};

const updateVisaExpirationDate = (date) => {
  emit("updateBorrower", {
    prop: "VisaExpirationDate",
    value: date != null && date != 'Invalid Date' ? moment(date).format("YYYY-MM-DD") : null,
  });
};

const VisaExpirationDate = computed(()=>{
  return (currentBorrower == null ? new Date(): currentBorrower.value?.VisaExpirationDate)
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please select your Citizenship Status</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
          <SelectBox
            placeholder="Citizenship Status"
            :items="statuses"
            itemText="text"
            itemValue="value"
            :value="CitizenshipResidencyType"
            @change="updateBorrower($event, { prop: 'CitizenshipResidencyType' })"
          />
          <SelectBox
            placeholder="Visa Type"
            :items="visaTypes"
            :itemText="'text'"
            :itemValue="'value'"
            v-if="isVisa"
            :value="currentBorrower.VisaType"
            @change="updateBorrower($event, { prop: 'VisaType' })"
          />

          <TextBox
            v-if="isVisaTypeOther"
            @input="updateBorrower($event, { prop: 'VisaTypeOtherDescription' })"
            placeholder="Other Description"
            :value="currentBorrower.VisaTypeOtherDescription"
          />
          <DateInput
            v-if="isVisa"
            placeholder="Visa Expiration Date"
            @dateUpdated="updateVisaExpirationDate"
            @dateCleared="clearExpirationDate"
            isRequired
            :value="VisaExpirationDate"
          ></DateInput>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-select .v-field__input){
  
}
</style>