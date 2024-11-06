<script setup>
import { computed, defineProps, defineEmits, ref } from "vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useRealEstateStore } from "@/stores/realEstateStore";
import { useGeneralStore } from "@/stores/generalStore";

const realEstateStore = useRealEstateStore();
const generalStore = useGeneralStore();
const emit = defineEmits(["removeLoanDetail"]);
const props = defineProps({
  property: {
    type: Object,
    default: () => {
      return {};
    },
  },
  index: {
    type: Number,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

const headers = ref([
  {
    title: "Loan Type",
    key: "MortgageLoanType",
  },
  { title: "Creditor Name", key: "FullName" },
  {
    title: "Account Number",
    key: "LiabilityAccountIdentifier",
  },
  {
    title: "Monthly Payment",
    key: "LiabilityMonthlyPaymentAmount",
  },
  {
    title: "Unpaid Balance",
    key: "LiabilityUnpaidBalanceAmount",
  },
  {
    title: "Credit Limit",
    key: "LiabilityCreditLimit",
  },
  {
    title: "Payoff prior to closing",
    key: "LiabilityPayoffStatusIndicator",
  },
  { title: "Action", key: "edit" },
]);

const isDialog = ref(false);
const removeIndex = ref(-1);
const editIcon = ref("");
const deleteIcon = ref("");
let imageList = await Promise.all([
  import("@/assets/images/edit.svg"),
  import("@/assets/images/delete.svg"),
]);
editIcon.value = imageList[0].default;
deleteIcon.value = imageList[1].default;

const computedHeaders = computed(() => {
  return props.editable ? headers.value : headers.value.filter((x) => x.value != "edit");
});

const editItem = (loan, loanIndex) => {
  const { AddressLineText, CityName, StateCode, PostalCode } = props.property;
  realEstateStore.setEditingPropertyDetails({
    title: `Property #${props.index + 1}`,
    location: `${AddressLineText}, ${CityName}, ${StateCode}, ${PostalCode}`,
  });
  setEditingItems(loan, loanIndex);
  realEstateStore.onToggle(true);
  generalStore.toggleIsOnlay({ onlayComponent: "mortgage-loan", isOnlay: true });
};

const setEditingItems = (loan, loanIndex) => {
  realEstateStore.setRealEstateEditingIndex(props.index);
  realEstateStore.setEditingMortgageLoanWithIndex({ loan, loanIndex });
};

const setPayoff = (value, loan, loanIndex) => {
  setEditingItems(loan, loanIndex);
  realEstateStore.setMortgageLoan({
    value,
    loanIndex,
    prop: "LiabilityPayoffStatusIndicator",
  });
};

const addMortgageLoan = () => {
  editItem({}, props.property.MortgageLoans ? props.property.MortgageLoans.length : 0);
};

const setRemoveIndex = (index) => {
  removeIndex.value = index;
  isDialog.value = true;
};

const removeDetail = () => {
  const filtered = props.property.MortgageLoans.filter(
    (item, index) => index !== removeIndex.value
  );
  const updatedRealEstate = { ...props.property, MortgageLoans: filtered };
  emit("removeLoanDetail", { updatedRealEstate, index: props.index });
  isDialog.value = false;
  removeIndex.value = -1;
};
</script>
<template>
  <div class="d-contents">
    <h3
      v-if="property.MortgageLoans != null && property.MortgageLoans.length != 0"
      class="tableTitle"
    >
      Mortgage Loans on this property
    </h3>

    <v-data-table
      v-if="property.MortgageLoans != null && property.MortgageLoans.length != 0"
      class="content-table my-2 mx-0"
      :headers="computedHeaders"
      :items="property.MortgageLoans"
      disable-sort
      disable-pagination
      hide-default-footer
      :mobile-breakpoint="0"
      :class="editable ? 'doubleActions' : ''"
    >
      <template v-slot:[`item.LiabilityUnpaidBalanceAmount`]="{ item }">
        <span
          v-if="
            item.LiabilityUnpaidBalanceAmount &&
            item.LiabilityUnpaidBalanceAmount !== 'N/A'
          "
          >$</span
        >
        <span>{{ getFormattedValue(item.LiabilityUnpaidBalanceAmount) }}</span>
      </template>

      <template v-slot:[`item.LiabilityMonthlyPaymentAmount`]="{ item }">
        <span
          v-if="
            item.LiabilityMonthlyPaymentAmount &&
            item.LiabilityMonthlyPaymentAmount !== 'N/A'
          "
          >$</span
        >
        <span>{{ getFormattedValue(item.LiabilityMonthlyPaymentAmount) }}</span>
      </template>

      <template v-slot:[`item.LiabilityCreditLimit`]="{ item }">
        <span v-if="item.LiabilityCreditLimit && item.LiabilityCreditLimit !== 'N/A'"
          >$</span
        >
        <span>{{ getFormattedValue(item.LiabilityCreditLimit) }}</span>
      </template>

      <template v-slot:[`item.LiabilityPayoffStatusIndicator`]="{ item, index }">
        <CheckBox
          :isChecked="item.LiabilityPayoffStatusIndicator"
          @toggle="(value) => setPayoff(value, loan, loanIndex)"
          :hideDetails="true"
        />
      </template>

      <template v-slot:[`item.edit`]="{ item, index }">
        <div class="d-flex actionsContainer">
          <v-btn icon small @click="editItem(item, index)" class="editIcon" elevation="0">
            <inline-svg :src="editIcon" />
          </v-btn>
          <v-btn
            icon
            small
            @click="setRemoveIndex(index)"
            class="deleteIcon"
            elevation="0"
          >
            <inline-svg :src="deleteIcon" />
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="isDialog" max-width="290">
      <v-card>
        <v-card-title class="d-flex justify-center mb-4 text-black--text"
          >Are you sure?</v-card-title
        >
        <v-card-text>
          <v-row class="justify-space-around">
            <CustomButton
              value="Yes"
              customClass="primary-button"
              width="120px"
              @onHandleClick="removeDetail"
            />
            <CustomButton
              value="No"
              customClass="button-no"
              width="120px"
              isOutlined
              @onHandleClick="isDialog = false"
            />
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-btn
      dense
      plain
      elevation="0"
      @click="addMortgageLoan"
      v-if="editable"
      class="addItemBtn pl-0"
    >
      <v-icon small>mdi-plus</v-icon>
      <span class="addBtnText">Add Mortgage Loan</span>
    </v-btn>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-checkbox .v-selection-control) {
  min-height: 48px !important;
}
:deep(.v-table--density-default) {
  --v-table-header-height: 49px !important;
  --v-table-row-height: 48px !important;
}
:deep(.addItemBtn i) {
  padding: 12px !important;
  font-size: 16px !important;
}
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
:deep(.v-data-table-header__content span) {
  font-size: 12px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(1)) {
  min-width: 122.59px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(2)) {
  min-width: 118.09px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(3)) {
  min-width: 131.81px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(4)) {
  min-width: 135.27px !important;
}

:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(5)) {
  min-width: 124.13px !important;
}

:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(6)) {
  min-width: 77.75px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(7)) {
  min-width: 101.2px !important;
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
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(8)) {
  padding-left: 14px !important;
  font-size: 12px;
}
.tableTitle {
  font-weight: 500;
  font-size: 16px;
}
</style>
