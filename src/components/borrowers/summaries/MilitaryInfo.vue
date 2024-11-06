<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { useBorrowersStore } from "../../../stores/borrowersStore";
import { onMounted, ref, defineProps, watch, defineEmits, computed } from "vue";
import { useGeneralStore } from "@/stores/generalStore";
import { military } from "@/mixins/military.js";
const {
  toggleService,
  updateExpirationDate,
  isServing,
  isRetired,
  isPeriod,
} = military();

const props = defineProps({
  currentBorrower: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const icon = ref(null);
const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const currentBorrower = ref(props.currentBorrower);
const dataBeforeEdit = ref(null);
const options = ref([
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
]);
const emit = defineEmits(['updateBorrower'])
onMounted(async () => {
  let image = await import("@/assets/images/borrowers/military-service.svg");
  icon.value = image.default;
});

watch(
  () => props.currentBorrower,
  (newValue) => {
    currentBorrower.value = newValue;
  },
  { deep: true }
);

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = [
    {
      prop: "SelfDeclaredMilitaryServiceIndicator",
      value: currentBorrower.value?.SelfDeclaredMilitaryServiceIndicator,
    },
    {
      prop: "MilitaryServices",
      value: currentBorrower.value?.MilitaryServices
        ? JSON.parse(JSON.stringify(currentBorrower.value?.MilitaryServices))
        : null,
    },
    {
      prop: "SpousalVABenefitsEligibilityIndicator",
      value: currentBorrower.value?.SpousalVABenefitsEligibilityIndicator,
    },
  ];
};

const onCancelClicked = () => {
  borrowersStore.updateBorrower(dataBeforeEdit.value);
};

const clearExpirationDate = () => {
  updateExpirationDate(null);
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const selectedDate = computed(() => {
  const activeType = currentBorrower.value?.MilitaryServices?.find(
    (item) => item.MilitaryStatusType === "ActiveDuty"
  );
  return activeType && activeType.MilitaryServiceExpectedCompletionDate
    ? activeType.MilitaryServiceExpectedCompletionDate
    : null;
});

const isPicker = computed(() => {
  const activeType = currentBorrower.value?.MilitaryServices?.find(
    (item) => item.MilitaryStatusType === "ActiveDuty"
  );
  return !!activeType;
});

const isSpouse = computed(() => {
  return currentBorrower.value?.SpousalVABenefitsEligibilityIndicator || false;
});

const toggle = (value, bool) => {
  if (bool == "isSpouse") {
    toggleService(bool, isSpouse.value);
  } else {
    toggleService(bool, value);
  }
};

const isSelfDeclaredMilitaryServiceIndicator = computed(() => {
  return currentBorrower.value?.SelfDeclaredMilitaryServiceIndicator
});
</script>
<template>
  <div class="personal-info">
    <NewSummaryControl
      header="Military Service"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
    >
      <template v-slot:displayContent>
        <div class="summaryItem">
          <div class="summaryValue truncate" v-if="currentBorrower?.SelfDeclaredMilitaryServiceIndicator">I am currently serving in the United States Armed Forces.</div>
          <div class="summaryValue" v-else>No Current or Prior Military Service.</div>
        </div>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail class="main-form">
            <div sm="12" cols="12" class="pa-0">
              <div class="titleText">
                Did you (or your deceased spouse) ever serve, or are you currently
                serving, in the United States Armed Forces?
              </div>
            </div>
            <div class="radio-main mt-4">
              <Radio :options="options" :value="currentBorrower?.SelfDeclaredMilitaryServiceIndicator" @change="(e)=> emit('updateBorrower', { prop: 'SelfDeclaredMilitaryServiceIndicator', value: e })" class="mt-0 radioGroup row hide-details"></Radio>
            </div>
          <div class="px-0 pt-6" v-if="isSelfDeclaredMilitaryServiceIndicator">
            <div class="itemContainer mb-4">
              <div class="titleText">Select all that apply:</div>
            </div>
            <div class="d-flex flex-column ga-2">
              <CheckBox
                class="defaultCheckbox mt-0 hide-details dense"
                :isChecked="isServing"
                label="Currently serving on active duty with project expitation
                    date of service/tour"
                @toggle="toggle($event, 'isServing')"
                :hideDetails="true"
              >
              </CheckBox>
              <CheckBox
                class="defaultCheckbox mt-0 hide-details dense"
                :isChecked="isRetired"
                label="Currently retired, discharged, or seperated from service"
                @toggle="toggle($event, 'isRetired')"
                :hideDetails="true"
              >
              </CheckBox>
              <CheckBox
                class="defaultCheckbox mt-0 hide-details dense"
                :isChecked="isPeriod"
                label="Only period of service was as a non-activated member of the
                    Reserve or National Guard"
                @toggle="toggle($event, 'isPeriod')"
                :hideDetails="true"
              >
              </CheckBox>
              <CheckBox
                class="defaultCheckbox mt-0 hide-details dense"
                :isChecked="isSpouse"
                label="Surviving spouse"
                @toggle="toggle($event, 'isSpouse')"
                :hideDetails="true"
              >
              </CheckBox>
            </div>
          </div>
          <date-input
            placeholder="Projected expiration date"
            v-if="isPicker"
            @date-updated="updateExpirationDate"
            @date-cleared="clearExpirationDate"
            :value="selectedDate"
            class="dateInput pa-0 mt-6"
            :isDisable="!isSelfDeclaredMilitaryServiceIndicator"
          ></date-input>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";
.summaryItem {
  height: 100%;
  padding-left: 27px;
}
:deep(.v-input__details) {
  min-height: auto !important;
  padding-top: 0px !important;
}
:deep(.v-input--selection-controls__input) {
  margin-right: 8px !important;
}
:deep(.v-selection-control) {
  margin-bottom: 8px !important;
  i{
    font-size: 20px !important;
  }
}
.truncate{
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width:$lg-mobile-width) {
  .truncate{
    width:100%
  }
}
:deep(.headerText){
  color: $dark-grayV2 !important;
  font-size: 16px !important;
  line-height: 24px !important;
  letter-spacing: 0.02em;
  font-weight: 500!important;
}
:deep(.summaryCardViewMode){
  padding: 16px !important;

  .summaryItem{
      padding: 0 !important;
      margin-bottom: 0px !important;

      .summaryValue{
        margin: 0 !important;
        color: $dark-grayV2;
        font-size: 14px;
        font-weight: 500 !important;
        line-height: 21px !important;
        letter-spacing: 0.0016em;
      }
  }
}

.main-form{
  .titleText{
    color: $dark-grayV2;
    font-size: 14px;
    font-weight: 400 !important;
    line-height: 21px !important;
    letter-spacing: 0.0016em;
    padding: 0!important;
  }
  .radio-main{
    :deep(.v-selection-control-group){
        flex-direction: row;
        gap: 24px;
        .v-radio{
          flex: 0 1 !important;
          width: fit-content;
          margin-bottom: 0 !important;
  
          .v-label{
            white-space: nowrap !important;
            color: $dark-grayV2 !important;
            font-size: 14px;
            font-weight: 400 !important;
            line-height: 21px !important;
            letter-spacing: 0.0016em;
            padding: 0 !important;
            opacity: 1;
          }
        
      }
    }
  }
  .defaultCheckbox{
    :deep(.v-input){
      .v-checkbox-btn{
        margin: 0 !important;
        .v-label{
              color: $dark-grayV2 !important;
              font-size: 14px;
              font-weight: 400 !important;
              line-height: 21px !important;
              letter-spacing: 0.0016em;
              padding: 0 !important;
              opacity: 1;
              white-space: normal !important;
        }
      }
    }
  }

  :deep(.dateInput){
      .titleText{
      color: $dark-grayV2;
      font-size: 14px;
      font-weight: 400 !important;
      line-height: 21px !important;
      letter-spacing: 0.0016em;
      padding: 0!important;
      margin-bottom: 4px;
    }
  }
}
</style>
