<script setup>
import { computed, ref } from "vue";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import moment from "moment";

const isLeaseholdExpDateMenu = ref(false);
const lenderInfoStore = useLenderInfoStore();

const propertyEstateTypes = ref([
  { text: "Fee Simple", value: "FeeSimple" },
  { text: "Leasehold", value: "Leasehold" },
]);

const relationshipVestingTypes = ref([
  { label: "Individual", value: "Individual" },
  {
    label: "Joint Tenants With Right Of Survivorship",
    value: "JointTenantsWithRightOfSurvivorship",
  },
  { label: "Life Estate", value: "LifeEstate" },
  { label: "Other", value: "Other" },
  { label: "Tenants By The Entirety", value: "TenantsByTheEntirety" },
  { label: "Tenants In Common", value: "TenantsInCommon" },
]);

const trustClassificationTypes = ref([
  { label: "Land Trust", value: "LandTrust" },
  { label: "Living Trust", value: "LivingTrust" },
]);

const nativeAmericanLandsTypes = ref([
  { label: "Fee Simple", value: "FeeSimple" },
  { label: "Individual Trust Land", value: "IndividualTrustLand" },
  { label: "Other", value: "Other" },
]);

const currentIndex = ref(0);

const updateTitleInformation = ({ prop, value }) => {
  let titleInformation = lenderInfoStore.getTitleInformation().length
    ? lenderInfoStore.getTitleInformation().map((item, i) => {
        item[prop] = currentIndex.value === i ? value : item[prop];
        return item;
      })
    : [{ [prop]: value }];
  if (prop === "ProposedTitleHeldBy" || prop === "CurrentTitleHeldBy") {
    const type = prop.split("Title")[0];
    titleInformation = titleInformation.map((item, i) =>
      currentIndex.value !== i ? item : { ...item, PropertyOwnerStatusType: type }
    );
  }
  lenderInfoStore.setTitleInformation(titleInformation);
};

const updateRadioOption = (prop, value) => {
  const titleInformation = lenderInfoStore.getTitleInformation().length
    ? lenderInfoStore.getTitleInformation().map((item, i) => {
        if (currentIndex.value === i) {
          item[prop] = value === item[prop] ? null : value;
        }
        if (!item[prop]) {
          delete item[prop];
        }
        return item;
      })
    : [{ [prop]: value }];
  lenderInfoStore.setTitleInformation(titleInformation);
};

const setLeaseholdDate = (date) => {
  const formatted = moment(new Date(date)).format("YYYY-MM-DD");
  updateTitleInformation({
    prop: "PropertyGroundLeaseExpirationDate",
    value: formatted,
  });
  isLeaseholdExpDateMenu.value = false;
};

const titleInfo = computed(() => {
  return lenderInfoStore.getTitleInformation().length
    ? lenderInfoStore.getTitleInformation()[currentIndex.value]
    : {};
});

const leaseholdExpirationDateFormatted = computed(() => {
  return titleInfo.value.PropertyGroundLeaseExpirationDate
    ? moment(new Date(titleInfo.value.PropertyGroundLeaseExpirationDate)).format(
        "DD/MM/YYYY"
      )
    : "";
});

const toggleRadioOption = (prop, value) => {
  if (titleInfo.value.PropertyEstateType === value) {
    updateRadioOption(prop, "");
  } else {
    updateRadioOption(prop, value);
  }
};

const getDateObject = (dateStr) => {
  return dateStr ? new Date(dateStr) : null;
};
</script>
<template>
  <v-row class="flex-wrap flex-column flex-sm-row mt-3">
    <v-col :sm="12" class="pa-0 mb-0 mt-3 d-flex justify-start loan-border-bottom">
      <p
        class="ma-0 px-3 subheader-1 font-weight-bold white--text black loan-border-bottom loan-form-chapter"
      >
        L2. Title Info
      </p>
    </v-col>
    <v-col :sm="6" class="property-input-main pa-2 loan-border-right loan-border-bottom">
      <span class="title" id="l2-1">
        Title to the Property Will be Held in What Name(s):
      </span>

      <v-text-field
        light
        variant="underlined"
        class="ml-2 property-input"
        :model-value="titleInfo.ProposedTitleHeldBy || ''"
        @input="
          (e) =>
            updateTitleInformation({
              prop: 'ProposedTitleHeldBy',
              value: e.target.value,
            })
        "
        placeholder="Title to the Property"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col :sm="6" class="property-input-main pa-2 loan-border-bottom">
      <span class="title" id="l2-2">
        For Refinance: Title to the Property is Currently Held in What Name(s):
      </span>
      <v-text-field
        light
        variant="underlined"
        class="ml-2 property-input"
        :model-value="titleInfo.CurrentTitleHeldBy || ''"
        @input="
          (e) =>
            updateTitleInformation({
              prop: 'CurrentTitleHeldBy',
              value: e.target.value,
            })
        "
        placeholder="Currently Held Title of the Property"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col :sm="6" class="pa-2 main-title-info loan-border-bottom loan-border-right">
      <span class="font-weight-bold title">Estate will be held in</span>

      <div
        class="d-flex pa-0 ma-0 mx-sm-1 flex-column flex-md-row date-picker"
        v-for="(status, index) in propertyEstateTypes"
        :key="status.value"
      >
        <span :id="'l2-3___' + index" class="align-self-md-center">
          <v-radio
            :label="status.text"
            :value="status.value"
            :model-value="titleInfo.PropertyEstateType"
            density="compact"
            class="mx-1 fee-simple-radio"
            hide-details
            @click="toggleRadioOption('PropertyEstateType', status.value)"
          />
        </span>
        <div class="d-flex w-sm-75 w-100">
          <v-menu
            v-if="status.value == 'Leasehold'"
            v-model="isLeaseholdExpDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="leaseholdExpirationDateFormatted"
                placeholder="Leasehold Expiration Date"
                prepend-icon="mdi-calendar-range"
                readonly
                style="max-width: 300px !important"
                hide-details
                class="ma-0 pa-0 align-self-center"
                variant="underlined"
              />
            </template>

            <v-date-picker
              :model-value="getDateObject(titleInfo.PropertyGroundLeaseExpirationDate)"
              @update:model-value="setLeaseholdDate"
              show-current="true"
              density="compact"
              color="primary"
              class="fee-date-picker"
            />
          </v-menu>

          <span
            class="ma-0 font-italic align-self-center"
            v-if="status.value == 'Leasehold'"
            >(mm/dd/yyyy)</span
          >
        </div>
      </div>
      <div class="mt-1">
        <span class="mt-3 font-weight-bold title"
          >Manner in Which Title Will be Held</span
        >
        <div class="pa-0 ma-0 mx-sm-1 d-flex flex-wrap">
          <v-row class="pa-0 ma-0 flex-wrap">
            <Radio
              class="radio-section-2 manner-section"
              :options="relationshipVestingTypes"
              :value="titleInfo.RelationshipVestingType"
              @change="(val) => updateRadioOption('RelationshipVestingType', val)"
            ></Radio>
          </v-row>
        </div>
      </div>
    </v-col>
    <v-col :sm="6" class="pa-2 loan-border-bottom d-flex flex-column">
      <span class="font-weight-bold">Trust Information</span>
      <div class="pa-0 ma-0 mx-sm-1">
        <Radio
          class="radio-section-2 trust-information"
          :options="trustClassificationTypes"
          :value="titleInfo.TrustClassificationType"
          @change="(val) => updateRadioOption('TrustClassificationType', val)"
        ></Radio>
      </div>
      <span class="mt-3-1 font-weight-bold title">Indian Country Land Tenure</span>
      <div class="pa-0 ma-0 mx-sm-1">
        <Radio
          class="radio-section-2 indian-country"
          :options="nativeAmericanLandsTypes"
          :value="titleInfo.NativeAmericanLandsType"
          @change="(val) => updateRadioOption('NativeAmericanLandsType', val)"
        >
        </Radio>
      </div>
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped>
.mt-3-1 {
  margin-top: 13px !important;
}
:deep(.radio-section-2) {
  .v-selection-control {
    gap: 10px;
    .v-label {
      white-space: nowrap !important;
      letter-spacing: normal;
    }
  }
  .v-selection-control--density-default {
    --v-selection-control-size: 24px !important;
  }
}
:deep(.manner-section) {
  .v-selection-control-group {
    display: flex;
    flex-direction: unset;
    flex-wrap: wrap;
    width: 84%;
  }
  .v-selection-control {
    min-width: 50% !important;
    .v-label {
      width: 100%;
      white-space: normal !important;
      line-height: 1;
    }
  }
}

:deep(.property-input) {
  input {
    padding-top: 8px !important;
    min-height: 20px !important;
    padding-bottom: 3px !important;
  }
  input::placeholder {
    letter-spacing: normal !important;
  }
}

:deep(.property-input-main) {
  padding: 8px 8px 7px !important;
}

:deep(.fee-simple-radio) {
  .v-selection-control__wrapper {
    height: 24px !important;
    width: 24px !important;
  }
  .v-label {
    margin-bottom: 2px !important;
    margin-left: 6px !important;
    letter-spacing: normal !important;
  }
}

:deep(.v-input__prepend) {
  padding-top: 0px !important;
  margin-right: 9px !important;
}
:deep(.date-picker) {
  &:nth-child(3) {
    margin-top: 4px !important;
  }
  input {
    min-height: 22px !important;
    padding-top: 0px !important;
    letter-spacing: normal !important;
    padding-bottom: 2px !important;
  }
}

:deep(.trust-information) {
  .v-label {
    margin-top: -3px !important;
  }
}
:deep(.indian-country) {
  .v-input__control {
    margin-top: -2px !important;
  }
}
.main-title-info {
  padding: 8px 8px 12px !important;
}
.title {
  letter-spacing: normal !important;
}

@media (max-width: $desktop-width) {
  :deep(.manner-section) {
    .v-selection-control-group {
      display: flex;
      flex-direction: unset;
      flex-wrap: wrap;
      width: 100%;
      @media (max-width: $lg-mobile-width) {
        flex-direction: column;
      }
    }
  }
}
</style>
