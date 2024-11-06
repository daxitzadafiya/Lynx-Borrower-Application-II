<script setup>
import AddressEditor from "@/components/core-components/AddressEditor.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import UsageTypesData from "@/components/real-estate/usage-types/UsageTypesData.vue";
import { computed, onMounted, ref } from "vue";
import { propertyOwnershipTypes } from "@/models/constants";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useGeneralStore } from "@/stores/generalStore";

const props = defineProps({
  index: {
    type: Number,
  },
});

const { isOnlyNum } = number();
const realEstateStore = useRealEstateStore();
const generalStore = useGeneralStore();

const statuses = ref(["Retain", "Sold", "Pending Sale"]);
const isDialog = ref(false);
const ownershipTypes = ref(propertyOwnershipTypes);

const editItem = () => {
  const { AddressLineText, CityName, StateCode, PostalCode } = property.value;
  realEstateStore.setEditingPropertyDetails({
    title: `Property #${props.index + 1}`,
    location: `${AddressLineText}, ${CityName}, ${StateCode}, ${PostalCode}`,
  });
  realEstateStore.setRealEstateEditingIndex(props.index);
  //   generalStore.toggleIsOnlay({ onlayComponent: "expenses", isOnlay: true });
};

const updateRealEstateAddress = (value) => {
  const updatedRealEstate = { ...property.value, ...value };
  let RealEstates = [...realEstateStore.getRealEstate()];
  RealEstates[props.index] = updatedRealEstate;
  realEstateStore.setRealEstate(RealEstates);
};

const updateRealEstateProp = ({ value, prop }) => {
  const updatedRealEstate = { ...property.value, [prop]: value };
  let RealEstates = [...realEstateStore.getRealEstate()];
  RealEstates[props.index] = updatedRealEstate;
  realEstateStore.setRealEstate(RealEstates);
};

const removeProperty = () => {
  const RealEstates = realEstateStore
    .getRealEstate()
    .filter((item, i) => i !== props.index);
  realEstateStore.setRealEstate(RealEstates);
  isDialog.value = false;
};

const property = computed(() => {
  return realEstateStore.getRealEstate()[props.index] || {};
});

const remove = (index) => {
  isDialog.value = true;
};
onMounted(() => {
  if (!property.value.OwnershipType) {
    updateRealEstateProp({ value: "Individual", prop: "OwnershipType" });
  }
});
</script>
<template>
  <div style="display: contents">
    <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
      <v-btn dense icon @click="remove(index)" elevation="0">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </v-col>

    <v-col class="itemContainer d-flex propertyHeader" cols="12" sm="12">
      <p class="mr-5 pr-5">Property {{ `#${index + 1}` }}</p>
      <CheckBox
        class="defaultCheckbox pt-0 mt-0"
        :hideDetails="true"
        :isChecked="property.OwnedPropertySubjectIndicator"
        @toggle="
          (value) =>
            updateRealEstateProp({ value, prop: 'OwnedPropertySubjectIndicator' })
        "
        label="Subject Property"
      />
    </v-col>

    <AddressEditor
      class="mt-2"
      :addressObj="property"
      :lgVal="4"
      :mdVal="6"
      @addressUpdated="updateRealEstateAddress"
      @addressPropUpdated="updateRealEstateProp"
      :uniqueInputId="`autocomplete-${index}`"
    />

    <TextBox
      placeholder="Property Value"
      :value="getFormattedValue(property.PropertyEstimatedValueAmount)"
      prefix="$"
      :lgVal="4"
      :mdVal="6"
      @input="
        (e) =>
          updateRealEstateProp({
            value: +e.target.value.replace(/,/g, ''),
            prop: 'PropertyEstimatedValueAmount',
          })
      "
      @keypress="(e) => isOnlyNum(e, true)"
    />

    <SelectBox
      :value="property.PropertyDispositionStatusType"
      :items="statuses"
      :lgVal="4"
      :mdVal="6"
      placeholder="Property Status"
      @change="
        (e) => updateRealEstateProp({ value: e, prop: 'PropertyDispositionStatusType' })
      "
    />

    <TextBox
      @click="editItem"
      placeholder="Housing Expenses"
      :value="getFormattedValue(property.PropertyMaintenanceExpenseAmount) || ''"
      prefix="$"
      :lgVal="4"
      :mdVal="6"
      :readOnly="true"
      appendIcon="mdi-pencil icon-color-main"
    />

    <TextBox
      placeholder="Monthly Rental Income"
      :value="getFormattedValue(property.PropertyRentalIncomeGrossAmount)"
      prefix="$"
      :lgVal="3"
      :mdVal="6"
      @input="
        (e) =>
          updateRealEstateProp({
            value: +e.target.value.replace(/,/g, '', ''),
            prop: 'PropertyRentalIncomeGrossAmount',
          })
      "
      @keypress="(e) => isOnlyNum(e, true)"
    />

    <UsageTypesData :index="index" :lgVal="3" :mdVal="6" />

    <SelectBox
      placeholder="Ownership Type"
      :items="ownershipTypes"
      itemText="text"
      itemValue="value"
      :lgVal="3"
      :mdVal="6"
      :value="property.OwnershipType"
      @change="(e) => updateRealEstateProp({ value: e, prop: 'OwnershipType' })"
    />

    <v-dialog v-model="isDialog" max-width="290">
      <v-card>
        <v-card-title class="d-flex justify-center mb-4 text-black--text">
          Are you sure?
        </v-card-title>
        <v-card-text>
          <v-row class="justify-space-around">
            <CustomButton
              value="Yes"
              customClass="primary-button"
              width="120px"
              @onHandleClick="removeProperty"
            />
            <CustomButton
              value="No"
              width="120px"
              customClass="button-no"
              isOutlined
              @onHandleClick="isDialog = false"
            />
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<style lang="scss" scoped>
.itemDeleteCrossContainer {
  :deep(.v-btn--icon.v-btn--density-default) {
    height: 36px !important;
    width: 36px !important;
    background: transparent;
  }
}
:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}
:deep(.itemDeleteCrossContainer .v-icon) {
  font-size: 16px;
  color: $close-icon-color !important;
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
.form-container.addItemBtnContainer {
  margin-top: -30px !important;
}
.form-container.addItemBtnContainer .addItemBtn {
  max-width: unset !important;
}
.propertyHeader {
  z-index: 0;
  align-items: center;
}
:deep(.v-checkbox .v-selection-control) {
  min-height: 40px !important;
}
:deep(.v-field__append-inner > .v-icon){
  opacity: 1 !important;
}
</style>
