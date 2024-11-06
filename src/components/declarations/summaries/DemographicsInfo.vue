<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, ref } from "vue";
import {
  raceOptionConstants,
} from "@/models/constants";
import { useGeneralStore } from "@/stores/generalStore";
import DemographicsInformation  from '@/components/declarations/demographics/Main.vue'
const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();

const raceOptions = ref(raceOptionConstants);
const dataBeforeEdit = ref(null);

const demographics = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Demographics
    ? borrowersStore.Borrower.Demographics
    : {};
});

const ethnicities = computed(() => {
  return demographics.value.Ethnicities || [];
});

const races = computed(() => {
  return demographics.value.Races || [];
});

const getEthnicity = () => {
  if (demographics.value.HMDAEthnicityRefusalIndicator) {
    return "I do not wish to provide this information";
  }
  return !ethnicities.value[0]
    ? ""
    : ethnicities.value[0].ULADHMDAEthnicityType
      ? ethnicities.value[0].ULADHMDAEthnicityType.replace(/([a-z])([A-Z])/g, "$1 $2")
      : "";
};

const onEditClicked = () => {
  generateOnCancelData();
};
const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(demographics.value));
};

const onCancelClicked = () => {
  borrowersStore.updateBorrower({ prop: "Demographics", value: dataBeforeEdit.value });
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};
</script>
<template>
  <NewSummaryControl header="Demographic Information (ethnicity, sex, and race)" @edit="onEditClicked"
    @cancel="onCancelClicked" @save="onSaveClicked">
    <template v-slot:displayContent>
      <v-row class="summary-content-container">
        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue truncate infoText">
            The purpose of collecting this information is to help ensure that all
            applicants are treated fairly and that the housing needs of communities and
            neighborhoods are being fulfilled. For residential mortgage lending, federal
            law requires that we ask applicants for their demographic information
            (ethnicity, sex, and race) in order to monitor our compliance with equal
            credit opportunity, fair housing, and home mortgage disclosure laws. You are
            not required to provide this information, but are encouraged to do so.
            <br />
            <br />
            The law provides that we may not discriminate on the basis of this information
            or on whether you choose to provide it. However, if you choose not to provide
            the information and you have made this application in person, federal
            regulations require us to note your ethnicity, sex, and race on the basis of
            visual observation or surname. The law also provides that we may not
            discriminate on the basis of age or marital status information you provide in
            this application. Instructions: You may select one or more "Hispanic or
            Latino" origins and one or more designations for "Race."
            <br />
            <br />
          </div>
        </v-col>
        <v-col sm="6" cols="12" class="summaryItem">
          <div class="summaryTitle">Ethnicity:</div>
          <div class="summaryValue">{{ getEthnicity() }}</div>
        </v-col>
        <v-col sm="6" cols="12" class="summaryItem">
          <div class="summaryTitle">Sex:</div>
          <div class="summaryValue">
            {{
    demographics.ULADHMDAGenderType ||
    "I do not wish to provide this information"
  }}
          </div>
        </v-col>
        <template v-for="(race, index) in races" :key="index">
          <v-col sm="6" cols="12" class="summaryItem">
            <div class="summaryTitle">Race:</div>
            <div class="summaryValue">
              {{
    race.HMDARaceType
      ? race.HMDARaceType.replace(/([a-z])([A-Z])/g, "$1 $2")
      : ""
  }}
            </div>
          </v-col>
          <v-col sm="6" cols="12" class="summaryItem" v-if="raceOptions[race.HMDARaceType]">
            <div class="summaryTitle">Race Origin:</div>
            <div class="summaryValue">
              {{
    race.ULADHMDARaceDesignationType
      ? race.ULADHMDARaceDesignationType.replace(/([a-z])([A-Z])/g, "$1 $2")
      : ""
  }}
            </div>
          </v-col>
        </template>
      </v-row>
    </template>
    <template v-slot:editContent>
      <DemographicsInformation :showNavigation="false"/>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
.truncate {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  --webkit-line-clamp: 1;
}

.infoText {
  color: $gray3 !important;
  max-height: 20px !important;
}

.summary-content-container {
  padding-left: 0px;
}
:deep(.content-container){
  border-radius: 0px !important;
  border: none !important;
  margin-top:0 !important
}
</style>
