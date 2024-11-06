<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { computed, ref } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import moment from "moment";
import { phone } from "@/mixins/phoneFormat";
import JobDetailsData from "@/components/employment/JobDetails/JobDetailsData.vue";
import { useGeneralStore } from "@/stores/generalStore";

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();
const { getFormattedPhone } = phone();
const dataBeforeEdit = ref([]);
const isDialog = ref(false);

const currentEmployment = computed(() => {
  if (borrowersStore.getBorrowerEmployment().length) {
    const employment = borrowersStore
      .getBorrowerEmployment()
      .find((item) => item.EmploymentStatusType === "Previous");
    return employment;
  }
  return null;
});

const getFormattedDate = (date) => {
  return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
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

const addEmployment = () => {
  const employments = [
    ...borrowersStore.getBorrowerEmployment(),
    { EmploymentStatusType: "Previous" },
  ];
  borrowersStore.updateBorrower({ prop: "Employment", value: employments });
};

const removeEmployment = () => {
  const filtered = borrowersStore
    .getBorrowerEmployment()
    .filter((item) => item.EmploymentStatusType !== "Previous");
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
    dataBeforeEdit.value = null;
  }
};

const onCancelClicked = () => {
  const Employments = [...borrowersStore.getBorrowerEmployment()];
  const primaryIndex = Employments.findIndex(
    (item) => item && item.EmploymentStatusType === "Previous"
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
    emp.EmploymentEndDate !== null &&
    emp.FullName !== "" &&
    !isNaN(emp.EmploymentMonthlyIncomeAmount);
  return isBasicInfoValid;
});

</script>
<template>
  <NewSummaryControl header="Previous Employment/Self Employment and Income" :submitDisabled="!isFormValid" @edit="onEditClicked" @cancel="onCancelClicked" @save="onSaveClicked">
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
            <span
              >{{
                getFormattedValue(currentEmployment.EmploymentMonthlyIncomeAmount) || 0
              }}.00</span
            >
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
              v-model="currentEmployment.EmploymentBorrowerSelfEmployedIndicator"
              :disabled="true"
              :hideDetails="true"
              class="defaultCheckbox employeeCheckbox mt-0 pt-0"
            ></CheckBox>
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
        </template>

        <template v-else>
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="summaryValue">No previous employment.</div>
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
                <v-icon class="remove-previous" color="error" @click="isDialog = true">
                  mdi-close
                </v-icon>
              </div>
            </v-col>

            <JobDetailsData status="Previous" classification="Primary" />
          </template>

          <v-col v-if="!currentEmployment" cols="12" sm="12" class="itemContainer">
            <v-btn dense plain elevation="0" @click="addEmployment" class="addItemBtn">
              <v-icon small>mdi-plus</v-icon>
              <span class="addBtnText">Add Previous Employment</span>
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
:deep(.v-selection-control--density-default) {
  --v-selection-control-size: 32px;
}
:deep(.employeeTitle){
  margin-top: 2px !important;
}
:deep(.v-checkbox .v-selection-control) {
  min-height: 20px;
  i{
    font-size: 24px;
  }
}
@media (max-width: $mobile-width) {
  .form-container {
    padding: 30px 20px;
  }
}
.confirm-modal .v-card-title{
  white-space: wrap !important;
  text-align: center !important;
  padding: 10px 35px !important;
}
.confirm-modal .v-row{
  gap: 10px;
}
.remove-wrapper{
  text-align: end;
  width: 100%;
  padding: 0px !important;
  position: relative;
}
.remove-previous{
  position: absolute;
  top: -10px;
  right: -5px;
  cursor: pointer;
}
</style>
