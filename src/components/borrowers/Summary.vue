<script setup>
import { ref, defineEmits, computed, watch } from "vue";
import PersonalInfo from "@/components/borrowers/summaries/PersonalInfo.vue";
import MilitaryInfo from "@/components/borrowers/summaries/MilitaryInfo.vue";
import CurrentResInfo from "@/components/borrowers/summaries/CurrentResInfo.vue";
import MailingResInfo from "@/components/borrowers/summaries/MailingResInfo.vue";
import PriorResInfo from "@/components/borrowers/summaries/PriorResInfo.vue";
import { useBorrowersStore } from "@/stores/borrowersStore.js";

const props = defineProps({
  currentBorrower: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const priorResidenceVisible = ref(false);
const emit = defineEmits(["updateBorrower"]);
const borrowersStore = useBorrowersStore();
const changeIsMailingToEdit = ref(false);
const changePriorResidenceToEdit = ref(false);
const isMailingValue = ref(false);

const toggleIsMailing = ({value}) => {
  isMailingValue.value = value;
  if (isMailingValue.value) {
    changeIsMailingToEdit.value = true;
  }
};

const priorResidenceDataAvailable = computed(() => {
  let priorResidence = borrowersStore.getSpecificResidence("Prior");
  if (priorResidence.BorrowerResidencyType && priorResidence.AddressLineText) {
    return true;
  }
  return false;
});

const mailingResidenceDataAvailable = computed(() => {
  let priorResidence = borrowersStore.getSpecificResidence("Mailing");
  if (priorResidence.BorrowerResidencyType && priorResidence.AddressLineText) {
    return true;
  }
  return false;
});

const showPriorResidence = () => {
  priorResidenceVisible.value = true;
  changePriorResidenceToEdit.value = true
};

const priorResidenceEditCancelled = () => {
  priorResidenceVisible.value = false;
};

const mailingResidenceChangeButtonClicked = () => {
  if (!mailingResidenceDataAvailable.value) {
    isMailingValue.value = false;
  }
};

const showAddPriorResidenceButton = computed(() => {
  return !priorResidenceDataAvailable.value && !priorResidenceVisible.value;
});
</script>

<template>
  <div class="borrowers-data">
    <!-- <div class="review-header">
      <span class="review-header__title text-black--text">
        {{ currentBorrower?.FirstName ? `${currentBorrower?.FirstName}'s` : "" }} Borrower
        Information Summary
      </span>
    </div> -->

    <PersonalInfo
      :currentBorrower="currentBorrower"
      @updateBorrower="({ prop, value }) => emit('updateBorrower', { prop, value })"
    />
    <MilitaryInfo
      :currentBorrower="currentBorrower"
      @updateBorrower="({ prop, value }) => emit('updateBorrower', { prop, value })"
    />
    <CurrentResInfo
      :isEmptyMailing="isMailingValue"
      @toggleMailingAddress="toggleIsMailing"
      @renderPrioirResidence="showPriorResidence"
      :showAddPriorResidenceButton="showAddPriorResidenceButton"
    />
    <MailingResInfo
      v-if="isMailingValue"
      :isEditMode="changeIsMailingToEdit"
      @onStateChanged="mailingResidenceChangeButtonClicked"
    />
    <PriorResInfo
      v-if="priorResidenceDataAvailable || priorResidenceVisible"
      :isEditMode="changePriorResidenceToEdit"
      @onCancelEdit="priorResidenceEditCancelled"
    />

    <NavigationButtons nextButtonText="Go To Next Section" :isProgressDot="false"
      :hideProgressAndPrevious="true"></NavigationButtons>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";
</style>
