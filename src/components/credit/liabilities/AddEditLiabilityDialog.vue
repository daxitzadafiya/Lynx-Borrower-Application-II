<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useCreditStore } from "@/stores/creditStore";
import { useGeneralStore } from "@/stores/generalStore";
import { number } from "@/mixins/onlyNum";
import { liability } from "@/mixins/liability";
import { useBorrowersStore } from "@/stores/borrowersStore";

const creditStore = useCreditStore();
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const {
  liabilitiesOwnershipTypes,
  liabilitiesAccountTypes,
  disputeReasons,
} = liability();
const form = ref(null);
const { isOnlyNum } = number();
const Liability = ref({
  FullName: "",
  OwnershipType: "",
  LiabilityAccountIdentifier: "",
  LiabilityUnpaidBalanceAmount: "",
  LiabilityRemainingTermMonthsCount: "",
  LiabilityAccountType: "",
  LiabilityPayoffStatusIndicator: false,
  LiabilityExclusionIndicator: false,
  LiabilityResubordinatedIndicator: false,
  LiabilityDisputeIndicator: false,
  ManualEntry: true,
  LiabilityMonthlyPaymentAmount: null,
});

const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    if (!!creditStore.editingLiability) {
      liabilities.value[creditStore.editingLiabilityIndex] = Liability.value;
      creditStore.setEditingLiability(null);
    } else {
      liabilities.value.push(Liability.value);
    }
    borrowersStore.updateBorrower({ prop: "Liabilities", value: liabilities.value });
    creditStore.onToggle(false);
    generalStore.toggleIsOnlay({ isOnlay: false, onlayComponent: "" });
    setInitialLiability();
  }
};

const setInitialLiability = () => {
  Liability.value = {
    FullName: "",
    OwnershipType: "",
    LiabilityAccountIdentifier: "",
    LiabilityUnpaidBalanceAmount: "",
    LiabilityRemainingTermMonthsCount: "",
    LiabilityAccountType: "",
    LiabilityPayoffStatusIndicator: false,
    LiabilityExclusionIndicator: false,
    LiabilityResubordinatedIndicator: false,
    LiabilityDisputeIndicator: false,
    ManualEntry: true,
    LiabilityMonthlyPaymentAmount: null,
  };
};

const liabilities = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Liabilities
    ? borrowersStore.Borrower.Liabilities
    : [];
});

const isShowModal = computed(() => {
  return creditStore.isVisible;
});

const onHandleClose = () => {
  creditStore.onToggle(false);
  generalStore.toggleIsOnlay({
    isOnlay: false,
  });
  if (!!creditStore.editingLiability) {
    creditStore.setEditingLiability(null);
  }
  setInitialLiability();
};

const isModelVisible = computed({
  get: () => isShowModal.value && generalStore.onlayComponent == "addOrEditLiability",
  set: (val) => {
    creditStore.isModalVisible = val;
  },
});
watch(
  () => Liability.value.LiabilityPayoffStatusIndicator,
  (e) => {
    if (Liability.value.LiabilityPayoffAtClosingStatusIndicator && e) {
      Liability.value.LiabilityPayoffAtClosingStatusIndicator = false;
    }
  },
  { deep: true }
);

watch(
  () => Liability.value.LiabilityPayoffAtClosingStatusIndicator,
  (e) => {
    if (Liability.value.LiabilityPayoffStatusIndicator && e) {
      Liability.value.LiabilityPayoffStatusIndicator = false;
    }
  },
  { deep: true }
);

watch(
  () => creditStore.editingLiability,
  (newValue) => {
    Liability.value = { ...newValue };
  }
);
</script>
<template>
  <v-dialog v-model="isModelVisible" activator="parent" max-width="720" persistent>
    <template v-slot:default="{}">
      <v-card light>
        <v-card-title class="dialog-header-back dialog-header-text">
          <span class="">{{
            !!creditStore.editingLiability ? "Credit Liability" : "Add Liability"
          }}</span>
          <v-btn class="close-btn" icon="icon" elevation="0" @click="onHandleClose()">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-black--text card-content">
          <h3 class="infoText">
            Please select the reasons you are disputing this liability and provide any
            relevant explanations.
          </h3>
          <br />
          <v-form ref="form" lazy-validation="lazy-validation">
            <v-row class="form_container">
              <TextBox
                placeholder="Company Name"
                :value="Liability.FullName"
                @input="(e) => (Liability.FullName = e.target.value)"
                isRequired
              ></TextBox>
              <SelectBox
                placeholder="Ownership Type"
                :items="liabilitiesOwnershipTypes"
                :itemText="'text'"
                :itemValue="'value'"
                isRequired
                :value="Liability.OwnershipType"
                @change="(e) => (Liability.OwnershipType = e)"
              ></SelectBox>
              <SelectBox
                placeholder="Account Type"
                :items="liabilitiesAccountTypes"
                :itemText="'text'"
                :itemValue="'value'"
                isRequired
                @change="(e) => (Liability.LiabilityType = e)"
                :value="Liability.LiabilityType"
              ></SelectBox>
              <TextBox
                placeholder="Account Number"
                :value="Liability.LiabilityAccountIdentifier"
                :modelValue="Liability.LiabilityAccountIdentifier"
                @input="(e) => (Liability.LiabilityAccountIdentifier = e.target.value)"
                isRequired
              ></TextBox>
              <TextBox
                placeholder="Monthly Payment"
                prefix="$"
                class="prefix"
                :value="Liability.LiabilityMonthlyPaymentAmount"
                @input="
                  (e) =>
                    (Liability.LiabilityMonthlyPaymentAmount = +e.target.value.replace(
                      /,/g,
                      ''
                    ))
                "
                @keypress="(e) => isOnlyNum(e, true)"
              ></TextBox>
              <TextBox
                prefix="$"
                class="prefix"
                placeholder="Unpaid Balance"
                :value="Liability.LiabilityUnpaidBalanceAmount"
                @input="
                  (e) =>
                    (Liability.LiabilityUnpaidBalanceAmount = +e.target.value.replace(
                      /,/g,
                      ''
                    ))
                "
                @keypress="(e) => isOnlyNum(e, true)"
                isRequired
                required="required"
              ></TextBox>
              <TextBox
                placeholder="Remaining Term Months Count"
                inputmode="numeric"
                pattern="[0-9]*"
                :value="Liability.LiabilityRemainingTermMonthsCount"
                @input="
                  (e) => (Liability.LiabilityRemainingTermMonthsCount = e.target.value)
                "
                @keypress="(e) => isOnlyNum(e)"
              ></TextBox>
              <v-col class="itemContainer mr-2 py-1" cols="12" sm="6">
                <CheckBox
                  class="defaultCheckbox"
                  :hideDetails="true"
                  label="Payoff at Closing:"
                  :isChecked="Liability.LiabilityPayoffAtClosingStatusIndicator"
                  @toggle="(e) => (Liability.LiabilityPayoffAtClosingStatusIndicator = e)"
                ></CheckBox>
              </v-col>
              <v-col class="itemContainer mr-2 py-1" cols="12" sm="6">
                <CheckBox
                  class="defaultCheckbox"
                  :hideDetails="true"
                  label="Payoff Prior to Closing:"
                  :isChecked="Liability.LiabilityPayoffStatusIndicator"
                  @toggle="(e) => (Liability.LiabilityPayoffStatusIndicator = e)"
                ></CheckBox>
              </v-col>
              <v-col class="itemContainer mr-2 py-1" cols="12" sm="6">
                <CheckBox
                  class="defaultCheckbox"
                  color="primary"
                  label="Omit:"
                  :hideDetails="true"
                  :isChecked="Liability.LiabilityExclusionIndicator"
                  @toggle="(e) => (Liability.LiabilityExclusionIndicator = e)"
                  :disabled="
                    Liability.LiabilityPayoffAtClosingStatusIndicator ||
                    Liability.LiabilityPayoffStatusIndicator
                  "
                ></CheckBox>
              </v-col>
              <v-col class="itemContainer mr-2 py-1" cols="12" sm="6">
                <CheckBox
                  class="defaultCheckbox"
                  :hideDetails="true"
                  label="Resubordinated:"
                  :isChecked="Liability.LiabilityResubordinatedIndicator"
                  @toggle="(e) => (Liability.LiabilityResubordinatedIndicator = e)"
                  :disabled="
                    Liability.LiabilityPayoffAtClosingStatusIndicator ||
                    Liability.LiabilityPayoffStatusIndicator
                  "
                ></CheckBox>
              </v-col>
              <v-col class="itemContainer mr-2 py-1" cols="12" sm="6">
                <CheckBox
                  class="defaultCheckbox"
                  :hideDetails="true"
                  label="Disputed:"
                  :isChecked="Liability.LiabilityDisputeIndicator"
                  @toggle="(e) => (Liability.LiabilityDisputeIndicator = e)"
                ></CheckBox>
              </v-col>
              <template v-if="Liability.LiabilityDisputeIndicator">
                <SelectBox
                  placeholder="Dispute Reason"
                  :items="disputeReasons"
                  :itemText="'text'"
                  :itemValue="'value'"
                  @change="(e) => (Liability.LiabilityDisputeReason = e)"
                  :value="Liability.LiabilityDisputeReason"
                ></SelectBox>
                <TextBox
                  placeholder="Explanation"
                  :value="Liability.LiabilityDisputeReasonExplanation"
                  @input="
                    (e) => (Liability.LiabilityDisputeReasonExplanation = e.target.value)
                  "
                  :smVal="12"
                ></TextBox>
              </template>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <div class="popup__button">
          <div class="popup_desktop-button">
            <CustomButton
              value="OK"
              class="btn-width"
              customClass="primary-button"
              @onHandleClick="handleSubmit()"
            ></CustomButton>
          </div>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>
<style lang="scss" scoped>
:deep(.infoText) {
  color: $gray3 !important;
  font-size: 14px !important;
  letter-spacing: 0.0178571429em !important;
  line-height: 1.25rem !important;
  font-weight: 500 !important;
}
:deep(.v-card-title) {
  padding: 10px 20px 10px 30px !important;
  justify-content: space-between !important;
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.card-content) {
  padding: 30px !important;
  overflow-y: auto !important;
}
:deep(.v-input__control) {
  height: 40px !important;
}
:deep(.v-field__field) {
  height: 40px;
}
:deep(.v-input__control .v-field__field input) {
  padding: 8px 12px !important;
}
:deep(.titleText) {
  font-size: 14px !important;
}

:deep(.v-input__slot) {
  flex-direction: row-reverse;
}
.popup__button {
  padding: 24px 0px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.defaultCheckbox {
  margin-top: 0px !important;
  padding: 0px !important;
  // :deep(.v-input__control) {
  //   height: 24px !important;
  // }

  :deep(.v-selection-control) {
    flex-direction: row-reverse !important;
    justify-content: space-between;
  }
}
:deep(.v-checkbox .v-selection-control) {
  min-height: 48px !important;
}

:deep(.v-field__field) {
  align-items: center !important;
  height: 40px;
}
:deep(.prefix .v-field__field input) {
  padding: 4px !important;
}
:deep(.v-field__field input) {
  padding: 12px !important;
}
:deep(.v-text-field__prefix) {
  padding: 0px 0px 0px 12px !important;
}

:deep(.v-select .v-theme--light) {
  max-height: 40px !important;
}
:deep(.v-input__control .v-field__append-inner) {
  padding: 7px 0px !important;
}

.card-content::-webkit-scrollbar {
  width: 5px;
}

.card-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.card-content::-webkit-scrollbar-thumb {
  background-color: #88888834;
  border-radius: 10px;
  border: 3px solid #88888834;
}

.card-content::-webkit-scrollbar-corner {
  background-color: #f1f1f1;
}

:deep(.close-btn) {
  background: transparent !important;
}
@media (max-width: $mobile-width) {
  :deep(.card-content) {
    padding: 30px 15px !important;
  }
  :deep(.v-card-title) {
    padding: 10px 10px 10px 15px !important;
  }
  :deep(.btn-width button) {
    width: 200px !important;
  }
}
</style>
