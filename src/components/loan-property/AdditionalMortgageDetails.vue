<script setup>
import { number } from "@/mixins/onlyNum";
import { ref, watch, computed } from "vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";

const editIndex = ref(0);
const removeIndex = ref(0);
const isAdditional = ref(null);
const isDialog = ref(false);
const types = ref([
  { text: "Traditional Second Mortgage", value: "FirstLien" },
  { text: "Home Equity Line of Credit", value: "SecondLien" },
  { text: "Other", value: "Other" },
]);
const isMortgageDeleted = ref(false);
const { isOnlyNum } = number();
const loanPropertyStore = useLoanPropertyStore();
const Property = ref(loanPropertyStore.getProperty());

watch(
  () => loanPropertyStore.property,
  (newValue) => {
    Property.value = newValue;
  },
  { deep: true }
);

const setMortgageProp = (e, prop) => {
  const newMortgages = mortgages.value.map((item, index) => {
    if (index === editIndex.value) {
      item = { ...item, [prop]: e };
    }
    return item;
  });
  updateProperty(newMortgages);
};

const updateProperty = (mortgages) => {
  const property = { ...Property.value };
  if (mortgages.length) {
    property.OtherNewMortgageLoans = mortgages;
  } else {
    delete property.OtherNewMortgageLoans;
  }
  loanPropertyStore.setProperty(property);
};

const remove = () => {
  const updatedMortgages = mortgages.value.filter((item, i) => i !== removeIndex.value);
  updateProperty(updatedMortgages);
  isDialog.value = false;
  isMortgageDeleted.value = true;
};

const setIsAdditional = (bool) => {
  isAdditional.value = bool;
};

const mortgages = computed(() => {
  return Property.value && Property.value.OtherNewMortgageLoans
    ? Property.value.OtherNewMortgageLoans
    : [
        {
          FullName: "",
          LienPriorityType: "",
          InitialPrincipalAndInterestPaymentAmount: "",
          HELOCBalanceAmount: "",
          HELOCMaximumBalanceAmount: "",
        },
      ];
});

const isNextDisabled = computed(() => {
  if (isMortgageDeleted.value) {
    return false;
  }
  return (
    !mortgages.value[editIndex.value].FullName ||
    !mortgages.value[editIndex.value].LienPriorityType ||
    !mortgages.value[editIndex.value].InitialPrincipalAndInterestPaymentAmount ||
    !mortgages.value[editIndex.value].NoteAmount ||
    (mortgages.value[editIndex.value].LienPriorityType === "SecondLien" &&
      !mortgages.value[editIndex.value].HELOCMaximumBalanceAmount)
  );
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the details for this additional mortgage</div>
    </div>
    <v-form fast-fail="fast-fail" v-if="!isMortgageDeleted">
      <v-row class="form-container deleteAbleItem">
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn icon elevation="0" dense @click="isDialog = true" >
            <v-icon small="small" dense="dense"
              >mdi-close</v-icon
            >
          </v-btn>
        </v-col>
        <SelectBox
          :value="mortgages[editIndex].LienPriorityType"
          @change="(e) => setMortgageProp(e, 'LienPriorityType')"
          :items="types"
          placeholder="Lien Type"
          itemText="text"
          itemValue="value"
        />
        <TextBox
          placeholder="Creditor Name"
          :value="mortgages[editIndex].FullName"
          @input="(e) => setMortgageProp(e.target.value, 'FullName')"
        />
        <TextBox
          prefix="$"
          placeholder="Monthly Payment"
          :value="
            getFormattedValue(
              mortgages[editIndex].InitialPrincipalAndInterestPaymentAmount
            )
          "
          @input="
            (e) =>
              setMortgageProp(
                +e.target.value.replace(/,/g, ''),
                'InitialPrincipalAndInterestPaymentAmount'
              )
          "
          @keypress="(e) => isOnlyNum(e, true)"
        />
        <TextBox
          prefix="$"
          placeholder="Loan Amount to be Drawn"
          :value="getFormattedValue(mortgages[editIndex].NoteAmount)"
          @input="(e) => setMortgageProp(+e.target.value.replace(/,/g, ''), 'NoteAmount')"
          @keypress="(e) => isOnlyNum(e, true)"
        />
        <TextBox
          v-if="mortgages[editIndex].LienPriorityType === 'SecondLien'"
          prefix="$"
          placeholder="Credit Limit"
          :value="getFormattedValue(mortgages[editIndex].HELOCMaximumBalanceAmount)"
          @input="
            (e) =>
              setMortgageProp(
                +e.target.value.replace(/,/g, ''),
                'HELOCMaximumBalanceAmount'
              )
          "
          @keypress="(e) => isOnlyNum(e, true)"
        />
        <v-col class="itemContainer" cols="12" sm="6">
          <div class="titleText">Any additional mortgages?</div>
          <AgreeToggle
            :value="isAdditional"
            @input="setIsAdditional"
            class="my-4"
          ></AgreeToggle>
        </v-col>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
    </div>
    <v-dialog v-model="isDialog" max-width="400">
      <v-card>
        <v-card-title class="d-flex dialog-header-back dialog-header-text"
          >Are you sure?
        </v-card-title>
        <v-card-text class="py-5 px-5"
          >Are you sure you want to delete this item?</v-card-text
        >
        <v-divider></v-divider>
        <v-card-actions>
          <v-row class="justify-space-around mx-0 my- py-3 px-5">
            <CustomButton
              value="Yes"
              width="120px"
              customClass="button-yes"
              @onHandleClick="remove"
            ></CustomButton>
            <CustomButton
              value="No"
              width="120px"
              :isOutlined="true"
              customClass="button-no"
              @onHandleClick="isDialog = false"
            ></CustomButton>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style lang="scss" scoped>
:deep(.itemDeleteCrossContainer .v-icon) {
  font-size: 16px;
  color: $close-icon-color !important;
}
:deep(.v-card-text) {
  height: 62px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px !important;
  letter-spacing: 0;
}

:deep(.v-card .v-card-title) {
  font-size: 1.25rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.0125em !important;
  padding: 16px 24px 10px !important;
}
:deep(.v-card){
  overflow-y: hidden
}
:deep(.v-row){
  margin: 0 !important;
}
:deep(.v-card-actions){
  padding: 5px !important;
}

:deep(.v-btn-toggle) {
  justify-content: flex-start;
}
.itemDeleteCrossContainer {
  :deep(.v-btn--icon.v-btn--density-default) {
    height: 36px !important;
    width: 36px !important;
    background: transparent;
  }
}
:deep(.v-btn-group--density-default.v-btn-group) {
  gap: 20px;
}

.form-container {
  margin: -10px !important;
}
</style>
