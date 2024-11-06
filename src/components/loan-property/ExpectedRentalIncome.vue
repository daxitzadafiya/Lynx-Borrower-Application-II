<script setup>
import { number } from "@/mixins/onlyNum";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { loanPatch } from "@/mixins/loanPatch.js";
import { useGeneralStore } from "@/stores/generalStore";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { ref, computed, watch } from "vue";

const { isOnlyNum } = number();
const { saveAndAdvance } = loanPatch();
const { toggleIsOnlay } = useGeneralStore();
const loanPropertyStore = useLoanPropertyStore();
const Property = ref(loanPropertyStore.getProperty());

watch(
  () => loanPropertyStore.property,
  (newValue) => {
    Property.value = newValue;
  },
  { deep: true }
);

const isShowModal = computed({
  get: () => loanPropertyStore.isVisible,
  set: (val) => {
    loanPropertyStore.isModalVisible = val;
  }
});

const closePopup = () => {
  toggleIsOnlay({ isOnlay: false });
  loanPropertyStore.onToggle(false);
  setPropertyValue(null);
};

const toggleAndRedirect = async () => {
  toggleIsOnlay({ isOnlay: false });
  loanPropertyStore.onToggle(false);
  saveAndAdvance(true);
};

const setPropertyValue = (e) => {
  const property = Property.value || {};
  const RentalIncome = property.RentalIncome
    ? { ...property.RentalIncome, RentalEstimatedGrossMonthlyRentAmount: e }
    : { RentalEstimatedGrossMonthlyRentAmount: e };

  loanPropertyStore.setProperty({ ...property, RentalIncome });
};

const RentalEstimatedGrossMonthlyRentAmount = computed(() => {
    return Property.value && Property.value.RentalIncome
    ? Property.value.RentalIncome.RentalEstimatedGrossMonthlyRentAmount
    : "";
});
</script>
<template>
  <v-dialog v-model="isShowModal" activator="parent" max-width="704" persistent>
    <v-card class="popup" mx-auto="mx-auto" light="light">
      <v-card-title class="popup__title dialog-header-back dialog-header-text py-4"
        ><span class="popup__title-text">Expected Monthly Rental Income</span>
        <v-icon class="popup__close" color="white" @click="closePopup()"
          >mdi-close</v-icon
        >
      </v-card-title>
      <v-card-text class="popup__main text-black--text px-0 py-0 overflow-hidden">
        <v-row class="form-container" cols="12">
          <TextBox
            prefix="$"
            :smVal="12"
            placeholder="Expected Monthly Rental Income"
            :value="getFormattedValue(RentalEstimatedGrossMonthlyRentAmount)"
            @input="(e) => setPropertyValue(+e.target.value.replace(/,/g, ''))"
            @keypress="(e) => isOnlyNum(e, true)"
          />
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <div class="popup__button">
        <div class="popup_desktop-button">
          <CustomButton
            value="Submit"
            customClass="primary-button"
            @onHandleClick="toggleAndRedirect"
          ></CustomButton>
        </div>
        <div class="popup_mobile-button">
          <CustomButton
            value="Submit"
            customClass="primary-button"
            width="200px"
            @onHandleClick="toggleAndRedirect"
          >
          </CustomButton>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<style lang="scss" scoped>
@import "@/assets/styles/popup.scss";

.popup {
  border-radius: 7px !important;
  &__close{
    font-size: 24px !important;
  }
}

:deep(.v-text-field--prefixed.v-text-field .v-field__input) {
  padding: 10px 10px 10px 4px !important;
}
:deep(.v-text-field__prefix) {
  padding: 0 0 0 12px;
}
:deep(.v-field__field) {
  align-items: center !important;
}

:deep(.v-overlay__content){
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.v-field__field){
  height: 40px;
}
.v-card{
  width: 100% !important;
}
</style>
