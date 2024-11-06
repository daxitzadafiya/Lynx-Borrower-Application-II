<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { computed, ref, watch, defineProps } from "vue";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { useGeneralStore } from "@/stores/generalStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";

const types = ref([
  { text: "Traditional Second Mortgage", value: "FirstLien" },
  { text: "Home Equity Line of Credit", value: "SecondLien" },
  { text: "Other", value: "Other" },
]);

const props = defineProps({
  Property: {
      type: Object,
      default: () => {
        return null;
      }
    }
})

const isDialog = ref(false);
const removeIndex = ref(-1);
const isAdditional = ref(null);
const additional = ref(null);
const mortgageDataBeforeEdit = ref(null);
const loanPropertyStore = useLoanPropertyStore();
const Property = ref(props.Property);
const generalStore = useGeneralStore();
const { isOnlyNum } = number();

watch(
  () => loanPropertyStore.property,
  (newValue) => {
    Property.value = newValue;
  },
  { deep: true }
);

const addMortgageLoan = () => {
  if (additional.value) return;
  additional.value = {};
};

const setAdditionalType = (type) => {
  const newMortgages = [...mortgages.value, { LienPriorityType: type.value }];
  updateProperty(newMortgages);
  additional.value = null;
};

const setMortgageProp = (e, index, prop) => {
  const newMortgages = mortgages.value.map((item, i) => {
    if (index === i) {
      item = { ...item, [prop]: e };
    }
    return item;
  });
  updateProperty(newMortgages);
};

const updateProperty = (mortgages) => {
  const property = { ...Property.value };
  if (mortgages.length) {
    property.OtherNewMortgageLoans = mortgages;
  } else {
    delete property.OtherNewMortgageLoans;
  }
  loanPropertyStore.setProperty(property);
};

const remove = (index) => {
  removeIndex.value = index;
  isDialog.value = !isDialog.value;
};

const confirmRemove = () => {
  const updatedMortgages = mortgages.value.filter((item, i) => i !== removeIndex.value);
  updateProperty(updatedMortgages);
  isDialog.value = false;
  removeIndex.value = -1;
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  mortgageDataBeforeEdit.value = JSON.parse(JSON.stringify(mortgages.value));
};

const onCancelClicked = () => {
  updateProperty(mortgageDataBeforeEdit.value);
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const getLeinTypeText = (value) => {
  let leinType = types.value.find((x) => x.value === value);
  if (leinType != null) {
    return leinType.text;
  } else {
    return "";
  }
};

const getLeinTypeValue = (text) => {
  let leinType = types.value.find((x) => x.value === text);
  if (leinType != null) {
    return leinType.value;
  } else {
    return "";
  }
};

const getMortgageDescription = (mortgage) => {
  const {
    FullName,
    NoteAmount,
    InitialPrincipalAndInterestPaymentAmount,
    LienPriorityType,
  } = mortgage;
  const loanAmount = getFormattedValue(NoteAmount);
  const monthlyPayment = getFormattedValue(InitialPrincipalAndInterestPaymentAmount);

  const lienType =
    LienPriorityType === "Other"
      ? "An Additional Mortgage"
      : `A ${getLeinTypeText(LienPriorityType)}`;

  return `${lienType} from ${FullName}, with a loan amount of $${loanAmount}, and monthly payment of $${monthlyPayment}`;
};

const mortgages = computed(() => {
  return Property.value && Property.value.OtherNewMortgageLoans
    ? Property.value.OtherNewMortgageLoans
    : [];
});
</script>

<template>
  <div class="other-loans">
    <NewSummaryControl
      header="Additional Mortgage Loans"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
    >
      <template v-slot:displayContent>
        <v-row class="summary-content-container align-center" style="height: 100%">
          <v-col sm="12" md="12" cols="12" class="pb-2 pt-0">
            <div class="subtitle-1" v-for="(mortgage, index) in mortgages" :key="index">
              <span class="primary-text">{{ index + 1 }}. </span>
              <span class="text-color">{{ getMortgageDescription(mortgage) }}</span>
            </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:editContent>
        <v-form class="fast-fail form-outer-container">
          <v-row
            class="form-container deleteAbleItem"
            v-for="(mortgage, index) in mortgages"
            :key="index"
          >
            <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
              <v-btn dense icon elevation="0" @click="remove(index)">
                <v-icon small="small" dense="dense">mdi-close</v-icon>
              </v-btn>
            </v-col>
            <SelectBox
              hide-details
              placeholder="Lien type"
              :value="mortgage.LienPriorityType"
              :items="types"
              itemText="text"
              itemValue="value"
              @change="
                (e) => setMortgageProp(getLeinTypeValue(e), index, 'LienPriorityType')
              "
            />
            <TextBox
              hide-details
              placeholder="Creditor Name"
              :value="mortgage.FullName"
              @input="(e) => setMortgageProp(e.target.value, index, 'FullName')"
            />
            <TextBox
              class="prefix"
              prefix="$"
              hide-details
              placeholder="Monthly Payment"
              :value="
                getFormattedValue(mortgage.InitialPrincipalAndInterestPaymentAmount)
              "
              @input="
                (e) =>
                  setMortgageProp(
                    +e.target.value.replace(/,/g, ''),
                    index,
                    'InitialPrincipalAndInterestPaymentAmount'
                  )
              "
              @keypress="(e) => isOnlyNum(e, true)"
            />
            <TextBox
              class="prefix"
              prefix="$"
              hide-details
              placeholder="Loan Amount to be Drawn"
              :value="getFormattedValue(mortgage.NoteAmount)"
              @input="
                (e) =>
                  setMortgageProp(+e.target.value.replace(/,/g, ''), index, 'NoteAmount')
              "
              @keypress="(e) => isOnlyNum(e, true)"
            />
            <TextBox
              class="prefix"
              prefix="$"
              v-if="mortgage.LienPriorityType === 'SecondLien'"
              placeholder="Credit Limit"
              :value="getFormattedValue(mortgage.HELOCMaximumBalanceAmount)"
              @input="
                (e) =>
                  setMortgageProp(
                    +e.target.value.replace(/,/g, ''),
                    index,
                    'HELOCMaximumBalanceAmount'
                  )
              "
              @keypress="(e) => isOnlyNum(e, true)"
              hide-details
            />
          </v-row>
          <v-row class="form-container deleteAbleItem" v-if="additional">
            <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
              <v-btn dense icon elevation="0" @click="additional = null">
                <v-icon small="small" dense="dense">mdi-close</v-icon>
              </v-btn>
            </v-col>
            <ComboBox
              placeholder="Lien type"
              :items="types"
              @change="(e) => setAdditionalType(e)"
              :value="additional.LienPriorityType"
              itemText="text"
              itemValue="value"
            />
          </v-row>
          <v-row class="form-container addItemBtnContainer">
            <v-col class="itemContainer" cols="12" sm="12">
              <v-btn
                dense
                plain
                elevation="0"
                class="addItemBtn"
                @click="addMortgageLoan"
              >
                <v-icon small>mdi-plus</v-icon>
                <span class="addBtnText">Add mortgage loan</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-dialog v-model="isDialog" max-width="290">
          <v-card>
            <v-card-title class="d-flex justify-center mt-3 text-black--text"
              >Are you sure?</v-card-title
            >
            <v-card-text>
              <v-row class="justify-space-around">
                <CustomButton
                  customClass="primary-button"
                  value="Yes"
                  width="120px"
                  @onHandleClick="confirmRemove()"
                ></CustomButton>
                <CustomButton
                  value="No"
                  customClass="button-no"
                  width="120px"
                  :isOutlined="true"
                  @onHandleClick="isDialog = false"
                ></CustomButton>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>
    </NewSummaryControl>
  </div>
</template>

<style lang="scss" scoped>
.text-block {
  &__row {
    position: relative;
  }
}
.text-color {
  color: $content-black !important;
}
.text-black--text {
  color: $content-black !important;
}
.subtitle-1{
  span{
    line-height:28px !important;
    letter-spacing: 0.15px !important;
  }
  
}
:deep(.v-btn--icon.v-btn--density-default) {
  height: 36px !important;
  width: 36px !important;
  background: transparent;
}
.v-btn__content i {
  font-size: 16px !important;
  color: $close-icon-color;
}
.last-row {
  margin-bottom: 20px;
}

.relative-col {
  position: relative;
}

.additional-remove {
  top: 20px;
}

.remove {
  position: absolute;
  right: 0;
  &__icon {
    cursor: pointer;
  }
}

.add-new {
  &__title {
    font-weight: 500;
    margin-left: 10px;
  }
}
.form-container.deleteAbleItem {
  padding: 50px;
  margin-bottom:-45px !important;
}

:deep(.add-button__inner) {
  margin-top: -3px;
}
:deep(.addItemBtnContainer) {
  padding: 25px 50px 30px !important;
  i{
    padding: 12px !important;
    font-size: 16px !important;
  }
  .addItemBtn {
  max-width: unset !important;
}
}
@media (max-width: $tablet-width) {
  :deep(.summaryCard .header) {
    padding: 30px 20px !important;
  }
  .form-container {
    padding: 20px 10px;
  }
}
@media (max-width: $mobile-width) {
  :deep(.summaryCard .header) {
    padding: 30px 10px !important;
  }
  .form-container {
    padding: 20px 0px;
  }
  :deep(.v-btn--icon.v-btn--density-default) {
    height: 24px !important;
    width: 24px !important;
  }
}
</style>
