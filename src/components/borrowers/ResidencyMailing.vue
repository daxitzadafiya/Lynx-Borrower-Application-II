<script setup>
import AddressEditor from "@/components/core-components/AddressEditor.vue";
import AgreeToggle from "@/components/core-components/AgreeToggle.vue";
import { computed, onMounted, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore.js";

const borrowersStore = useBorrowersStore();
const isMailingAddressSame = ref(null);
const residenceType = ref("Mailing");
const copiedMailingResidence = ref(null);
const mailingKeys = ref([
  "AddressLineText",
  "CityName",
  "CountryCode",
  "PostalCode",
  "StateCode",
]);
const showAddressEditor = ref(false);

const removeMailing = () => {
  borrowersStore.removeResidence("Mailing")
};

const updateMailingAddress = (addressData) => {
  borrowersStore.updateResidence({
    type: residenceType.value,
    value: addressData,
  });
  copiedMailingResidence.value = addressData;
  if (isMailingResidencySameAsCurrent.value) {
    removeMailing();
    updateCurrentAddressProp({
      prop: "IsMailingAddress",
      value: true,
    });
  } else {
    updateCurrentAddressProp({
      prop: "IsMailingAddress",
      value: null,
    });
  }
};

const isNextButtonDisabled = computed(() => {
  if(isMailingAddressSame.value){
    return (!isMailingAddressSame.value && !copiedMailingResidence.value);
  }else{
    return false
  }
});

const mailingResidence = computed(() => {
  return borrowersStore.getSpecificResidence(residenceType.value);
});
const currentResidence = computed(() => {
  return borrowersStore.getSpecificResidence("Current");
});

const isMailingResidencySameAsCurrent = computed(() => {
  if (!mailingResidence.value || !!currentResidence.value) {
    return false;
  }
  for (let i = 0; i < mailingKeys.value.length; i++) {
    const key = mailingKeys.value[i];
    if (mailingResidence.value[key] !== currentResidence.value[key]) {
      return false;
    }
  }
  return true;
});

const address = computed(() => {
  const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
  if (currentResidence.value) {
    return keys.reduce((acc, cur) => {
      if (currentResidence.value[cur]) {
        acc += `${currentResidence.value[cur]}${cur === "PostalCode" ? " " : ", "}`;
      }
      return acc;
    }, "");
  }
  return "";
});

const updateCurrentAddressProp = ({ prop, value }) => {
  borrowersStore.updateResidenceProp({
    type: "Current",
    value: value,
    prop: prop,
  });
};

const updateMailingAddressProp = ({ prop, value }) => {
  borrowersStore.updateResidenceProp({
    type: residenceType.value,
    value: value,
    prop: prop,
  });
};

const setMailingAddress = (val) => {
  isMailingAddressSame.value = val;
  showAddressEditor.value = !val;
  if (val) {
    removeMailing();
    updateCurrentAddressProp({ prop: "IsMailingAddress", value: val });
  } else {
    updateCurrentAddressProp({
      prop: "IsMailingAddress",
      value: null,
    });
    borrowersStore.setInitialMailingResidence()
  }
};
onMounted(() => {
  if (currentResidence.value.IsMailingAddress) {
    setMailingAddress(true);
  } else if (currentResidence.value.IsMailingAddress === false) {
    setMailingAddress(false);
  } else {
    setMailingAddress(null);
  }
});
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Is this your current mailing address?</div>
    </div>
    <div class="residence-content">
      <div class="primary-text text-subtitle-1 font-weight-bold text-center">
        {{ address }}
      </div>
      <AgreeToggle class="my-5" @input="setMailingAddress" :value="isMailingAddressSame ? true : false"></AgreeToggle>
      <v-form fast-fail="fast-fail">
        <v-row class="form-container pa-0">
          <AddressEditor
            v-if="showAddressEditor"
            mainAddressInputText="Current Mailing Address"
            :addressObj="
              copiedMailingResidence === null ? mailingResidence : copiedMailingResidence
            "
            @addressUpdated="updateMailingAddress"
            @addressPropUpdated="updateMailingAddressProp"
            uniqueInputId="residency-mailing-address"
          >
          </AddressEditor>
        </v-row>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextButtonDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-container {
  :deep(.form-container) {
    justify-content: center !important;
  }
  .residence-content{
    padding: 30px;
  }
  @media (max-width:475px) {
    .residence-content{
        padding: 30px 10px;
    }
  }
}
</style>
