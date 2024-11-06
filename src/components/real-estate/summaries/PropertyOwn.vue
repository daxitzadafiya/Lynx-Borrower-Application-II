<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { propertyCurrentUsageTypes, propertyOwnershipTypes } from "@/models/constants";
import { useRealEstateStore } from "@/stores/realEstateStore";
import PropertyData from "@/components/real-estate/summaries/PropertyData.vue";
import MortgageLoansDesktop from "@/components/real-estate/summaries/MortgageLoansDesktop.vue";
import { ref } from "vue";
import { useGeneralStore } from "@/stores/generalStore";

const realEstateStore = useRealEstateStore();
const generalStore = useGeneralStore();

const dataBeforeEdit = ref([]);

const getFormattedAddress = (addressObj) => {
  const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
  return keys.reduce((acc, cur) => {
    if (addressObj[cur]) {
      acc += `${addressObj[cur]}${cur === "PostalCode" ? " " : ", "}`;
    }
    return acc;
  }, "");
};

const getCurrentUsageText = (val) => {
  let usageType = propertyCurrentUsageTypes.find((x) => x.value === val);
  if (usageType == null) {
    return null;
  }
  return usageType.text;
};

const getPropertyOwnershipTypeText = (val) => {
  let ownershipType = propertyOwnershipTypes.find((x) => x.value === val);
  if (ownershipType == null) {
    return null;
  }
  return ownershipType.text;
};

const addProperty = () => {
  realEstateStore.setRealEstateEditingIndex(realEstateStore.getRealEstate().length);
  realEstateStore.setRealEstate([...realEstateStore.getRealEstate(), {}]);
};

const removeLoanDetail = ({ updatedRealEstate, index }) => {
  const realEstates = [...realEstateStore.getRealEstate()];
  realEstates[index] = updatedRealEstate;
  realEstateStore.setRealEstate(realEstates);
};

const onCancelClicked = () => {
  realEstateStore.setRealEstate(dataBeforeEdit.value);
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(realEstateStore.getRealEstate()));
};
</script>
<template>
  <NewSummaryControl
    header="Real Estate Owned"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row
        class="summary-content-container"
        v-if="realEstateStore.getRealEstate() == null || realEstateStore.getRealEstate().length === 0"
      >
        <v-col sm="12" class="summaryItem">
          <div class="summaryValue">No Real Estate Owned.</div>
        </v-col>
      </v-row>
      <div
        class="summary-content-container property-own-container"
        v-else
        v-for="(property, index) in realEstateStore.getRealEstate()"
        :key="index"
      >
        <div
          class="main-card"
          :class="(index + 1) % 2 == 0 ? 'card-light-purple' : 'card-normal'"
        >
          <v-row class="property-own-card">
            <v-col sm="12" cols="12">
              <div class="text">
                <span>{{ getFormattedAddress(property) }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Property Value: </span>
                <span
                  >$
                  {{
                    getFormattedValue(property.PropertyEstimatedValueAmount) || 0
                  }}.00</span
                >
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Property Status: </span>
                <span>{{ property.PropertyDispositionStatusType }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Housing Expenses: </span>
                <span
                  >$
                  {{
                    getFormattedValue(property.PropertyMaintenanceExpenseAmount) || 0
                  }}.00</span
                >
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Monthly Rental Income: </span>
                <span
                  >$
                  {{
                    getFormattedValue(property.PropertyRentalIncomeGrossAmount) || 0
                  }}.00</span
                >
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Current Usage: </span>
                <span>{{ getCurrentUsageText(property.PropertyCurrentUsageType) }}</span>
              </div>
            </v-col>
            <v-col sm="4" class="p-0" cols="12">
              <div class="text">
                <span class="card-title">Ownership Type: </span>
                <span>{{ getPropertyOwnershipTypeText(property.OwnershipType) }}</span>
              </div>
            </v-col>
            <!-- TODO: Temporary, We hide this table. we don't have UI in figma.  -->
            <!-- <v-col v-if="false" sm="12" cols="12" class="summaryItem position-relative">
              <MortgageLoansDesktop
                :property="property"
                :index="index"
                @removeLoanDetail="removeLoanDetail"
                :editable="false"
                class="mortgageLoansTable"
              ></MortgageLoansDesktop>
            </v-col> -->
          </v-row>
        </div>
      </div>
    </template>
    <template v-slot:editContent>
      <v-form class="fast-fail form-outer-container">
        <div v-if="realEstateStore.getRealEstate().length">
          <v-row
            class="form-container deleteAbleItem"
            v-for="(property, index) in realEstateStore.getRealEstate()"
            :key="index"
          >
            <PropertyData :index="index"></PropertyData>
            <v-col cols="12" sm="12" class="position-relative">
              <MortgageLoansDesktop
                :property="property"
                :index="index"
                @removeLoanDetail="removeLoanDetail"
                class="mortgageLoansTable overflow-hidden"
              ></MortgageLoansDesktop>
            </v-col>
          </v-row>
        </div>
        <v-row class="form-container addItemBtnContainer">
          <v-col class="itemContainer" cols="12" sm="8">
            <v-btn dense plain elevation="0" @click="addProperty" class="addItemBtn">
              <v-icon small>mdi-plus</v-icon>
              <span class="addBtnText">Add Property</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
:deep(.summaryCardViewMode) {
  padding: 15px !important;
}
.property-own-container {
  border: 1px solid $gray4;
  border-radius: 8px;
  padding: 0;
  margin: 0 0 13px 0 !important;
  &:last-child {
    margin-bottom: 0 !important;
  }
}
.main-card .property-own-card {
  margin: 0;
}
.card-normal {
  background-color: $gray1;
}
.card-light-purple {
  background-color: $summary-table-even-row-colorV2;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: $summarycard-title-text-color;
}
.text {
  margin-left: 0 !important;
  font-size: 14px !important;
  line-height: 21px !important;
  span {
    font-size: 14px !important;
  }
}
:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}
.form-container.addItemBtnContainer {
  margin-top: -30px !important;
}
.form-container.addItemBtnContainer .addItemBtn {
  max-width: unset !important;
}
</style>
