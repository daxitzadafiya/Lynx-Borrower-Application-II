<script setup>
import AgreeToggle from "@/components/core-components/AgreeToggle.vue";
import { computed, ref, defineEmits, defineProps, watch } from "vue";
import { useUsStatesStore } from "@/stores/usStatesStore.js";
const props = defineProps({
  currentBorrower: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const { usStates } = useUsStatesStore();
const states = computed(() => {
  return usStates.data?.Data;
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

const types = ref([
  { text: "Civil Union", value: "CivilUnion" },
  { text: "Domestic Partnership", value: "DomesticPartnership" },
  {
    text: "Registered Reciprocal Beneficiary Relationship",
    value: "RegisteredReciprocalBeneficiaryRelationship",
  },
  { text: "Other", value: "Other" },
]);
const unmarriedAddendum = computed(() => {
  return currentBorrower.value?.UnmarriedAddendum || {};
});

const isNextDisabled = computed(() => {
  return (
    unmarriedAddendum.value.DomesticRelationshipIndicator &&
    (currentBorrower.value?.UnmarriedAddendum.DomesticRelationshipType == null ||
      currentBorrower.value?.UnmarriedAddendum.DomesticRelationshipStateCode == null)
  );
});

const setRelationshipIndicator = (bool) => {
  let updated = {
    ...unmarriedAddendum.value,
    DomesticRelationshipIndicator: bool,
  };
  emit("updateBorrower", {
    prop: "UnmarriedAddendum",
    value: updated,
  });
};

const setAddendumProp = (prop, value) => {
  let updated = { ...unmarriedAddendum.value, [prop]: value };
  if (prop === "DomesticRelationshipType" && value !== "Other") {
    delete updated.DomesticRelationshipTypeOtherDescription;
  }
  emit("updateBorrower", {
    prop: "UnmarriedAddendum",
    value: updated,
  });
};
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Is there a person who is not your legal spouse but who currently has real property
        rights similar to those of a legal spouse?
      </div>
    </div>
    <v-form>
      <v-row class="form-container" justify="center">
        <v-col cols="12">
          <AgreeToggle
            @input="setRelationshipIndicator"
            :value="unmarriedAddendum.DomesticRelationshipIndicator || false"
          ></AgreeToggle>
        </v-col>
        <br />
        <template v-if="unmarriedAddendum.DomesticRelationshipIndicator">
                <SelectBox
                  :smVal="6"
                  placeholder="Type of Relationship"
                  :items="types"
                  itemText="text"
                  itemValue="value"
                  :value="unmarriedAddendum.DomesticRelationshipType || ''"
                  @change="(value) => setAddendumProp('DomesticRelationshipType', value)"
                  isRequired
                />
                <TextBox
                  :smVal="6"
                  placeholder="Other Explain"
                  @input="
                    (e) => setAddendumProp('DomesticRelationshipTypeOtherDescription', e.target.value)
                  "
                  :value="unmarriedAddendum.DomesticRelationshipTypeOtherDescription"
                  v-if="unmarriedAddendum.DomesticRelationshipType === 'Other'"
                />
                <SelectBox
                  :smVal="6"
                  placeholder="State"
                  :items="states"
                  itemText="Name"
                  itemValue="PostalAbbreviation"
                  :value="unmarriedAddendum.DomesticRelationshipStateCode"
                  @change="
                    (value) => setAddendumProp('DomesticRelationshipStateCode', value)
                  "
                  isRequired
                />
        </template>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: $desktop-width) {
  .borrowers__title {
    max-width: 80%;
  }
}

.text-block {
  &__radios {
    padding-left: 10px;

    @media (max-width: $tablet-width) {
      padding-left: 0;
    }
  }
}
</style>
