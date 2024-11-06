<script setup>
import { computed, ref } from "vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useGeneralStore } from "@/stores/generalStore";

const realEstateStore = useRealEstateStore();
const generalStore = useGeneralStore();

const editIcon = ref("");
const deleteIcon = ref("");
const editable = ref(true);
const isDialog = ref(false);
const removeIndex = ref(-1);
let imageList = await Promise.all([
  import("@/assets/images/edit.svg"),
  import("@/assets/images/delete.svg"),
]);
editIcon.value = imageList[0].default;
deleteIcon.value = imageList[1].default;

const headers = ref([
  { title: "Loan Type", key: "MortgageLoanType" },
  { title: "Creditor Name", key: "FullName" },
  { title: "Account Number", key: "LiabilityAccountIdentifier" },
  {
    title: "Monthly Payment",
    key: "LiabilityMonthlyPaymentAmount",
    isCurrency: true,
  },
  {
    title: "Unpaid Balance",
    key: "LiabilityUnpaidBalanceAmount",
    isCurrency: true,
  },
  {
    title: "Credit Limit",
    key: "LiabilityCreditLimit",
    isCurrency: true,
  },
  {
    title: "Payoff Prior to Closing",
    key: "LiabilityPayoffStatusIndicator",
    isCurrency: true,
    class: "largeWidth",
  },
  {
    title: "Payment Includes Taxes and Insurance",
    key: "LiabilityPaymentIncludesTaxesInsuranceIndicator",
    isCurrency: true,
    class: "largeWidth",
  },
  { title: "Action", key: "edit", class: "primary--text" },
]);

const editItem = (loan, loanIndex) => {
  if (!Object.entries(currentRealEstate.value).length) return;
  const { AddressLineText, CityName, StateCode, PostalCode } = currentRealEstate.value;
  realEstateStore.setEditingPropertyDetails({
    title: `Property #${realEstateStore.getRealEstateEditingIndex() + 1}`,
    location: `${AddressLineText}, ${CityName}, ${StateCode}, ${PostalCode}`,
  });
  realEstateStore.setEditingMortgageLoanWithIndex({ loan, loanIndex });
  realEstateStore.onToggle(true);
  generalStore.toggleIsOnlay({
    isOnlay: true,
    onlayComponent: "mortgage-loan",
  });
};

const addMortgageLoan = () => {
  editItem({}, loans.value.length);
};

const setRemoveIndex = (index) => {
  removeIndex.value = index;
  removeDetail()
  isDialog.value = true;
};

const removeDetail = () => {
  const filtered = loans.value.filter((item, index) => index !== removeIndex.value);
  const updatedRealEstate = {
    ...currentRealEstate.value,
    MortgageLoans: filtered,
  };
  const realEstates = [...realEstateStore.getRealEstate()];
  realEstates[realEstateStore.getRealEstateEditingIndex()] = updatedRealEstate;
  realEstateStore.setRealEstate(realEstates);
  isDialog.value = false;
  removeIndex.value = -1;
};

const currentRealEstate = computed(() => {
  return (
    realEstateStore.getRealEstate()[realEstateStore.getRealEstateEditingIndex()] || {}
  );
});

const loans = computed(() => {
  return currentRealEstate.value.MortgageLoans || [];
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please review the existing mortgage details for
        {{ currentRealEstate.AddressLineText || "this property" }} and make any necessary
        corrections
      </div>
    </div>
    <div class="inner-content-container">
      <v-data-table
        :class="{
          'content-table': true,
          emptyTable: loans.length === 0,
          doubleActions: editable,
        }"
        :headers="headers"
        :items="loans"
        disable-sort
        disable-pagination
        hide-default-footer
        :mobile-breakpoint="0"
      >
        <template v-slot:[`item.LiabilityMonthlyPaymentAmount`]="{ item }"
          ><span
            >${{ getFormattedValue(item.LiabilityMonthlyPaymentAmount) || 0 }}</span
          ></template
        >
        <template v-slot:[`item.LiabilityUnpaidBalanceAmount`]="{ item }"
          ><span
            >${{ getFormattedValue(item.LiabilityUnpaidBalanceAmount) || 0 }}</span
          ></template
        >
        <template v-slot:[`item.LiabilityCreditLimit`]="{ item }"
          ><span>${{ getFormattedValue(item.LiabilityCreditLimit) || 0 }}</span></template
        >
        <template v-slot:[`item.LiabilityPayoffStatusIndicator`]="{ item, index }">
          <CheckBox
            @toggle="
              (value) =>
              realEstateStore.setMortgageLoan({
                  value,
                  loanIndex: index,
                  prop: 'LiabilityPayoffStatusIndicator',
                })
            "
            :isChecked="item.LiabilityPayoffStatusIndicator"
            :hideDetails="true"
          ></CheckBox>
        </template>
        <template
          v-slot:[`item.LiabilityPaymentIncludesTaxesInsuranceIndicator`]="{
            item,
            index,
          }"
        >
          <CheckBox
            :isChecked="item.LiabilityPaymentIncludesTaxesInsuranceIndicator"
            color="primary"
            dense
            :hideDetails="true"
            @toggle="
              (value) =>
              realEstateStore.setMortgageLoan({
                  value,
                  loanIndex: index,
                  prop: 'LiabilityPaymentIncludesTaxesInsuranceIndicator',
                })
            "
          ></CheckBox>
        </template>
        <template v-slot:[`item.edit`]="{ item,index }">
          <div class="d-flex actionsContainer">
            <v-btn class="editIcon" icon="icon" small="small" @click="editItem(item,index)" elevation="0">
              <inline-svg :src="editIcon"></inline-svg>
            </v-btn>
            <v-btn
              class="deleteIcon"
              icon="icon"
              small="small"
              @click="setRemoveIndex(index)"
              elevation="0"
            >
              <inline-svg :src="deleteIcon"></inline-svg>
            </v-btn>
          </div>
        </template>
        <template v-slot:[`body.append`]>
          <tr class="appended-row">
            <td class="addItemBtnContainer">
              <v-btn
                class="addItemBtn"
                dense
                plain
                elevation="0"
                @click="addMortgageLoan"
              >
                <v-icon small="small">mdi-plus</v-icon
                ><span class="addBtnText">Add Mortgage Loan</span>
              </v-btn>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.editIcon {
  height: 28px !important;
  width: 28px !important;
  :deep(path) {
    fill: $icon-color;
  }
}
.deleteIcon {
  height: 28px !important;
  width: 28px !important;
}
:deep(.v-data-table-header__content) {
  line-height: 17px !important;
  display: block;
  span{
    font-size: 12px !important;
    color: $table-header-text-color !important;
  }
}

:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(1)) {
  min-width: 186.36px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(2)) {
  min-width: 80.58px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(3)) {
  min-width: 111.81px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(4)) {
  min-width: 91.55px !important;
}

:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(5)) {
  min-width: 83.53px !important;
}

:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(6)) {
  min-width: 83.08px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(7)) {
  min-width: 150.06px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(8)) {
  min-width: 152.03px !important;
}
:deep(.content-table.doubleActions
    tbody
    tr:not(.v-data-table__empty-wrapper)
    > :nth-last-child(2)::after) {
  background: $lightBlue2 !important;
}
:deep(.content-table.doubleActions
    tbody
    tr:not(.v-data-table__empty-wrapper)
    > :last-child) {
  background: $lightBlue2 !important;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr td:last-child) {
  border-bottom: 1px solid transparent !important;
}

:deep(.v-table--density-default) {
  --v-table-header-height: 49px !important;
  --v-table-row-height: 48px !important;
}
:deep(.v-checkbox .v-selection-control ){
    min-height: 48px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(9)) {
  padding-left: 14px !important;
  font-size: 12px;
}
:deep(.addItemBtnContainer i) {
  padding: 12px !important;
  font-size: 16px !important;
}
</style>
