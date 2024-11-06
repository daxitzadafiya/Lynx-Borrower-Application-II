<script setup>
import { useGeneralStore } from "@/stores/generalStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, ref } from "vue";
import { useDisplay } from 'vuetify'

const { sm } = useDisplay()
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();

const takenTypes = ref([
  {
    text: "Email",
    value: "Email",
  },
  {
    text: "Face To Face",
    value: "FaceToFace",
  },
  {
    text: "Fax",
    value: "Fax",
  },
  {
    text: "Internet",
    value: "Internet",
  },
  {
    text: "Mail",
    value: "Mail",
  },
  {
    text: "Telephone",
    value: "Telephone",
  },
]);

const cols = computed(() => {
  return sm.value ? [4, 12]
       : [12, 12]
})

const updateDemographics = (prop, value) => {
  const updated = { ...demographics.value, [prop]: value };
  borrowersStore.updateBorrower({ prop: "Demographics", value: updated });
};

const demographics = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Demographics
    ? borrowersStore.Borrower.Demographics
    : {};
});
</script>

<template>
  <v-card class="pb-1">
    <v-card-title class="p-4">Demographics Collection Method</v-card-title>
    <v-card-text>
      <v-row class="ma-0 mb-2 pa-0 d-flex flex-wrap -ml-1">
        <v-col class="pa-1" lg="12" :cols="cols[1]">
          <v-checkbox
            label="HMDA Ethnicity Collected Based On Visual Observation Or Surname Indicator"
            :model-value="
              demographics.HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator
            "
            @update:model-value="
              (value) =>
                updateDemographics(
                  'HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator',
                  value
                )
            "
            class="ma-0 pa-0"
            dense
            hide-details
          />
        </v-col>
      </v-row>

      <v-row class="ma-0 mb-2 pa-0 d-flex flex-wrap -ml-1">
        <v-col class="pa-1" lg="12" :cols="cols[1]">
          <v-checkbox
            label="HMDA Gender Collected Based On Visual Observation Or Name Indicator"
            :model-value="
              demographics.HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator
            "
            @update:model-value="
              (value) =>
                updateDemographics(
                  'HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator',
                  value
                )
            "
            class="ma-0 pa-0"
            dense
            hide-details
          />
        </v-col>
      </v-row>

      <v-row class="ma-0 mb-1 pa-0 d-flex flex-wrap -ml-1">
        <v-col class="pa-1" lg="12" :cols="cols[1]">
          <v-checkbox
            label="HMDA Race Collected Based On Visual Observation Or Surname Indicator"
            :model-value="
              demographics.HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator
            "
            @update:model-value="
              (value) =>
                updateDemographics(
                  'HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator',
                  value
                )
            "
            class="ma-0 pa-0"
            dense
            hide-details
          />
        </v-col>
      </v-row>

      <v-row class="ma-0 pa-0 d-flex flex-wrap">
        <v-col class="pa-1 d-flex" md="3" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >Application Taken Method Type</span
          >
        </v-col>
        <v-col class="pa-1" md="6" :cols="cols[1]">
          <v-select
            class="mx-1 my-0"
            variant="underlined"
            light
            dense
            :items="takenTypes"
            item-title="text"
            item-value="value"
            placeholder="Application Taken Method Type"
            :model-value="demographics.ULADApplicationTakenMethodType"
            @update:model-value="
              (value) => updateDemographics('ULADApplicationTakenMethodType', value)
            "
            :menu-props="{ light: true }"
            style="max-width: 300px; max-height: 33px"
          />
        </v-col>
      </v-row>

      <CustomButton
        customClass="primary-button"
        class="button"
        value="Save"
        @onHandleClick="generalStore.saveLoanPatches"
      ></CustomButton>
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
.p-4 {
  padding: 16px;
}
.ls-1 {
  letter-spacing: 0.1px !important;
  line-height: 22px !important;
}
:deep(.v-select) {
  .v-field__input {
    padding-top: 2px !important;
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
.v-card-text{
  margin-top: -4px;
}
:deep(.v-checkbox) {
  .v-selection-control{
    height: auto !important;
    label{
      font-size: 13px;
    }
  }
}
.button{
  margin-top: 31px;
}
.font-weight-medium {
  color: #00000099 !important;
}
.-ml-1{
  margin-left: -1px !important;
}
</style>