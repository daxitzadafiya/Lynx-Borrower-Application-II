<script setup>
import { computed, ref, watch } from "vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useCreditStore } from "@/stores/creditStore";
import { useGeneralStore } from "@/stores/generalStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { debtToIncomeAndHousingRatios } from "@/mixins/debtToIncomeAndHousingRatios.js";

const props = defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
});

const creditStore = useCreditStore();
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const isDialog = ref(false);
const removeIndex = ref(-1);
const { setDebtToIncomeAndHousingRatios } = debtToIncomeAndHousingRatios();
const headers = ref([
  {
    title: "Account Type",
    key: "LiabilityType",
    class: "primary--text",
  },
  { title: "Company Name", key: "FullName", class: "primary--text" },
  {
    title: "Account Number",
    key: "LiabilityAccountIdentifier",
    class: "primary--text",
  },
  {
    title: "Monthly Payment",
    key: "LiabilityMonthlyPaymentAmount",
    class: "primary--text",
  },
  {
    title: "Unpaid Balance",
    key: "LiabilityUnpaidBalanceAmount",
    class: "primary--text",
  },
  // {
  //   title: "Payoff prior to closing",
  //   key: "LiabilityPayoffStatusIndicator",
  //   align: "center",
  //   class: "primary--text"
  // },
  { title: "Action", key: "edit", class: "primary--text" },
]);

const setPayoff = (liability) => {
  const index = liabilities.value.indexOf(liability);
  const Liabilities = liabilities.value.map((item, i) =>
    i !== index
      ? item
      : {
          ...item,
          LiabilityPayoffStatusIndicator: !item.LiabilityPayoffStatusIndicator,
        }
  );
  borrowersStore.updateBorrower({ prop: "Liabilities", value: Liabilities });
};

const editItem = (liability) => {
  const index = liabilities.value.indexOf(liability);
  creditStore.setEditingLiability({ liability, index });
  creditStore.onToggle(true);
  generalStore.toggleIsOnlay({
    isOnlay: true,
    onlayComponent: "addOrEditLiability",
  });
};

const setRemoveIndex = (liability) => {
  removeIndex.value = liabilities.value.indexOf(liability);
  isDialog.value = true;
};

const removeLiability = () => {
  const updated = liabilities.value.filter((item, index) => index !== removeIndex.value);
  borrowersStore.updateBorrower({ prop: "Liabilities", value: updated });
  isDialog.value = false;
};
const addLiability = () => {
  creditStore.onToggle(true);
  generalStore.toggleIsOnlay({
    isOnlay: true,
    onlayComponent: "addOrEditLiability",
  });
};

const liabilities = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Liabilities ? borrowersStore.Borrower.Liabilities : [];
});

const indexes = computed(() => {
  return liabilities.value.length
    ? liabilities.value.liabilities.map((item) => item.FullName)
    : [];
});

const totalUnpaid = computed(() => {
  if (liabilities.value.length) {
    return liabilities.value.reduce(
      (acc, cur) =>
        acc +
        (!isNaN(cur.LiabilityUnpaidBalanceAmount)
          ? +cur.LiabilityUnpaidBalanceAmount
          : 0),
      0
    );
  }
  return 0;
});

const totalPayment = computed(() => {
  if (liabilities.value.length) {
    return liabilities.value.reduce(
      (acc, cur) =>
        acc +
        (!isNaN(cur.LiabilityMonthlyPaymentAmount)
          ? +cur.LiabilityMonthlyPaymentAmount
          : 0),
      0
    );
  }
  return 0;
});

const computedHeaders = computed(() => {
  return props.editable ? headers.value : headers.value.filter((x) => x.key != "edit");
});
const editIcon = ref("");
const deleteIcon = ref("");
let imageList = await Promise.all([
  import("@/assets/images/edit.svg"),
  import("@/assets/images/delete.svg"),
]);
editIcon.value = imageList[0].default;
deleteIcon.value = imageList[1].default;

watch(
  () => liabilities.value,
  (newValue) => {
    setDebtToIncomeAndHousingRatios();
  },
  { deep: true }
);

watch(
  () => isDialog.value,
  (newValue) => {
    if (!newValue) {
      removeIndex.value = -1;
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="d-contents">
    <div class="text-subtitle-1 mb-3 font-weight-bold" v-if="editable">
      If you have any mortgages, car payments, credit cards, or installment loans not
      listed, please add them using the Add New + button below.
    </div>

    <v-data-table
      :class="{
        'content-table': true,
        emptyTable: liabilities.length === 0,
        doubleActions: editable,
      }"
      :headers="computedHeaders"
      :items="liabilities"
      disable-sort
      hide-default-footer
      :mobile-breakpoint="0"
    >
      <!-- Account Type -->
      <template v-slot:[`item.LiabilityType`]="{ item }">
        <span>{{ item.LiabilityType }}</span>
      </template>

      <!-- Company Name -->
      <template v-slot:[`item.FullName`]="{ item }">
        <span>{{ item.FullName }}</span>
      </template>

      <!-- Account Number -->
      <template v-slot:[`item.LiabilityAccountIdentifier`]="{ item }">
        <span>{{ item.LiabilityAccountIdentifier }}</span>
      </template>

      <!-- Monthly Payment -->
      <template v-slot:[`item.LiabilityMonthlyPaymentAmount`]="{ item }">
        <span>${{ getFormattedValue(item.LiabilityMonthlyPaymentAmount) }}</span>
      </template>

      <!-- Unpaid Balance -->
      <template v-slot:[`item.LiabilityUnpaidBalanceAmount`]="{ item }">
        <span>${{ getFormattedValue(item.LiabilityUnpaidBalanceAmount) }}</span>
      </template>

      <!-- Action -->
      <template v-slot:[`item.edit`]="{ item }" v-if="editable">
        <div class="d-flex actionsContainer">
          <v-btn class="editIcon" icon elevation="0" @click="editItem(item)">
            <inline-svg :src="editIcon"></inline-svg>
          </v-btn>
          <v-btn class="deleteIcon" icon elevation="0" @click="setRemoveIndex(item)">
            <inline-svg :src="deleteIcon"></inline-svg>
          </v-btn>
        </div>
      </template>

      <!-- Bottom Row for Adding a New Liability -->
      <template v-slot:[`body.append`]>
        <tr class="appended-row">
          <td class="addItemBtnContainer">
            <v-btn
              class="addItemBtn"
              dense="dense"
              plain="plain"
              elevation="0"
              @click="addLiability"
              v-if="editable"
            >
              <v-icon small="small">mdi-plus</v-icon
              ><span class="addBtnText">Add Other Liabilty</span>
            </v-btn>
          </td>
          <td></td>
          <td>Totals:</td>
          <td>${{ getFormattedValue(totalPayment) }}</td>
          <td>${{ getFormattedValue(totalUnpaid) }}</td>
          <td v-if="editable" class="append-last"></td>
        </tr>
      </template>
    </v-data-table>
    <div class="body-2 mt-5 pt-3 infoText" style="max-width: unset" v-if="editable">
      <span
        >If you would like to provide us any additional information about a liability,
        please click the pencil </span
      ><span><inline-svg :src="editIcon" class="tableInfoIcon"></inline-svg></span>
      <span>link.</span>
    </div>
    <v-dialog v-model="isDialog" max-width="290">
      <v-card>
        <v-card-title class="d-flex justify-center text-black--text"
          >Are you sure?
        </v-card-title>
        <v-card-text>
          <v-row class="justify-space-around">
            <CustomButton
              value="Yes"
              customClass="primary-button"
              width="120px"
              @onHandleClick="removeLiability()"
            ></CustomButton>
            <CustomButton
              value="No"
              width="120px"
              customClass="button-no"
              isOutlined
              @onHandleClick="isDialog = false"
            ></CustomButton>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-card-title) {
  padding: 16px 24px 10px;
}
.infoText {
  color: $gray3;
  span {
    font-size: 14px !important;
    letter-spacing: 0.0178571429em !important;
    line-height: 1.25rem;
  }
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
.tableInfoIcon {
  :deep(path) {
    fill: $icon-color;
  }
}
:deep(.v-data-table-header__content span) {
  font-size: 12px !important;
  color: $table-header-text-color !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(1)) {
  width: 242px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(2)) {
  width: 182px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(3)) {
  width: 178px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(4)) {
  width: 175px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(5)) {
  width: 160px !important;
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
  border-bottom: 1px solid transparent;
}
:deep(.v-table > .v-table__wrapper > table > tbody > tr td:last-child):hover {
  background-color: transparent !important;
}

:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(6)) {
  width: 85px !important;
  padding-left: 14px !important;
  font-size: 12px;
}
:deep(.v-table--density-default) {
  --v-table-header-height: 49px !important;
  --v-table-row-height: 48px !important;
}
:deep(.addItemBtn i) {
  padding: 12px !important;
  font-size: 16px !important;
}
.append-last {
  background: $lightBlue2 !important;
}
</style>
