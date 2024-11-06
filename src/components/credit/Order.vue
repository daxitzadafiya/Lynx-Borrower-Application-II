<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import TcpaPolicy from "../borrowers/TcpaPolicy.vue";
import moment from "moment";
import { useGeneralStore } from "@/stores/generalStore";
import { useCreditStore } from "@/stores/creditStore";
import { loanPatch } from "@/mixins/loanPatch";

const options = ref([
  {
    label: "Social Security Number",
    value: "SocialSecurityNumber",
  },
  {
    label: "Individual Taxpayer Identification Number",
    value: "IndividualTaxpayerIdentificationNumber",
  },
]);

const isMainMenu = ref(false);
const isCoMenu = ref(false);
const isMainTogglers = ref(true);
const isCoTogglers = ref(true);
const maxDate = ref(null);
const policyAccepted = ref(false);
const localSSN = ref("");
const coLocalSSN = ref("");
const isFocused = ref(false);
const isCoFocused = ref(false);
const isModalOpen = ref(false);
const borrowersStore = useBorrowersStore();
const selectedBorrower = ref(borrowersStore.getBorrower());
const borrowers = ref(borrowersStore.Borrowers);
const generalStore = useGeneralStore();
const creditStore = useCreditStore();
const { saveAndAdvance } = loanPatch();

const toggleModal = () => {
  isModalOpen.value = true;
};

const updateBorrowerDate = (date) => {
  if (selectedBorrower.value.Id === borrower.value.Id) {
    return borrowersStore.updateBorrower({
      prop: "BorrowerBirthDate",
      value: date != null ? moment(date).format("YYYY-MM-DD") : null,
    });
  }
  updateAllBorrowers(date, borrower.value.Id);
};

const updateCoBorrowerDate = (date) => {
  if (selectedBorrower.value.Id === coBorrower.value.Id) {
    return borrowersStore.updateBorrower({
      prop: "BorrowerBirthDate",
      value: date != null ? moment(date).format("YYYY-MM-DD") : null,
    });
  }
  updateAllBorrowers(date, coBorrower.value.Id);
};

const updateAllBorrowers = (date, id) => {
  const updatedBorrowers = borrowers.value.map((item) =>
    item.Id !== id
      ? item
      : {
          ...item,
          BorrowerBirthDate: date != null ? moment(date).format("YYYY-MM-DD") : null,
        }
  );
  borrowersStore.updateBorrowers(updatedBorrowers);
};

const setBorrowerTaxId = (value, isCo) => {
  const id = isCo ? coBorrower.value.Id : borrower.value.Id;
  if (selectedBorrower.value.Id === id) {
    return borrowersStore.updateBorrower({
      prop: "TaxpayerIdentifierValue",
      value: value,
    });
  }
  const updatedBorrowers = borrowers.value.map((item) =>
    item.Id !== id ? item : { ...item, TaxpayerIdentifierValue: value }
  );
  borrowersStore.updateBorrowers(updatedBorrowers);
};

const setTaxpayerIdentifierType = (value, isCo) => {
  const borrowerId = !isCo ? borrower.value.Id : coBorrower.value.Id;
  if (borrowerId) {
    const updated = borrowers.value.map((item) =>
      item.Id !== borrowerId ? item : { ...item, TaxpayerIdentifierType: value }
    );
    borrowersStore.updateBorrowers(updated);
  } else {
    borrowersStore.updateBorrower({ prop: "TaxpayerIdentifierType", value });
  }
};

const orderOrRedirect = async () => {
  if (buttonText.value === "Order Credit Report") {
    setCreditType();
    await generalStore.saveLoanPatches();
    creditStore.onToggle(true);
    generalStore.toggleIsOnlay({
      isOnlay: false,
      onlayComponent: "order",
    });
  } else {
    saveAndAdvance(true, "/credit/score-and-accounts-review");
  }
};

const setCreditType = () => {
  if (!selectedBorrower.value || !selectedBorrower.value.Id) return;
  const CreditType = coBorrower.value ? "Joint" : "Individual";
  const updatedBorrowers = borrowers.value.map((item) => {
    if (
      item.Id === borrower.value.Id ||
      (coBorrower.value && item.Id === coBorrower.value.Id)
    ) {
      item.CreditType = CreditType;
    }
    return item;
  });
  borrowersStore.updateBorrowers(updatedBorrowers);
};

const setInitialTaxType = () => {
  const { CitizenshipResidencyType } = borrower.value;
  if (
    CitizenshipResidencyType &&
    CitizenshipResidencyType !== "NonPermanentResidentAlien"
  ) {
    setTaxpayerIdentifierType("SocialSecurityNumber", false);
    isMainTogglers.value = false;
  }
  if (coBorrower.value) {
    const { CitizenshipResidencyType } = coBorrower.value;
    if (
      CitizenshipResidencyType &&
      CitizenshipResidencyType !== "NonPermanentResidentAlien"
    ) {
      setTaxpayerIdentifierType("SocialSecurityNumber", true);
      isCoTogglers.value = false;
    }
  }
};

const clearBorrowerDate = () => {
  updateBorrowerDate(null);
  isMainMenu.value = false;
};

const clearCoBorrowerDate = () => {
  updateCoBorrowerDate(null);
  isCoMenu.value = false;
};

const handleSSNInput = (value) => {
  const cleanValue = value.target.value.replace(/\D/g, "").slice(0, 9);
  localSSN.value = cleanValue;
  setBorrowerTaxId(cleanValue, false);
};

const formatSSN = (ssn) => {
  if (ssn.length <= 3) {
    return ssn;
  } else if (ssn.length <= 5) {
    return ssn.slice(0, 3) + "-" + ssn.slice(3);
  } else {
    return ssn.slice(0, 3) + "-" + ssn.slice(3, 5) + "-" + ssn.slice(5);
  }
};

const maskSSN = (ssn) => {
  if (ssn.length <= 3) {
    return ssn;
  } else if (ssn.length <= 5) {
    return ssn.slice(0, 3) + "-" + ssn.slice(3);
  } else {
    return ssn.slice(0, 3) + "-" + ssn.slice(3, 5) + "-****";
  }
};

const onSSNFocus = () => {
  isFocused.value = true;
};

const onSSNBlur = () => {
  isFocused.value = false;
};

const handleCoSSNInput = (value) => {
  const cleanValue = value.target.value.replace(/\D/g, "").slice(0, 9);
  coLocalSSN.value = cleanValue;
  setBorrowerTaxId(cleanValue, true);
};

const onCoSSNFocus = () => {
  isCoFocused.value = true;
};

const onCoSSNBlur = () => {
  isCoFocused.value = false;
};

const isNextDisabled = computed(() => {
  return (
    !policyAccepted.value ||
    borrower.value.BorrowerBirthDate == null ||
      isNaN(new Date(borrower.value.BorrowerBirthDate)) ||
      borrower.value.TaxpayerIdentifierValue == null ||
      /[^\d]/.test(borrower.value.TaxpayerIdentifierValue) ||
      borrower.value.TaxpayerIdentifierValue.length !== 9 ||
      (coBorrower.value != null &&
        (coBorrower.value.BorrowerBirthDate == null ||
          isNaN(new Date(coBorrower.value.BorrowerBirthDate)) ||
          coBorrower.value.TaxpayerIdentifierValue == null ||
          /[^\d]/.test(coBorrower.value.TaxpayerIdentifierValue) ||
          coBorrower.value.TaxpayerIdentifierValue.length !== 9))
  )
});
const selectedMainDate = computed(() => {
  return borrower.value && borrower.value.BorrowerBirthDate
    ? borrower.value.BorrowerBirthDate
    : maxDate.value;
});

const selectedCoDate = computed(() => {
  return coBorrower.value && coBorrower.value.BorrowerBirthDate
    ? coBorrower.value.BorrowerBirthDate
    : maxDate.value;
});

const borrower = computed(() => {
  if (selectedBorrower.value && !selectedBorrower.value.CoBorrower)
    return selectedBorrower.value;
  if (borrowers.value.length) {
    return borrowers.value.find(
      (item) => item.LinkedBorrowerId === selectedBorrower.value.Id && !item.CoBorrower
    );
  }
  return { TaxpayerIdentifierType: "SocialSecurityNumber" };
});

const coBorrower = computed(() => {
  if (selectedBorrower.value && selectedBorrower.value.CoBorrower)
    return selectedBorrower.value;
  if (borrowers.value.length) {
    return borrowers.value.find(
      (item) =>
        item.CoBorrower &&
        (selectedBorrower.value.Id === item.Id ||
          selectedBorrower.value.Id === item.LinkedBorrowerId)
    );
  }
  return null;
});

const buttonText = computed(() => {
  if (!borrower.value || !borrower.value.Id) return "Next";
  if (creditStore.getLoadedCreditOrders() && creditStore.getLoadedCreditOrders().length) {
    const borrowerOrder = creditStore
      .getLoadedCreditOrders()
      .find((item) => item.BorrowerId === borrower.value.Id);
    return !borrowerOrder ? "Order Credit Report" : "Next";
  }
  if (borrower.value && !creditStore.getLoadedCreditOrders()) {
    return "Order Credit Report";
  }
  return "Next";
});

const borrowerTaxLabel = computed(() => {
  return borrower.value.TaxpayerIdentifierType === "SocialSecurityNumber"
    ? "Social Security Number"
    : "Taxpayer Identification Number";
});

const coTaxLabel = computed(() => {
  return coBorrower.value &&
    coBorrower.value.TaxpayerIdentifierType === "SocialSecurityNumber"
    ? "Social Security Number"
    : "Taxpayer Identification Number";
});

const maskedSSN = computed(() => {
  const formattedSSN = formatSSN(localSSN.value);
  if (isFocused.value) {
    return formattedSSN;
  } else {
    return maskSSN(localSSN.value);
  }
});

const maskedCoSSN = computed(() => {
  const formattedSSN = formatSSN(coLocalSSN.value);
  if (isCoFocused.value) {
    return formattedSSN;
  } else {
    return maskSSN(coLocalSSN.value);
  }
});

watch(
  () => borrower.value.TaxpayerIdentifierValue,
  (newValue) => {
    localSSN.value = newValue || "";
  },
  { immediate: true }
);

watch(
  () => coBorrower.value?.TaxpayerIdentifierValue,
  (newValue) => {
    coLocalSSN.value = newValue || "";
  },
  { immediate: true }
);

watch(
  () => borrowersStore.Borrowers,
  (newValue) => {
    borrowers.value = newValue || "";
  },
  { deep: true }
);

watch(
  () => borrowersStore.Borrower,
  (newValue) => {
    selectedBorrower.value = newValue || "";
  },
  { deep: true }
);

onMounted(() => {
  var date = new Date();
  maxDate.value = new Date(date.setFullYear(date.getFullYear() - 18))
    .toISOString()
    .slice(0, 10);
  creditStore.getCreditOrders();
  if (!borrower.value.TaxpayerIdentifierType) {
    setTaxpayerIdentifierType("SocialSecurityNumber", false);
  }
  if (coBorrower.value && !coBorrower.value.TaxpayerIdentifierType) {
    setTaxpayerIdentifierType("SocialSecurityNumber", true);
  }
  setCreditType();
  setInitialTaxType();
});
</script>
<template>
  <div class="order-data">
    <div class="content-container">
      <div class="content-header-container">
        <div class="header-text">
          To complete your application it is necessary for us to obtain a credit report
        </div>
      </div>
      <div class="inner-content-container">
        <div class="mb-4 mr-5 gray3-text">
          Please enter the Date of Birth and Social Security Number(s) of each individual
          applying for credit on this application.
        </div>
        <v-form fast-fail="fast-fail">
          <v-row class="form-container">
            <v-col sm="5" md="4" cols="12">
              <div class="font-weight-bold mb-3">
                {{ borrower.FirstName }} {{ borrower.LastName }}
              </div>
              <v-row class="form-container flex">
                <DateInput
                  placeholder="Date of Birth"
                  class="textbox dateInput"
                  sm="12"
                  @dateUpdated="updateBorrowerDate"
                  @dateCleared="clearBorrowerDate"
                  :value="selectedMainDate"
                  :maxDate="maxDate"
                  isRequired
                >
                </DateInput>
                <TextBox
                  class="textbox"
                  isRequired
                  :placeholder="borrowerTaxLabel"
                  :maximumLength="11"
                  name="ssn"
                  sm="12"
                  :value="maskedSSN"
                  @input="handleSSNInput"
                  @focus="onSSNFocus"
                  @blur="onSSNBlur"
                >
                </TextBox>
                <v-col cols="12" sm="12" class="radio px-0">
                  <Radio
                    :options="options"
                    :value="borrower.TaxpayerIdentifierType"
                    @change="(val) => setTaxpayerIdentifierType(val, false)"
                  ></Radio>
                </v-col>
              </v-row>
            </v-col>
            <v-col sm="5" md="4" cols="12" v-if="coBorrower">
              <div class="font-weight-bold mb-3">
                {{ coBorrower.FirstName }} {{ coBorrower.LastName }}
              </div>
              <v-row class="form-container flex">
                <DateInput
                  placeholder="Date of Birth"
                  class="textbox dateInput"
                  sm="12"
                  @dateUpdated="updateCoBorrowerDate"
                  @dateCleared="clearCoBorrowerDate"
                  :value="selectedCoDate"
                  :maxDate="maxDate"
                >
                </DateInput>
                <TextBox
                  isRequired
                  class="textbox"
                  :placeholder="coTaxLabel"
                  :maximumLength="11"
                  name="co-ssn"
                  sm="12"
                  :value="maskedCoSSN"
                  @input="handleCoSSNInput"
                  @focus="onCoSSNFocus"
                  @blur="onCoSSNBlur"
                >
                </TextBox>
                <v-col cols="12" sm="12" class="px-0 radio">
                  <Radio
                    :options="options"
                    :value="coBorrower.TaxpayerIdentifierType"
                    @change="
                      (val) => {
                        setTaxpayerIdentifierType(val, true);
                      }
                    "
                  ></Radio>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <div class="d-flex checkbox">
            <CheckBox
              :value="policyAccepted"
              @change="
                (e) => {
                  policyAccepted = e.target.checked;
                }
              "
              :hideDetails="true"
            ></CheckBox>
            <div class="text-container gray3-text">
              <span
                >By checking this box, I agree that I have read, understood, and consent
                to the company's policy regarding the collection and verification of
                information used in the processing of my application for a mortgage loan.
                Click <a class="pointer" @click="toggleModal">here</a> to review the
                policy.</span
              >
            </div>
          </div>
        </v-form>
      </div>
      <v-dialog v-model="isModalOpen" max-width="705" scrollable="scrollable">
        <TcpaPolicy @closeDialog="isModalOpen = false"></TcpaPolicy>
      </v-dialog>
      <div class="navigation-container">
        <NavigationButtons
          :nextButtonText="buttonText"
          :ConditionsMet="isNextDisabled"
          :HasDefaultNavigation="false"
          :NextClicked="orderOrRedirect"
          :NextBtnWidth="'auto'"
        ></NavigationButtons>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
}
.pointer {
  cursor: pointer;
}

:deep(.v-input__control label) {
  font-size: 15px !important;
  line-height: 22px !important;
}

.radio {
  margin-bottom: 16px;
}
:deep(.radio .v-selection-control--density-default) {
  --v-selection-control-size: 35px;
  margin-left: 2px !important;
  i{
    font-size: 24px !important;
  }
  .v-selection-control-group{
    row-gap: 8px;
  }
}
.form-checkbox{
  flex-shrink: 1;
  :deep(.v-checkbox){
    width:28px !important
  }
}
:deep(.checkbox .v-selection-control__wrapper) {
  i{
    font-size: 24px;
  }
}
@media (max-width: $lg-mobile-width) {
  .radio {
    margin-bottom: 0px;
  }
}


@media (max-width: $mobile-width) {
  :deep(.v-col-12) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  :deep(.v-row) {
    margin: 0 !important;
  }
  .radio {
    margin-bottom: 0px;
    margin-top: 10px;
    padding: 0;
  }

  :deep(.radio .v-selection-control--density-default) {
    margin-left: -7px !important;
  }
}
</style>
