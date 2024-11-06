<script setup>
import NewSummaryControl from '@/components/core-components/NewSummaryControl.vue'
import AddressEditor from '../../core-components/AddressEditor.vue';
import { onMounted, ref, watch, defineEmits, computed } from 'vue';
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import { googleAutoComplete } from '@/mixins/googleAutoComplete.js'

const icon = ref(null)

const props = defineProps({
  isEditMode:{
    type:Boolean,
    default:false,
    required:false
  }
});

const isEditMode = ref(props.isEditMode);
const uniqueInputId = ref("mailing");
const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const residenceType = ref("Mailing");
const dataBeforeEdit = ref(null);
const emit = defineEmits(['onStateChanged'])
const { formattedAddress } = googleAutoComplete(uniqueInputId.value)
const currentResidence = ref(null)
watch(
  () => props.isEditMode,
  (newValue) => {
    isEditMode.value = newValue;
  },
  { deep: true }
);

watch(
  () => borrowersStore.Borrower,
  (newValue) => {
    mailingAddress.value = borrowersStore.getSpecificResidence("Mailing");
  },
  { deep: true }
);


onMounted(async () => {
  let image = await import('@/assets/images/borrowers/current-residence-mobile.svg')
  icon.value = image.default
});

const updateAddress = (addressData) => {
    borrowersStore.updateResidence({ type: residenceType.value, value: addressData });
};

const updateAddressProp = ({ prop, value }) => {
  borrowersStore.updateResidenceProp({
    type: residenceType.value,
    value: value,
    prop: prop,
  });
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(currentResidence.value));
};

const onCancelClicked = () => {
  borrowersStore.updateResidence({type: residenceType.value,value:dataBeforeEdit.value});
  emit('onStateChanged');
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
  emit('onStateChanged');

};

const mailingAddress = ref(borrowersStore.getSpecificResidence(residenceType.value));

const addressText = computed(()=>{
  const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
  if (mailingAddress.value) {
    return keys.reduce((acc, cur) => {
      if (mailingAddress.value[cur]) {
        acc += `${mailingAddress.value[cur]}${
          cur === "PostalCode" ? " " : ", "
        }`;
      }
      return acc;
    }, "");
  }
  return formattedAddress;
}) ;
</script>
<template>
  <div class="mailing-info">
    <NewSummaryControl
      header="Mailing Address"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
      ref="summaryControl"
      :isEditMode="isEditMode"
    >
      <template v-slot:displayContent>
        <div class="summary-content-container">
          <div class="summaryItem">
            <div class="summaryTitle">Residency Type:</div>
            <div class="summaryValue">
              {{ mailingAddress.BorrowerResidencyType }}
            </div>
          </div>
          <div class="summaryItem">
            <div class="summaryTitle">Address:</div>
            <div class="summaryValue truncate">{{ addressText }}</div>
          </div>
        </div>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail>
          <v-row class="form-container">
            <AddressEditor
              :lgVal="3"
              :addressObj="mailingAddress"
              @addressUpdated="updateAddress"
              @addressPropUpdated="updateAddressProp"
              :uniqueInputId="uniqueInputId"
            ></AddressEditor>
          </v-row>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/borrowers/summary.scss";
:deep(.v-card__text) {
  margin-left: -12px;
  margin-right: -12px;
}
:deep(.summaryCardViewMode) {
  padding: 16px !important;

  .summary-content-container {
    padding-left: 0 !important;
    margin: 0 !important;
    column-gap: 24px;
    row-gap: 8px;
    display: grid;
    grid-template-columns: 1fr 2fr;

    @media (max-width: $tablet-width) {
      grid-template-columns: 1fr 1fr;
      row-gap: 16px;
    }

    @media (max-width: $mobile-width) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
