<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import moment from "moment";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useEmployMentStore } from "@/stores/employmentStore";
import { phone } from "@/mixins/phoneFormat";
import { computed, ref } from "vue";
import JobDetailsData from "@/components/employment/JobDetails/JobDetailsData.vue";
import { useGeneralStore } from "@/stores/generalStore";
import CompensationDetailsData from "@/components/employment/compensationDetails/CompensationDetailsData.vue";

const borrowersStore = useBorrowersStore();
const employmentStore = useEmployMentStore();
const { getFormattedPhone } = phone();
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

const getFormattedDate = (date) => {
  return date ? moment(new Date(date)).format("MM/YYYY") : "";
};

const isDialog = ref(false);
const removingIndex = ref(false);
const dataBeforeEdit = ref([]);

const additionalExperienceAddress = (additionalExperience) => {
  const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
  if (additionalExperience) {
    return keys.reduce((acc, cur) => {
      if (additionalExperience[cur]) {
        acc += `${additionalExperience[cur]}${cur === "PostalCode" ? " " : ", "}`;
      }
      return acc;
    }, "");
  }
  return "";
};

const additionalEmploymentTotal = (additionalEmployment) => {
  return additionalEmployment.Income && additionalEmployment.Income.length
    ? additionalEmployment.Income.reduce(
        (acc, cur) =>
          (acc += !isNaN(cur.CurrentIncomeMonthlyTotalAmount)
            ? +cur.CurrentIncomeMonthlyTotalAmount
            : 0),
        0
      )
    : 0;
};
const currentEmployment = computed(() => {
  if (borrowersStore.getBorrowerEmployment().length) {
    return borrowersStore
      .getBorrowerEmployment()
      .find((item) => item.EmploymentClassificationType === "Primary");
  }
  return null;
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
    {
      EmploymentClassificationType: "Secondary",
      EmploymentBorrowerSelfEmployedIndicator: true,
    },
  ];
  borrowersStore.updateBorrower({ prop: "Employment", value: employments });
};

const setRemoveIndex = (index) => {
  removingIndex.value = index;
  isDialog.value = true;
};

const removeEmployment = () => {
  const additionalFiltered = employmentStore
    .getAdditionalEmployments()
    .filter((item, i) => i !== removingIndex.value);
  let filtered = borrowersStore
    .getBorrowerEmployment()
    .filter((item) => item.EmploymentClassificationType !== "Secondary");
  filtered.push(...additionalFiltered);
  borrowersStore.updateBorrower({ prop: "Employment", value: filtered });
  isDialog.value = false;
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(
    JSON.stringify(employmentStore.getAdditionalEmployments())
  );
};

const onCancelClicked = () => {
  const filtered = borrowersStore.getBorrowerEmployment().length
    ? borrowersStore
        .getBorrowerEmployment()
        .filter((item) => item.EmploymentClassificationType !== "Secondary")
    : [];
  borrowersStore.updateBorrower({
    prop: "Employment",
    value: [...filtered, ...dataBeforeEdit.value],
  });
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const additionalEmploymentExperience = (employment) => {
  if (!employment.EmploymentStartDate) {
    return "";
  }

  const today = new Date();
  const start = new Date(employment.EmploymentStartDate);

  const yearsDiff = today.getFullYear() - start.getFullYear();
  const monthsDiff = today.getMonth() - start.getMonth();

  let result = "";

  if (yearsDiff > 0) {
    if (yearsDiff === 1) {
      result += "1 year";
    } else {
      result += `${yearsDiff} years`;
    }
  }

  if (monthsDiff > 0) {
    if (result !== "") {
      result += " and ";
    }

    if (monthsDiff === 1) {
      result += "1 month";
    } else {
      result += `${monthsDiff} months`;
    }
  }

  return result;
};

const duration = (emp) => {
  let years = 0;
  let months = 0;
  if (emp.EmploymentTimeInLineOfWorkMonthsCount) {
    months = emp.EmploymentTimeInLineOfWorkMonthsCount % 12;
    years = (emp.EmploymentTimeInLineOfWorkMonthsCount - months) / 12;
  }
  return { years, months };
};

const isFormValid = computed(() => {
  const allEmploymentsValid = employmentStore.getAdditionalEmployments().every((emp) => {
    const isBasicInfoValid =
      emp.EmploymentPositionDescription !== "" &&
      emp.EmploymentStartDate !== null &&
      emp.FullName !== "" &&
      (duration(emp).months !== 0 || duration(emp).years !== 0);

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
  return allEmploymentsValid;
});
</script>
<template>
  <NewSummaryControl
    header="Additional Employment/Self Employment and Income"
    :submitDisabled="!isFormValid"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row class="summary-content-container">
        <template v-if="employmentStore.getAdditionalEmployments().length === 0">
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="summaryValue">No additional employment.</div>
          </v-col>
        </template>

        <template
          v-for="(
            additionalEmployment, index
          ) in employmentStore.getAdditionalEmployments()"
          :key="index"
        >
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Company Name:</div>
            <span>{{ additionalEmployment.companyName || "" }}</span>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Title/Position:</div>
            <span>{{ additionalEmployment.EmploymentPositionDescription }}</span>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Address:</div>
            <span>{{ additionalExperienceAddress(additionalEmployment) }}</span>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Monthly Income:</div>
            <span
              >{{
                getFormattedValue(additionalEmployment.EmploymentMonthlyIncomeAmount) ||
                0
              }}.00</span
            >
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">City:</div>
            <span>{{ additionalEmployment.CityName }}</span>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Start Date:</div>
            <span>{{
              getFormattedDate(additionalEmployment.EmploymentStartDate, "MM/YYYY")
            }}</span>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">ST:</div>
            <span>{{ additionalEmployment.StateCode }}</span>
            <div class="summaryTitle ml-12">ZIP:</div>
            <span>{{ additionalEmployment.PostalCode }}</span>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem">
            <CheckBox
              class="defaultCheckbox employeeCheckbox mt-0 pt-0"
              :value="additionalEmployment.EmploymentBorrowerSelfEmployedIndicator"
              :hideDetails="true"
              :disabled="true"
            />
            <span class="employeeTitle">Self-employed/Business Owner</span>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Work Phone:</div>
            <span>{{
              additionalEmployment.PhoneNumber
                ? getFormattedPhone(additionalEmployment.PhoneNumber)
                : ""
            }}</span>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Ownership Share:</div>
            <span>{{ percentage }}</span>
          </v-col>
          <v-col sm="6" md="5" cols="12" class="summaryItem position-relative">
            <v-data-table
              class="content-table"
              :headers="headers"
              :items="additionalEmployment.Income"
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
                  <td class="font-weight-bold">
                    ${{
                      getFormattedValue(additionalEmploymentTotal(additionalEmployment))
                    }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </template>
      </v-row>
    </template>
    <template v-slot:editContent>
      <v-form class="form-outer-container" fast-fail>
        <v-row class="form-container">
          <template
            v-for="(item, index) in employmentStore.getAdditionalEmployments()"
            :key="index"
          >
            <v-col sm="12" cols="12">
              <div class="remove-wrapper">
                <v-icon
                  class="remove-additional"
                  color="error"
                  @click="setRemoveIndex(index)"
                >
                  mdi-close
                </v-icon>
              </div>
            </v-col>

            <!-- :key="index" -->
            <JobDetailsData
              :index="index"
              :status="'Additional' + index"
              classification="Secondary"
              :isEmploymentTypeAndPartyTransaction="true"
            />

            <v-col cols="12" sm="12">
              <CompensationDetailsData
                :index="index"
                :status="'Additional' + index"
                classification="Secondary"
              />
            </v-col>
          </template>

          <v-col cols="12" sm="12" class="itemContainer">
            <v-btn
              dense
              plain
              elevation="0"
              @click="addEmployment"
              class="addItemBtn addEmploymentBtn"
            >
              <v-icon small>mdi-plus</v-icon>
              <span class="addBtnText">Add Additional Employment</span>
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
:deep(.v-data-table-header__content span) {
  font-size: 12px !important;
  color: $table-header-text-color !important
}
:deep(.deleteAbleItem){
  margin:30px 0px !important
}
:deep(.v-table--density-default) {
  --v-table-header-height: 48px !important;
  --v-table-row-height: 48px !important;
}
:deep(.v-card-title) {
  white-space: normal !important;
}
:deep(.v-checkbox .v-selection-control--density-default) {
  --v-selection-control-size: 32px;
}
:deep(.v-checkbox .v-selection-control) {
  min-height: 20px;
  i{
    font-size: 24px;
  }
}
:deep(.addItemBtn i) {
  padding: 12px !important;
  font-size: 16px !important;
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
</style>
