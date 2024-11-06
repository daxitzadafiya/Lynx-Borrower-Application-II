<script setup>
import moment from "moment";
import { ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useGeneralStore } from "@/stores/generalStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const { isOnlyNum } = number();

const holderTypes = ref([
  {
    text: "FNMA",
    value: "FNMA",
  },
]);

const isAppRecievedDateMenu = ref(false);
const isClosingDateMenu = ref(false);

const formattedDate = (date) => {
  return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
};

const setDate = (date, prop) => {
  borrowersStore.setCurrentLoan({
    ...generalStore.currentLoan,
    [prop]: moment(date).format("YYYY-MM-DD"),
  });
  isAppRecievedDateMenu.value = false;
  isClosingDateMenu.value = false;
};

const setLoanPop = (prop, value) => {
  borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, [prop]: value });
};
const getDateObject = (dateStr) => {
  return dateStr ? new Date(dateStr) : null;
};
</script>
<template>
  <v-card class="pb-1">
    <v-card-title class="p-4">General Loan Info</v-card-title>
    <v-card-text>
      <v-row class="ma-0 pa-0 flex-wrap">
        <v-col class="pa-1 d-flex" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center title">Loan Amount</span>
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            class="mx-1 my-0 input-field"
            variant="underlined"
            dense
            :model-value="getFormattedValue(generalStore.currentLoan.LoanAmount) || ''"
            @input="(e) => setLoanPop('LoanAmount', +e.target.value.replace(/,/g, ''))"
            placeholder="Loan Amount"
            hide-details
            min="0"
            prefix="$"
            @keypress="(e) => isOnlyNum(e, true)"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>
      </v-row>

      <v-row class="ma-0 pa-0 flex-wrap">
        <v-col class="pa-1 d-flex" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center date-title"
            >Application Received Date</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-menu
            v-model="isAppRecievedDateMenu"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                variant="underlined"
                label="Application Received Date"
                :model-value="
                  formattedDate(generalStore.currentLoan.ApplicationReceivedDate)
                "
                prepend-icon="mdi-calendar-range"
                readonly
                style="max-width: 300px !important"
                hide-details
                class="date-input"
              />
            </template>
            <v-date-picker
              color="primary"
              variant="underlined"
              :model-value="
                getDateObject(generalStore.currentLoan.ApplicationReceivedDate)
              "
              @update:model-value="(date) => setDate(date, 'ApplicationReceivedDate')"
            />
          </v-menu>
        </v-col>
      </v-row>

      <v-row class="ma-0 pa-0 flex-wrap">
        <v-col class="pa-1 d-flex" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center date-title"
            >Estimated Closing Date</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-menu
            v-model="isClosingDateMenu"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                variant="underlined"
                label="Estimated Closing Date"
                :model-value="
                  formattedDate(generalStore.currentLoan.EstimatedClosingDate)
                "
                prepend-icon="mdi-calendar-range"
                readonly
                style="max-width: 300px !important"
                hide-details
                class="date-input"
              />
            </template>
            <v-date-picker
              color="primary"
              variant="underlined"
              :model-value="getDateObject(generalStore.currentLoan.EstimatedClosingDate)"
              @update:model-value="(date) => setDate(date, 'EstimatedClosingDate')"
            />
          </v-menu>
        </v-col>
      </v-row>

      <v-row class="ma-0 pa-0 flex-wrap -mt-2">
        <v-col class="pa-1 d-flex" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center line-height"
            >Owner of existing Mortgage</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            dense
            clearable
            :items="holderTypes"
            item-title="text"
            item-value="value"
            placeholder="Owner of existing Mortgage select-input"
            :model-value="generalStore.currentLoan.CurrentFirstMortgageHolderType"
            @update:model-value="
              (value) => setLoanPop('CurrentFirstMortgageHolderType', value)
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>
      </v-row>

      <v-row class="ma-0 pa-0 flex-wrap">
        <v-col class="pa-1 d-flex" :lg="2" :cols="4">
          <span class="font-weight-medium align-self-center number-title"
            >Number of Financed Properties</span
          >
        </v-col>
        <v-col class="pa-1" :lg="10" :cols="6">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 financed-properties"
            dense
            :model-value="generalStore.currentLoan.TotalMortgagedPropertiesCount"
            @input="(e) => setLoanPop('TotalMortgagedPropertiesCount', +e.target.value)"
            placeholder="Number of Financed Properties"
            hide-details
            type="number"
            min="0"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>
      </v-row>

      <CustomButton
        value="Save"
        class="button"
        customClass="primary-button"
        @onHandleClick="generalStore.saveLoanPatches"
      />
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
.p-4 {
  padding: 16px;
}

:deep(.input-field) {
  input {
    padding-top: 3px !important;
    padding-bottom: 4px !important;
    padding-left: 4px !important;
    min-height: 23px;
    font-size: 13px !important;
  }
  .v-text-field__prefix {
    padding-top: 3px !important;
    padding-bottom: 0px !important;
    min-height: 23px;
    font-size: 13px !important;
  }
}

.title {
  margin-top: 2px !important;
  letter-spacing: 0.1px;
}
.font-weight-medium {
  color: #00000099 !important;
}
.date-title {
  letter-spacing: 0.1px;
  @media (max-width: $mobile_width) {
    text-wrap: wrap !important;
  }
}

:deep(.date-input) {
  label {
    font-size: 9.9px !important;
    margin-top: 4px !important;
    letter-spacing: normal !important;
  }
  input {
    padding-top: 21px !important;
    padding-bottom: 8px !important;
    padding-left: 0px !important;
    min-height: 23px;
    font-size: 13px !important;
  }
  .v-input__prepend {
    padding-top: 20px !important;
    padding-bottom: 0px !important;
    min-height: 23px;
    margin-right: 8px !important;
  }
}

:deep(.v-select) {
  .v-field__input {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    min-height: 26px;
    font-size: 13px !important;
  }
  .v-field__append-inner,
  .v-field__clearable {
    padding-top: 0px !important;
    padding-bottom: 2px !important;
    min-height: 23px;
  }
}

.line-height {
  line-height: 22px;
  letter-spacing: 0.1px !important;
}

.-mt-2 {
  margin-top: -2px !important;
}

:deep(.financed-properties) {
  .v-field__input {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
    min-height: 26px;
    font-size: 13px !important;
  }
  .v-field__append-inner,
  .v-field__clearable {
    padding-top: 0px !important;
    padding-bottom: 2px !important;
    min-height: 23px;
  }
}

.number-title {
  line-height: 22px !important;
  letter-spacing: 0.1px !important;
}

.button {
  margin-top: 31px !important;
  margin-left: -1px !important;
}
</style>
