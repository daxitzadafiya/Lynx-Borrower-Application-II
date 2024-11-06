<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { phone } from "@/mixins/phoneFormat";
import { computed, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import moment from "moment";
import JobDetailsData from "@/components/employment/JobDetails/JobDetailsData.vue";
import CompensationDetailsData from "@/components/employment/compensationDetails/CompensationDetailsData.vue";
import { useGeneralStore } from "@/stores/generalStore";

const { getFormattedPhone } = phone();
const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const headers = ref([
  {
    title: "Income Type",
    key: "IncomeType",
  },
  {
    title: "Gross Monthly Amount",
    key: "CurrentIncomeMonthlyTotalAmount",
  },
]);

const dataBeforeEdit = ref([]);
const isDialog = ref(false);

const addEmployment = () => {
  const employments = [
    ...borrowersStore.getBorrowerEmployment(),
    { EmploymentClassificationType: "Primary" },
  ];
  borrowersStore.updateBorrower({ prop: "Employment", value: employments });
};

const removeEmployment = () => {
  let filtered = borrowersStore
    .getBorrowerEmployment()
    .filter((item) => item.EmploymentClassificationType !== "Primary");
  borrowersStore.updateBorrower({ prop: "Employment", value: filtered });
  isDialog.value = false;
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  if (currentEmployment.value != null) {
    dataBeforeEdit.value = JSON.parse(JSON.stringify(currentEmployment.value));
  } else {
    currentEmployment.value = null;
  }
};

const onCancelClicked = () => {
  const Employments = [...borrowersStore.getBorrowerEmployment()];
  const primaryIndex = Employments.findIndex(
    (item) => item && item.EmploymentClassificationType === "Primary"
  );
  if (primaryIndex !== -1) {
    Employments[primaryIndex] = dataBeforeEdit.value;
  } else {
    if (dataBeforeEdit.value != null) {
      Employments.push(dataBeforeEdit.value);
    }
  }
  borrowersStore.updateBorrower({ prop: "Employment", value: Employments });
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const isFormValid = computed(() => {
  const emp = currentEmployment.value;
  const isBasicInfoValid =
    emp.EmploymentPositionDescription !== "" &&
    emp.EmploymentStartDate !== null &&
    (duration.value.years !== 0 || duration.value.months !== 0) &&
    emp.FullName !== "";
  const isSelfEmployedValid =
    emp.EmploymentBorrowerSelfEmployedIndicator !== null &&
    ((emp.EmploymentBorrowerSelfEmployedIndicator === false &&
      emp.EmployedByFamilyMember !== null &&
      emp.EmployedByPartyToTransaction !== null) ||
      (emp.EmploymentBorrowerSelfEmployedIndicator === true &&
        !isNaN(emp.EmploymentMonthlyIncomeAmount) &&
        emp.EmploymentMonthlyIncomeAmount !== 0 &&
        emp.OwnershipInterestType !== undefined));
  return isBasicInfoValid && isSelfEmployedValid;
});

const duration = computed(() => {
  let years = 0;
  let months = 0;
  if (currentEmployment.value.EmploymentTimeInLineOfWorkMonthsCount) {
    months = currentEmployment.value.EmploymentTimeInLineOfWorkMonthsCount % 12;
    years = (currentEmployment.value.EmploymentTimeInLineOfWorkMonthsCount - months) / 12;
  }
  return { years, months };
});

const currentEmployment = computed(() => {
  if (borrowersStore.getBorrowerEmployment().length) {
    return borrowersStore
      .getBorrowerEmployment()
      .find((item) => item.EmploymentClassificationType === "Primary");
  }
  return null;
});

const getFormattedDate = (date) => {
  return date ? moment(new Date(date)).format("MM/YYYY") : "";
};

const address = computed(() => {
  const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
  if (currentEmployment.value) {
    return keys.reduce((acc, cur) => {
      if (currentEmployment.value[cur]) {
        acc += `${currentEmployment.value[cur]}${cur === "PostalCode" ? " " : ", "}`;
      }
      return acc;
    }, "");
  }
  return "";
});

const percentage = computed(() => {
  if (currentEmployment.value.OwnershipInterestType == undefined) return "";
  return currentEmployment.value.OwnershipInterestType === "GreaterThanOrEqualTo25Percent"
    ? "25% or Greater"
    : "< 25%";
});

const income = computed(() => {
  return currentEmployment.value.Income || [];
});

const total = computed(() => {
  return income.value.length
    ? income.value.reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
            ? +cur.CurrentIncomeMonthlyTotalAmount
            : 0),
        0
      )
    : 0;
});


</script>

<template>
  <NewSummaryControl header="Current Employment/Self Employment and Income" :submitDisabled="!isFormValid" @edit="onEditClicked" @cancel="onCancelClicked" @save="onSaveClicked">
    <template v-slot:displayContent>
      <v-row class="summary-content-container">
        <template v-if="currentEmployment">
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Company Name:</div>
            <span>{{ currentEmployment.companyName || "" }}</span>
          </v-col>

          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Title/Position:</div>
            <span>{{ currentEmployment.EmploymentPositionDescription }}</span>
          </v-col>

          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Address:</div>
            <span>{{ address }}</span>
          </v-col>

          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Monthly Income:</div>
            <span>{{ getFormattedValue(total) || 0 }}.00</span>
          </v-col>

          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">City:</div>
            <span>{{ currentEmployment.CityName }}</span>
          </v-col>

          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Start Date:</div>
            <span>{{
              getFormattedDate(currentEmployment.EmploymentStartDate, "MM/YYYY")
            }}</span>
          </v-col>

          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">ST:</div>
            <span>{{ currentEmployment.StateCode }}</span>
            <div class="summaryTitle ml-12">ZIP:</div>
            <span>{{ currentEmployment.PostalCode }}</span>
          </v-col>

          <v-col sm="6" cols="12" class="summaryItem">
            <CheckBox
              :hideDetails="true"
              class="defaultCheckbox employeeCheckbox mt-0 pt-0"
              :isChecked="currentEmployment.EmploymentBorrowerSelfEmployedIndicator"
              :disabled="true"
            />
            <span class="employeeTitle">Self-employed/Business Owner</span>
          </v-col>

          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Work Phone:</div>
            <span>{{
              currentEmployment.PhoneNumber
                ? getFormattedPhone(currentEmployment.PhoneNumber)
                : ""
            }}</span>
          </v-col>

          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Ownership Share:</div>
            <span>{{ percentage }}</span>
          </v-col>

          <v-col sm="6" md="5" cols="12" class="summaryItem position-relative pr-0">
            <v-data-table
              class="content-table"
              :headers="headers"
              :items="income"
              disable-sort
              disable-pagination
              hide-default-footer
              :mobile-breakpoint="0"
            >
              <template v-slot:[`item.CurrentIncomeMonthlyTotalAmount`]="{ item }">
                <span
                  >${{
                    getFormattedValue(item.CurrentIncomeMonthlyTotalAmount) || 0
                  }}</span
                >
              </template>
              <template v-slot:[`body.append`]>
                <tr class="appended-row">
                  <td class="text-end font-weight-bold">Total:</td>
                  <td class="font-weight-bold">${{ getFormattedValue(total) }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </template>

        <template v-else>
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="summaryValue">No current employment.</div>
          </v-col>
        </template>
      </v-row>
    </template>
    <template v-slot:editContent>
      <v-form class="form-outer-container" fast-fail>
        <v-row class="form-container">
          <template v-if="currentEmployment">
            <v-col sm="12" cols="12">
              <div class="remove-wrapper">
                <v-icon class="remove-additional" color="error" @click="isDialog = true">
                  mdi-close
                </v-icon>
              </div>
            </v-col>

            <JobDetailsData
              status="Current"
              classification="Primary"
              :isEmploymentTypeAndPartyTransaction="true"
            />

            <v-col cols="12" sm="12" >
              <CompensationDetailsData status="Current" classification="Primary" />
            </v-col>
          </template>

          <v-col v-if="!currentEmployment" cols="12" sm="12" class="itemContainer">
            <v-btn dense plain elevation="0" @click="addEmployment" class="addItemBtn">
              <v-icon small>mdi-plus</v-icon>
              <span class="addBtnText">Add Current Employment</span>
            </v-btn>
          </v-col>
        </v-row>

        <v-dialog v-model="isDialog" max-width="390" class="confirm-modal">
          <v-card>
            <v-card-title class="mb-4 text-black--text">
              <span style="word-break: break-word; text-align: center">
                Please, confirm you are going to remove employment information?
              </span>
            </v-card-title>
            <v-card-text>
              <v-row class="justify-space-around">
                <CustomButton
                  customClass="primary-button"
                  value="Yes"
                  width="130px"
                  @onHandleClick="removeEmployment"
                />
                <CustomButton
                  value="No"
                  width="130px"
                  customClass="button-no"
                  :isOutlined="true"
                  @onHandleClick="isDialog = false"
                />
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-form>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
.form-container{
  margin: -10px;
}
:deep(.deleteAbleItem){
  margin:30px 0px !important
}
:deep(.v-data-table-header__content span) {
  font-size: 12px !important;
}
:deep(.v-table--density-default) {
  --v-table-header-height: 48px !important;
  --v-table-row-height: 48px !important;
}

:deep(.v-checkbox .v-selection-control--density-default) {
  --v-selection-control-size: 32px;
}
:deep(.v-checkbox .v-selection-control) {
  min-height: 20px;
  i{
    font-size: 24px
  }
}
.remove-wrapper{
  text-align: end;
  width: 100%;
  padding: 0px !important;
  position: relative;
}
.remove-additional{
  position: absolute;
  top: -10px;
  right: -5px;
  cursor: pointer;
}
.v-application .text-error {
  color: $summary-close-icon-color !important;
  caret-color: $summary-close-icon-color !important;
}
:deep(.employeeTitle){
  margin-top: 2px !important;
}
@media (max-width: $mobile-width) {
  .form-container {
    padding: 30px 20px;
  }
  :deep(.v-radio-group){
    margin-top: 16px;
  }
}
:deep(.v-input__control),
:deep(.v-selection-control-group) {
  max-height: unset !important;
}

.confirm-modal .v-card-title{
  white-space: wrap !important;
  text-align: center !important;
  padding: 10px 35px !important;
}
.confirm-modal .v-row{
  gap: 10px;
}
</style>
