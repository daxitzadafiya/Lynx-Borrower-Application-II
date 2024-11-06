<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { ref, computed, watch } from "vue";
import { useCreditStore } from "@/stores/creditStore";
import { useGeneralStore } from "@/stores/generalStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import moment from "moment";

const editIcon = ref("");
let imageList = await Promise.all([import("@/assets/images/edit.svg")]);
editIcon.value = imageList[0].default;

const creditStore = useCreditStore();
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const removeIndex = ref(-1);
const isDialog = ref(false);
const headers = ref([
  { title: "Action", key: "RecordType", class: "primary--text" },
  { title: "Reported Date", key: "ReportedDate", class: "primary--text" },
  { title: "Disposition", key: "DispositionType", class: "primary--text" },
  { title: "Disposition Date", key: "DispositionDate", class: "primary--text" },
  { title: "Ownership", key: "OwnershipType", align: "center", class: "primary--text" },
  {
    title: "Obligation Amount",
    key: "LegalObligationAmount",
    align: "center",
    class: "primary--text",
  },
  { title: "Edit", key: "edit", class: "primary--text" },
]);

const derogatories = computed(()=>{
return borrowersStore.Borrower && borrowersStore.Borrower.PublicRecords ? borrowersStore.Borrower.PublicRecords :[]
})

const editItem = (derogatoryItem) => {
  const index = derogatories.value.indexOf(derogatoryItem);
  creditStore.setEditingDerogatoryItem({ derogatoryItem, index });
  creditStore.onToggle(true);
  generalStore.toggleIsOnlay({
    isOnlay: true,
    onlayComponent: "editDerogatory",
  });
};

const getFormattedDate = (date) => {
  return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
};

const setRemoveIndex = (liability) => {
  removeIndex.value = derogatories.value.indexOf(liability);
  isDialog.value = true;
};

const removeDerogatory = () => {
  const updated = derogatories.value.filter((item, index) => index !== removeIndex.value);
  borrowersStore.updateBorrower({ prop: "PublicRecords", value: updated });
  isDialog.value = false;
};

const totalObligationAmount = computed(() => {
  if (derogatories.value.length) {
    return derogatories.value.reduce(
      (acc, cur) =>
        acc + (!isNaN(cur.LegalObligationAmount) ? +cur.LegalObligationAmount : 0),
      0
    );
  }
  return 0;
});

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
    <v-data-table
      :headers="headers"
      :items="derogatories"
      disable-sort
      class="content-table"
      :items-per-page="-1"
      hide-default-footer
    >
      <template v-slot:[`item.LegalObligationAmount`]="{ item }">
        <span>${{ getFormattedValue(item.LegalObligationAmount) || 0 }}</span>
      </template>

      <template v-slot:[`item.ReportedDate`]="{ item }">
        <span>{{ getFormattedDate(item.ReportedDate) }}</span>
      </template>

      <template v-slot:[`item.DispositionDate`]="{ item }">
        <span>{{ getFormattedDate(item.DispositionDate) }}</span>
      </template>

      <template v-slot:[`item.DispositionType`]="{ item }">
        <span>
          {{
            item.DispositionType
              ? item.DispositionType
              : item.DispositionTypeDescriptionOther
          }}
        </span>
      </template>

      <template v-slot:[`item.edit`]="{ item }">
        <inline-svg
          :src="editIcon"
          @click="editItem(item)"
          class="tableInfoIcon"
        ></inline-svg>
      </template>

      <template
        v-if="derogatories!=null && derogatories.length !== 0"
        v-slot:[`body.append`]="{}"
      >
        <tr class="totals-row">
          <td>Total:</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="text-center">${{ getFormattedValue(totalObligationAmount) }}</td>
          <td></td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="isDialog" max-width="290">
      <v-card>
        <v-card-title class="d-flex justify-center mb-4 text-black--text">
          Are you sure?
        </v-card-title>
        <v-card-text>
          <v-row justify="space-around">
            <CustomButton 
              value="Yes"
              custom-class="primary-button"
              width="120px"
              @onHandleClick="removeDerogatory()"
            />
            <CustomButton
              value="No"
              width="120px"
              @onHandleClick="isDialog = false"
            />
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-data-table-header__content span) {
  font-size: 12px !important;
  color: $table-header-text-color !important;
}
:deep(.v-table--density-default) {
  --v-table-header-height: 48px !important;
  --v-table-row-height: 48px !important;
}
.tableInfoIcon {
  width: 16px !important;
  cursor: pointer !important;
}
</style>
