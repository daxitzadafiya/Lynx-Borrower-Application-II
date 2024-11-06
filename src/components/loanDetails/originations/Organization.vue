<script setup>
import { computed, ref, watch } from "vue";
import { useGeneralStore } from "@/stores/generalStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { googleAutoComplete } from "@/mixins/googleAutoComplete.js";
import { useDisplay } from 'vuetify'

const { sm } = useDisplay()
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const { parseAddressData, geoLocate, inputId } = googleAutoComplete("autocomplete");
const formattedAddress = ref("");

const isGoogleAddressFound = ref(true);
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

const cols = computed(() => {
  return sm.value ? [4, 7]
       : [12, 12]
})

const updateOrigination = (prop, value) => {
  let Origination = {
    ...origination.value,
    [prop]: value,
    OrginizationPartyRoleType: "LoanOriginationCompany",
    OriginatorPartyRoleType: "LoanOriginator",
  };
  if (!value) {
    delete Origination[prop];
  }
  borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, Origination });
};

const handleAddressData = (inputId, addressData) => {
  isGoogleAddressFound.value = !!addressData;
  if (addressData) {
    isGoogleAddressFound.value = !(
      Object.keys(addressData).length === 1 && Object.keys(addressData)[0] === "name"
    );
  }
  if (isGoogleAddressFound.value) {
    const Origination = { ...origination.value, ...addressData };
    borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, Origination });
  }
};
watch(
  () => borrowersStore.autoCompleteAddress,
  (newValue) => {
    handleAddressData(newValue.inputId, newValue.value);
  },
  { deep: true }
);

const findAddressData = (value) => {
  if (value && isGoogleAddressFound.value) {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=YOUR_API_KEY&language=en`
    )
      .then((stream) => stream.json())
      .then((data) => {
        if (data.results.length) {
          parseAddressData(data.results[0]);
          formattedAddress.value = "";  // Now using .value to update the ref
        }
        isGoogleAddressFound.value = false;
      })
      .catch((error) => console.error(error));
  } else if (!isGoogleAddressFound.value) {
    const Origination = { ...origination.value, AddressLineText: value };
    borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, Origination });
  }
};

const origination = computed(() => {
  return generalStore.currentLoan && generalStore.currentLoan.Origination
    ? generalStore.currentLoan.Origination
    : {};
});

const address = computed(() => {
  const keys = ["AddressLineText", "CityName", "StateCode", "PostalCode"];
  if (origination.value) {
    if (!isGoogleAddressFound.value) {
      return origination.value.AddressLineText;
    }
    return keys.reduce((acc, cur) => {
      if (origination.value[cur]) {
        acc += `${origination.value[cur]}${cur === "PostalCode" ? " " : ", "}`;
      }
      return acc;
    }, "");
  }
  return formattedAddress;
});
</script>
<template>
  <v-card class="card" flat>
    <v-card-text class="pa-sm-4 pa-0">
      <v-row class="ma-0 pa-0 d-flex flex-wrap">
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Organization Name</span>
        </v-col>
        <v-col class="pa-1" :md="7" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="origination.FullName"
            @input="(e) => updateOrigination('FullName', e.target.value)"
            placeholder="Organization Name"
            hide-details
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Address</span>
        </v-col>
        <v-col class="pa-1" :md="7" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            class="input-field"
            :id="inputId"
            @focus="geoLocate"
            dense
            :model-value="origination.AddressLineText"
            @update:model-value="(e) => findAddressData(e)"
            placeholder="Organization Name"
            hide-details
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Unit</span>
        </v-col>
        <v-col class="pa-1" :md="7" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            hide-details
            placeholder="Unit #"
            class="input-field"
            :model-value="origination.AddressUnitIdentifier"
            @input="(e) => updateOrigination('AddressUnitIdentifier', e.target.value)"
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :lg="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">City</span>
        </v-col>
        <v-col class="pa-1" :lg="7" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            class="input-field"
            hide-details
            placeholder="City"
            :model-value="origination.CityName"
            @input="(e) => updateOrigination('CityName', e.target.value)"
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :lg="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">State</span>
        </v-col>
        <v-col class="pa-1" :lg="7" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            class="input-field"
            hide-details
            placeholder="State"
            :model-value="origination.StateCode"
            @input="(e) => updateOrigination('StateCode', e.target.value)"
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :lg="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Postal Code</span>
        </v-col>
        <v-col class="pa-1" :lg="7" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            hide-details
            class="input-field"
            placeholder="Postal Code"
            :model-value="origination.PostalCode"
            @input="(e) => updateOrigination('PostalCode', e.target.value)"
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :lg="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >Organization Party Role Type</span
          >
        </v-col>
        <v-col class="pa-1" :lg="7" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            hide-details
            readonly
            class="input-field"
            placeholder="Organization Party Role Type"
            :model-value="origination.OrginizationPartyRoleType"
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :lg="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >License Authority Level Type</span
          >
        </v-col>
        <v-col class="pa-1" :lg="7" :cols="cols[1]">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            dense
            :items="licenseTypes"
            item-title="text"
            item-value="value"
            placeholder="License Authority Level Type"
            :model-value="origination.OrganizationLicenseAuthorityLevelType"
            @update:model-value="
              (value) => updateOrigination('OrganizationLicenseAuthorityLevelType', value)
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :lg="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">License Identifier</span>
        </v-col>
        <v-col class="pa-1" :lg="7" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            class="input-field"
            hide-details
            placeholder="License Identifier"
            :model-value="origination.OrganizationLicenseIdentifier"
            @input="
              (e) => updateOrigination('OrganizationLicenseIdentifier', e.target.value)
            "
            style="max-width: 300px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :lg="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >State License Authority Level Type</span
          >
        </v-col>
        <v-col class="pa-1" :lg="7" :cols="cols[1]">
          <v-select
            variant="underlined"
            class="mx-1 my-0"
            dense
            :items="licenseTypes"
            item-title="text"
            item-value="value"
            placeholder="State License Authority Level Type"
            :model-value="origination.OrganizationStateLicenseAuthorityLevelType"
            @update:model-value="
              (value) =>
                updateOrigination('OrganizationStateLicenseAuthorityLevelType', value)
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :lg="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >State License Identifier</span
          >
        </v-col>
        <v-col class="pa-1" :lg="7" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            dense
            hide-details
            class="input-field"
            placeholder="State License Identifier"
            :model-value="origination.OrganizationStateLicenseIdentifier"
            @input="
              (e) =>
                updateOrigination('OrganizationStateLicenseIdentifier', e.target.value)
            "
            style="max-width: 300px"
          />
        </v-col>
      </v-row>
      <CustomButton @click="generalStore.saveLoanPatches" value="Save" customClass="primary-button"></CustomButton>
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
  line-height: 29px !important;
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
.card{
  margin-top: 7px !important;
}
.button{
  margin: 30px 0 15px 0px;
}
</style>