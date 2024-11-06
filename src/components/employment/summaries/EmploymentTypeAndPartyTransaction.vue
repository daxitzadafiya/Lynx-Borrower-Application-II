<script setup>
import { computed, defineProps, defineEmits, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import { loanPatch } from "@/mixins/loanPatch";

const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const { saveAndAdvance } = loanPatch();

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

// const emit = defineEmits(["saveAndRedirect"]);

const options = ref([
  {
    label: "No",
    value: false,
  },
  {
    label: "Yes",
    value: true,
  },
]);

const percentages = ref([
  "My Ownership Share is < 25%",
  "My Ownership Share is 25% or Greater",
]);

const setEmploymentProp = (prop, val) => {
  if (currentEmployment.value.EmploymentClassificationType === "Secondary") {
    return setAdditionalEmploymentProp(prop, val);
  } else if (
    currentEmployment.value.EmploymentClassificationType &&
    currentEmployment.value.EmploymentClassificationType !== "Secondary"
  ) {
    const Employment = borrowersStore.getBorrowerEmployment().map((item) => {
      if (
        item.EmploymentClassificationType === props.classification &&
        item.EmploymentStatusType === props.status
      ) {
        item[prop] = val;
      }
      if (prop === "EmploymentBorrowerSelfEmployedIndicator" && !val) {
        delete item.OwnershipInterestType;
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
          EmploymentStatusType: props.status,
          EmploymentClassificationType: props.classification,
          [prop]: val,
        },
      ],
    });
  }
};

const setPercentage = (val) => {
  if (!val) return;
  percentage.value = val
  const interest =
    percentage.value === "My Ownership Share is 25% or Greater"
      ? "GreaterThanOrEqualTo25Percent"
      : "LessThan25Percent";
  setEmploymentProp("OwnershipInterestType", interest);
};

const setAdditionalEmploymentProp = (prop, val) => {
  let additional = [...employmentStore.getAdditionalEmployments()];
  let updated = { ...currentEmployment.value, [prop]: val };
  if (prop === "EmploymentBorrowerSelfEmployedIndicator" && !val) {
    delete additional[employmentEditingIndex.value].OwnershipInterestType;
  }
  additional[employmentEditingIndex.value] = updated;
  const filtered = borrowersStore.getBorrowerEmployment().length
    ? borrowersStore
        .getBorrowerEmployment()
        .filter((item) => item.EmploymentClassificationType !== "Secondary")
    : [];
  borrowersStore.updateBorrower({
    prop: "Employment",
    value: [...filtered, ...additional],
  });
  // emit("saveAndRedirect", {
  //   route: `/employmentandincome/additional-position-title`,
  // });
  saveAndAdvance(true,`/employmentandincome/additional-position-title`)
};
const currentEmployment = computed(() => {
  if (props.classification === "Secondary") {
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
          item.EmploymentClassificationType === props.classification &&
          item.EmploymentStatusType === props.status
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

const percentage = computed(() => {
  if (currentEmployment.value.OwnershipInterestType == undefined) return "";
  return currentEmployment.value.OwnershipInterestType === "GreaterThanOrEqualTo25Percent"
    ? "My Ownership Share is 25% or Greater"
    : "My Ownership Share is < 25%";
});
</script>
<template>
  <div style="display: contents">
    <v-col class="itemContainer" sm="6" cols="12">
      <Radio
        class="mt-5 pt-2"
        :value="currentEmployment.EmploymentBorrowerSelfEmployedIndicator || false"
        @change="
          (val) => setEmploymentProp('EmploymentBorrowerSelfEmployedIndicator', val)
        "
        label="Business Owner or Self-Employed"
        :options="options"
      >
      </Radio>
    </v-col>

    <ComboBox
      v-if="currentEmployment.EmploymentBorrowerSelfEmployedIndicator"
      :isRequired="true"
      :lgVal="6"
      hide-details
      :value="percentage"
      @change="(val) => setPercentage(val)"
      :items="percentages"
      placeholder="Ownership percentage"
    />

    <v-col
      class="itemContainer"
      sm="12"
      cols="12"
      v-if="!currentEmployment.EmploymentBorrowerSelfEmployedIndicator"
    >
      <Radio
        label="I am employed by a family member."
        :value="currentEmployment.EmployedByFamilyMember"
        @change="(val) => setEmploymentProp('EmployedByFamilyMember', val)"
        :options="options"
        class="radio"
      ></Radio>

      <Radio
        label="I am employed by the property seller, real estate agent or other party to the transaction."
        :value="currentEmployment.EmployedByPartyToTransaction"
        @change="(val) => setEmploymentProp('EmployedByPartyToTransaction', val)"
        :options="options"
        class="radio"
      ></Radio>
    </v-col>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-radio-group) {
  .v-label{
    font-size: 16px !important;
      color: $text-black !important;
      opacity: 1 !important;
      margin-inline-start: 0px !important;
      text-wrap: wrap !important;
      letter-spacing: normal;
      line-height: 20px;
  }
  .v-selection-control-group {
    .v-label {
      font-size: 14px !important;
      color: $text-black !important;
      opacity: 1 !important;
      margin-inline-start: 0px !important;
      text-wrap: nowrap !important;
    }
  }
  .v-input__control,
  .v-selection-control-group {
    flex-direction: row !important;
    justify-content: space-between !important;
    max-height: unset;
    margin-top: 0px !important;
    font-size: 16px !important;
    i{
      font-size: 24px;
    }
  }
}
:deep(.options) {
  .v-label {
    font-size: 14px !important;
  }
}
</style>
