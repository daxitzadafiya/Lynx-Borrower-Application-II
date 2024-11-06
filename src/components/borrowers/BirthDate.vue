<script setup>
import moment from "moment";
import { computed, defineProps, defineEmits, watch, ref, onMounted } from "vue";

const props = defineProps({
  currentBorrower: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["updateBorrower"]);

const currentBorrower = ref(props.currentBorrower);
const maxDate = ref(null);
const selectedDate = ref(null);

watch(
  () => props.currentBorrower,
  (newValue) => {
    currentBorrower.value = newValue;
  },
  { deep: true }
);
onMounted(() => {
  var date = new Date();
  maxDate.value = new Date(date.setFullYear(date.getFullYear() - 18))
    .toISOString()
    .slice(0, 10);
});

const adultDateValidation = computed(() => {
  if (selectedDate.value == null) return false;
  const selected = selectedDate.value;
  return (
    new Date(selected.getFullYear() + 18, selected.getMonth(), selected.getDate() ) >
    new Date()
  );
});

const updateBorrowerDate = (date) => {
  selectedDate.value = date;
  emit("updateBorrower", {
    prop: "BorrowerBirthDate",
    value: date != null && date != 'Invalid Date'  ? moment(date).format("YYYY-MM-DD") : null,
  });
};

const clearBirthDate = (e) => {
  updateBorrowerDate(null);
};
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">What is your Date of Birth?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
          <DateInput
            placeholder="Date of Birth"
            @dateUpdated="updateBorrowerDate"
            @dateCleared="clearBirthDate"
            :value="currentBorrower == null ? null : currentBorrower.BorrowerBirthDate"
            :maxDate="maxDate"
            appendIcon="mdi-calendar-blank-outline"
          >
            <p class="mt-2 red--text" v-if="adultDateValidation">
              You must be at least 18 years of age to proceed with a loan application.
            </p>
          </DateInput>
      </v-row>
      <div class="navigation-container">
        <NavigationButtons :ConditionsMet="adultDateValidation"></NavigationButtons>
      </div>
    </v-form>
  </div>
</template>