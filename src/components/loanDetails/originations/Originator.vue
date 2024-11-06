<script setup>
import { number } from "@/mixins/onlyNum";
import { useGeneralStore } from "@/stores/generalStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, ref } from "vue";
import moment from "moment";
import { phone } from "@/mixins/phoneFormat";
import { useDisplay } from 'vuetify'

const { sm } = useDisplay()
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const licenseTypes = ref([
  {
    text: "Private",
    value: "Private",
  },
  {
    text: "Public State",
    value: "PublicState",
  },
]);
const isDateMenu = ref(false);
const { isOnlyNum } = number();
const { getFormattedPhone } = phone();

const updateOrigination = (prop, value) => {
  const Origination = {
    ...origination.value,
    [prop]: value,
    OrginizationPartyRoleType: "LoanOriginationCompany",
    OriginatorPartyRoleType: "LoanOriginator",
  };
  borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, Origination });
};
const cols = computed(() => {
  return sm.value ? [4, 7]
       : [12, 12]
})

const validatePhone = (e) => {
  const target = e.target;
  if (target.value.length === 14 && e.keyCode !== 13) {
    e.preventDefault();
    return false;
  }
  return isOnlyNum(e);
};

const origination = computed(() => {
  return generalStore.currentLoan && generalStore.currentLoan.Origination
    ? generalStore.currentLoan.Origination
    : {};
});

const formattedDate = (date) => {
  return date ? moment(new Date(date)).format("MM/DD/YYYY") : "";
};

const setDate = (date) => {
  updateOrigination(
    "ApplicationSignedByLoanOriginatorDate",
    moment(date).format("YYYY-MM-DD")
  );
  isDateMenu.value = false;
};

const formattedPhone = computed(() => {
  if (origination.value.ContactPointTelephoneValue) {
    return getFormattedPhone(origination.value.ContactPointTelephoneValue);
  }
  return "";
});

const getDateObject = (dateStr) => {
  return dateStr ? new Date(dateStr) : null;
};
</script>

<template>
  <v-card light flat>
    <v-card-text class="pa-sm-4 pa-0">
      <v-row class="ma-0 pa-0 d-flex flex-wrap">
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >Originator Party Role Type</span
          >
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="origination.OriginatorPartyRoleType"
            readonly
            placeholder="Originator Party Role Type"
            hide-details
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >License Authority Level Type</span
          >
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            dense
            :items="licenseTypes"
            item-title="text"
            item-value="value"
            placeholder="License Authority Level Type"
            :model-value="origination.OriginatorLicenseAuthorityLevelType"
            @update:model-value="
              (value) => updateOrigination('OriginatorLicenseAuthorityLevelType', value)
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">License Identifier</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            class="input-field"
            hide-details
            placeholder="License Identifier"
            :model-value="origination.OriginatorLicenseIdentifier"
            @input="
              (e) => updateOrigination('OriginatorLicenseIdentifier', e.target.value)
            "
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >State License Authority Level Type</span
          >
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            dense
            :items="licenseTypes"
            item-title="text"
            item-value="value"
            placeholder="State License Authority Level Type"
            :model-value="origination.OriginatorStateLicenseAuthorityLevelType"
            @update:model-value="
              (value) =>
                updateOrigination('OriginatorStateLicenseAuthorityLevelType', value)
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >State License Identifier</span
          >
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            hide-details
            class="input-field"
            placeholder="State License Identifier"
            :model-value="origination.OriginatorStateLicenseIdentifier"
            @input="
              (e) => updateOrigination('OriginatorStateLicenseIdentifier', e.target.value)
            "
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">First Name</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            class="input-field"
            hide-details
            placeholder="First Name"
            :model-value="origination.FirstName"
            @input="(e) => updateOrigination('FirstName', e.target.value)"
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Middle Name</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            class="input-field"
            hide-details
            placeholder="Middle Name"
            :model-value="origination.MiddleName"
            @input="(e) => updateOrigination('MiddleName', e.target.value)"
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Last Name</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            hide-details
            class="input-field"
            placeholder="Last Name"
            :model-value="origination.LastName"
            @input="(e) => updateOrigination('LastName', e.target.value)"
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Suffix</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            class="input-field"
            hide-details
            placeholder="Suffix"
            :model-value="origination.SuffixName"
            @input="(e) => updateOrigination('SuffixName', e.target.value)"
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Email</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            hide-details
            placeholder="Email"
            class="input-field"
            :model-value="origination.ContactPointEmailValue"
            @input="(e) => updateOrigination('ContactPointEmailValue', e.target.value)"
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Phone</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            hide-details
            placeholder="Phone"
            class="input-field"
            :model-value="formattedPhone"
            @input="
              (e) =>
                updateOrigination(
                  'ContactPointTelephoneValue',
                  e.target.value ? e.target.value.replace(/[()]|-| /g, '') : ''
                )
            "
            @keypress="(e) => validatePhone(e)"
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Signature</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            hide-details
            class="input-field"
            placeholder="Signature"
            style="max-width: 300px"
          />
        </v-col>
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Signed Date</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
            v-model="isDateMenu"
          >
            <template #activator="{ props }">
              <v-text-field
                variant="underlined"
                label="Signed Date"
                class="date-input"
                :model-value="
                  formattedDate(origination.ApplicationSignedByLoanOriginatorDate)
                "
                prepend-icon="mdi-calendar-range"
                readonly
                v-bind="props"
                style="max-width: 300px !important"
                hide-details                
              />
            </template>
            <v-date-picker
              color="primary"
              :model-value="
                getDateObject(origination.ApplicationSignedByLoanOriginatorDate)
              "
              @update:model-value="(date) => setDate(date)"
            />
          </v-menu>
        </v-col>
      </v-row>
      <CustomButton
        value="Save"
        customClass="primary-button"
        @onHandleClick="generalStore.saveLoanPatches"
      />
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
:deep(.input-field) {
  input {
    padding-top: 4px !important;
    padding-bottom: 2px !important;
    padding-left: 0px !important;
    min-height: 23px;
    font-size: 13px !important;
    letter-spacing: normal !important;
  }
}
.ls-1 {
  letter-spacing: 0.1px !important;
  line-height: 22px !important;
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
.font-weight-medium {
  color: #00000099 !important;
}
.button{
  margin: 40px 0 15px 0px;
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
</style>