<script setup>
import { computed, defineProps, defineEmits, watch, ref } from "vue";
import { phone } from "@/mixins/phoneFormat";
import { number } from "@/mixins/onlyNum";
import TcpaPolicy from "../borrowers/TcpaPolicy.vue";
const props = defineProps({
  currentBorrower: {
    type: Object,
    default: () => {},
  },
});
const currentBorrower = ref(props.currentBorrower);
const isModalOpen = ref(false);
watch(
  () => props.currentBorrower,
  (newValue) => {
    currentBorrower.value = newValue;
  },
  { deep: true }
);

const emit = defineEmits(["updateBorrower"]);
const { getFormattedPhone } = phone();
const { isOnlyNum } = number();
const updateBorrower = (event, data) => {
  if (data.prop == "TcpaConsent") {
    emit("updateBorrower", { ...data, value: event.target.checked });
  } else {
    emit("updateBorrower", { ...data, value: event.target.value });
  }
};
const formattedMobilePhone = computed(() => {
  if (currentBorrower.value?.MobilePhoneNumber) {
    return getFormattedPhone(currentBorrower.value.MobilePhoneNumber);
  }
  return "";
});
const formattedHomePhone = computed(() => {
  if (currentBorrower.value?.HomePhoneNumber) {
    return getFormattedPhone(currentBorrower.value?.HomePhoneNumber);
  }
  return "";
});
const formattedWorkPhone = computed(() => {
  if (currentBorrower.value?.WorkPhoneNumber) {
    return getFormattedPhone(currentBorrower.value?.WorkPhoneNumber);
  }
  return "";
});

const isPhoneValid = computed(() => {
  return (
    currentBorrower.value?.MobilePhoneNumber &&
    currentBorrower.value?.MobilePhoneNumber.length === 10
  );
});

const tcpaConsent = computed(() => {
  return (
    currentBorrower.value?.TcpaConsent &&
    currentBorrower.value?.MobilePhoneNumber &&
    currentBorrower.value?.MobilePhoneNumber.length > 0
  );
});

const isNextDisabled = computed(() => {
  return (!isPhoneValid.value || !tcpaConsent.value);
});

const validatePhone = (e) => {
  if (e.target.value.length === 14) {
    e.preventDefault();
    return false;
  }
  return isOnlyNum(e)
};
const toggleModal = () => {
  isModalOpen.value = true;
};
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please enter at least one telephone number where we may contact you
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <TextBox placeholder="Cell Phone" pattern="[0-9]*" inputmode="tel" hint="Example (999)999-9999"
          :isRequired="true" :value="formattedMobilePhone" @keypress="(e) => validatePhone(e)"
          @input="updateBorrower($event, { prop: 'MobilePhoneNumber' })" />
        <TextBox placeholder="Home Phone" pattern="[0-9]*" inputmode="tel" hint="Example (999)999-9999"
          :value="formattedHomePhone" @keypress="(e) => validatePhone(e)"
          @input="updateBorrower($event, { prop: 'HomePhoneNumber' })" />
        <TextBox placeholder="Work Phone" inputmode="tel" pattern="[0-9]*" hint="Example (999)999-9999"
          :value="formattedWorkPhone" @keypress="(e) => validatePhone(e)"
          @input="updateBorrower($event, { prop: 'WorkPhoneNumber' })" />
        <div class="itemContainer d-flex gray3-text policy-checkbox">
          <v-checkbox class="tcpa-checkbox" :model-value="currentBorrower?.TcpaConsent"
            @change="updateBorrower($event, { prop: 'TcpaConsent' })">
          </v-checkbox>
          <div class="text-container">
            <span>I agree that I have read, understood and consent to the company's TCPA
              Communication Policy. <br class="reviewPolicyBreak" />Click
              <a class="tcpa-toggle" @click="toggleModal()">here</a> to review the policy.</span>
          </div>
        </div>
      </v-row>
      <v-dialog v-model="isModalOpen" max-width="705" scrollable="scrollable">
        <TcpaPolicy @closeDialog="isModalOpen = false"></TcpaPolicy>
      </v-dialog>
      <div class="navigation-container">
        <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
      </div>
    </v-form>
  </div>
</template>

<style lang="scss" scoped>
.text-container {
  display: flex;
  justify-content: flex-start;
  font-weight: 500;
  color: $gray3;
}



.reviewPolicyBreak {
  @media (max-width: $tablet-width) {
    display: none;
  }
}

.tcpa-toggle {
  cursor: pointer;
}

:deep(.v-overlay__content) {
  max-height: 90%;
  border-radius: 8px;
}

.policy-checkbox {
  margin-top: 10px;

  span {
    padding-top: 2px;

    @media (max-width: $mobile-width) {
      padding-top: 0;
    }
  }

  .tcpa-checkbox {
    margin: 0;
    padding: 0;
    margin-left: -3px;
    margin-top: -6px;
    flex: none !important;
    @media (max-width: $mobile-width) {
      margin-top: -8px;
    }
    :deep(.v-checkbox-btn) {
      min-height: auto !important;
      display: block !important;
    }

    :deep(.v-selection-control__input) {
      i {
        font-size: 24px !important;
        color: $primary !important
      }
    }
  }
}
</style>