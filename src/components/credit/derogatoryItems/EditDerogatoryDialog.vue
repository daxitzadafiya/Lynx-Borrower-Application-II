<script setup>
import { computed } from "vue";
import { useCreditStore } from "@/stores/creditStore";
import { useGeneralStore } from "@/stores/generalStore";
import { number } from "@/mixins/onlyNum";
import { useBorrowersStore } from "@/stores/borrowersStore";
import moment from "moment";
import { getFormattedValue } from "@/mixins/currencyFormat.js";

const creditStore = useCreditStore();
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const { isOnlyNum } = number();
const isShowModal = computed({
  get: () => creditStore.isVisible,
  set: (val) => {
    creditStore.isModalVisible = val;
  },
});

const onHandleClose = () => {
  creditStore.onToggle(false);
  generalStore.toggleIsOnlay({
    isOnlay: false,
  });
};

const isModelVisible = computed({
  get: () => isShowModal.value && generalStore.onlayComponent == "editDerogatory",
  set: (val) => {
    creditStore.isModalVisible = val;
  },
});

const updateDerogatoryItem = (value, prop) => {
  const DerogatoryItems = borrowersStore.Borrower.PublicRecords.map((item, i) =>
    i !== creditStore.editingDerogatoryItemIndex ? item : { ...item, [prop]: value }
  );
  borrowersStore.updateBorrower({ prop: "PublicRecords", value: DerogatoryItems });
};

const setBooleanProperty = (boolProp) => {
  const DerogatoryItems = borrowersStore.Borrower.PublicRecords?.map((item, i) =>
    i !== creditStore.editingDerogatoryItemIndex
      ? item
      : { ...item, [boolProp]: !item[boolProp] }
  );
  borrowersStore.updateBorrower({ prop: "PublicRecords", value: DerogatoryItems });
};

const getFormattedDate = (date) => {
  return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
};

const derogatory = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.PublicRecords
    ? borrowersStore.Borrower.PublicRecords[creditStore.editingDerogatoryItemIndex]
    : {};
});
</script>
<template>
  <v-dialog v-model="isModelVisible" activator="parent" max-width="720" persistent>
    <template v-slot:default="{}">
      <v-card light>
        <v-card-title class="dialog-header-back dialog-header-text">
          <span class="">Derogatory Item Review</span>
          <v-btn class="close-btn" icon="icon" elevation="0" @click="onHandleClose()">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="popup__main card-content text-black--text">
          <v-row>
            <TextBox :sm="6" placeholder="Source" disabled :value="derogatory.Source" />
            <TextBox
              :sm="6"
              placeholder="Docker Identifier"
              disabled
              :value="derogatory.DocketIdentifier"
            />
            <TextBox
              :sm="6"
              placeholder="Action"
              disabled
              :value="derogatory.RecordType"
            />
            <TextBox
              :sm="6"
              placeholder="Reported Date"
              disabled
              :value="getFormattedDate(derogatory.ReportedDate)"
            />
            <TextBox
              :sm="6"
              placeholder="Disposition"
              disabled
              :value="derogatory.DispositionType"
            />
            <TextBox
              :sm="6"
              placeholder="Disposition Date"
              disabled
              :value="getFormattedDate(derogatory.DispositionDate)"
            />
            <TextBox
              :sm="6"
              placeholder="Ownership"
              disabled
              :value="derogatory.OwnershipType"
            />
            <TextBox
              :sm="6"
              class="prefix"
              prefix="$"
              placeholder="Obligation Amount"
              disabled
              :value="getFormattedValue(derogatory.LegalObligationAmount)"
            />
          </v-row>
          <v-row class="checkbox">
            <v-col>
              <CheckBox
                class="defaultCheckbox w-100"
                label="I Dispute this Item:"
                :hide-details="true"
                :isChecked="derogatory.BorrowerDisputesItem"
                @toggle="setBooleanProperty('BorrowerDisputesItem')"
              ></CheckBox>
            </v-col>
          </v-row>
          <v-row v-if="derogatory.BorrowerDisputesItem">
            <TextBox
              :sm="12"
              class="w-100"
              :value="derogatory.BorrowerExplanation"
              placeholder="Explanation"
              @input="(e) => updateDerogatoryItem(e.target.value, 'BorrowerExplanation')"
            />
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <div class="popup__button">
          <div class="popup_desktop-button">
            <CustomButton
              value="OK"
              class="btn-width"
              customClass="primary-button"
            ></CustomButton>
          </div>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>
<style lang="scss" scoped>
:deep(.v-card-title) {
  padding: 10px 20px 10px 30px !important;
  justify-content: space-between !important;
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.card-content) {
  padding: 30px !important;
  overflow-y: auto !important;
}
:deep(.v-input__control) {
  height: 40px !important;
}
:deep(.v-field__field) {
  height: 40px;
  align-items: center !important;
}
:deep(.v-input__control .v-field__field input) {
  padding: 8px 12px !important;
}
:deep(.titleText) {
  font-size: 14px !important;
}

:deep(.v-input__slot) {
  flex-direction: row-reverse;
}
.popup__button {
  padding: 24px 0px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.defaultCheckbox {
  margin-top: 0px !important;
  padding: 0px !important;
  :deep(.v-selection-control) {
    flex-direction: row-reverse !important;
    justify-content: space-between;
  }
}
:deep(.v-checkbox .v-selection-control) {
  min-height: 48px !important;
}
:deep(.prefix .v-field__field input) {
  padding: 4px !important;
}
:deep(.v-field__field input) {
  padding: 12px !important;
}
:deep(.v-text-field__prefix) {
  padding: 0px 0px 0px 12px !important;
}
.card-content::-webkit-scrollbar {
  width: 5px;
}

.card-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.card-content::-webkit-scrollbar-thumb {
  background-color: #88888834;
  border-radius: 10px;
  border: 3px solid #88888834;
}

.card-content::-webkit-scrollbar-corner {
  background-color: #f1f1f1;
}

:deep(.close-btn) {
  background: transparent !important;
}

:deep(.checkbox) {
  .v-col {
    flex: 0 0 50% !important;
    max-width: 50% !important;
  }
}
.w-100 {
  width: 100% !important;
}
@media (max-width: $mobile-width) {
  :deep(.card-content) {
    padding: 30px 15px !important;
  }
  :deep(.v-card-title) {
    padding: 10px 10px 10px 15px !important;
  }
  :deep(.btn-width button) {
    width: 200px !important;
  }
}
@media (max-width: $lg-mobile-width) {
  :deep(.checkbox) {
    .v-col {
      flex: 0 0 100% !important;
      max-width: 100% !important;
    }
  }
}
</style>
