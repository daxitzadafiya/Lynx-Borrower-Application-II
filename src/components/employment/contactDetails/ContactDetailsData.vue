<script setup>
import { computed, defineProps, onBeforeMount, ref, watch } from "vue";
import { number } from "@/mixins/onlyNum";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import { phone } from "@/mixins/phoneFormat";
import { googleAutoComplete } from "@/mixins/googleAutoComplete";
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
});

const countries = ref(["United States"]);
const statusType = ref("Current");
const classificationType = ref("Primary");
const { isOnlyNum } = number();
const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const { inputId, geoLocate } = googleAutoComplete(statusType.value.toLowerCase());
const { getFormattedPhone } = phone();
const route = useRoute();

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
  if (prop) {
    if (prop.indexOf("Phone") !== -1) {
      val = val.replace(/[()]|-| /g, "");
    }
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

onBeforeMount(() => {
  const { status, classification } = route.meta;
  statusType.value = props.status || status;
  classificationType.value = props.classification || classification;
});
</script>

<template>
  <div style="display: contents">
    <TextBox
      placeholder="Employer or Business Name"
      :value="currentEmployment.FullName"
      @input="(e) =&gt; setEmploymentProp('FullName', e.target.value)"
    ></TextBox>
    <TextBox
      placeholder="Employer Phone"
      inputmode="tel"
      :lgVal="4"
      pattern="[0-9]*"
      :value="
        currentEmployment.PhoneNumber
          ? getFormattedPhone(currentEmployment.PhoneNumber)
          : ''
      "
      @input="(e) =&gt; setEmploymentProp('PhoneNumber', e.target.value)"
      @keypress="(e) =&gt; validatePhone(e)"
    ></TextBox>
    <TextBox
      placeholder="Ext"
      :lgVal="2"
      :value="currentEmployment.Ext || ''"
      type="number"
    ></TextBox>
    <TextBox
      :id="inputId"
      @focus="geoLocate"
      placeholder="Employer Address"
      :value="currentEmployment.AddressLineText"
      @input="(e) =&gt; setEmploymentProp('AddressLineText', e.target.value)"
    ></TextBox>
    <TextBox
      placeholder="Unit #"
      :value="currentEmployment.AddressUnitIdentifier"
      @input="(e) =&gt; setEmploymentProp('AddressUnitIdentifier', e.target.value)"
    ></TextBox>
    <TextBox
      placeholder="Zip Code"
      :value="currentEmployment.PostalCode"
      @input="(e) =&gt; setEmploymentProp('PostalCode', e.target.value ? e.target.value.replace(/-/g,'') : '')"
      :maskValue="'#####-####'"
    ></TextBox>
    <TextBox
      placeholder="City"
      :value="currentEmployment.CityName"
      @input="(e) =&gt; setEmploymentProp('CityName', e.target.value)"
    ></TextBox>
    <TextBox
      placeholder="State"
      :value="currentEmployment.StateCode"
      @input="(e) =&gt; setEmploymentProp('StateCode', e.target.value)"
    ></TextBox>
    <ComboBox
      :value="currentEmployment.CountryCode"
      :items="countries"
      placeholder="Country"
      @change="(val) =&gt; setEmploymentProp('CountryCode', val)"
    ></ComboBox>
  </div>
</template>
<style lang="scss" scoped>
:deep(.form-container) {
  margin: -10px -10px;
}
:deep(.v-field__field) {
  align-items: center !important;
  height: 40px;
}
:deep(.v-field__input) {
  padding: 12px !important;
}
:deep(.v-select .v-theme--light),
:deep(.v-field__append-inner) {
  max-height: 40px !important;
}
:deep(.v-text-field__prefix) {
  padding-left: 12px;
}
:deep(.v-field--active.v-field--focused .v-text-field__prefix) {
  color: $black !important;
}
:deep(.v-text-field--prefixed.v-text-field .v-field__input) {
  padding: 4px !important;
}
</style>
