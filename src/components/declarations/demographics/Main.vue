<script setup>
import { loanPatch } from "@/mixins/loanPatch";
import Information from "@/components/declarations/demographics/Information.vue";
import { ref, defineProps, computed } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";

const borrowersStore = useBorrowersStore();

const props = defineProps({
  showNavigation: {
    type: Boolean,
    default: true
  },
})
const { saveAndAdvance } = loanPatch();

const isProvide = ref(true);

const updateAndSave = () => {
  saveAndAdvance(true);
};

const setEthnicityRefusalIndicator = (value) => {
  let Demographics = {
    ...demographics.value,
    HMDAEthnicityRefusalIndicator: value,
  };
  delete Demographics.Races;
  borrowersStore.updateBorrower({ prop: "Demographics", value: Demographics });
}

const demographics = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Demographics
  ? borrowersStore.Borrower.Demographics
  : {};
});
</script>

<template>
  <div class="content-container">
    <div class="inner-content-container">
      <div class="demographics-main__text text-black--text">
        <p>
          The purpose of collecting this information is to help ensure that all applicants
          are treated fairly and that the housing needs of communities and neighborhoods
          are being fulfilled. For residential mortgage lending, federal law requires that
          we ask applicants for their demographic information (ethnicity, sex, and race)
          in order to monitor our compliance with equal credit opportunity, fair housing,
          and home mortgage disclosure laws. You are not required to provide this
          information, but are encouraged to do so.
        </p>
        <p>
          The law provides that we may not discriminate on the basis of this information,
          or on whether you choose to provide it. However, if you choose not to provide
          the information and you have made this application in person, federal
          regulations require us to note your ethnicity, sex, and race on the basis of
          visual observation or surname. The law also provides that we may not
          discriminate on the basis of age or marital status information you provide in
          this application. Instructions: You may select one or more “Hispanic or Latino”
          origins and one or more designations for “Race.”
        </p>
        <p class="mb-6">
          If you do not wish to provide some or all of this information, select the
          applicable check box.
        </p>
        <v-row class="checkbox ml-0 mb-2">
          <v-col class="checkbox__col px-0 py-0" sm="2" md="1">
            <CheckBox
              class="main-checkbox"
              label="I do not wish to provide this information"
              :isChecked="demographics.HMDAEthnicityRefusalIndicator"
              @toggle="(val) => setEthnicityRefusalIndicator(val)"
              color="primary"
              :hideDetails="true"
            ></CheckBox>
          </v-col>
        </v-row>
      </div>
      <Information :isDisabled="demographics.HMDAEthnicityRefusalIndicator ? demographics.HMDAEthnicityRefusalIndicator : false" v-if="!demographics.HMDAEthnicityRefusalIndicator"></Information>
    </div>
    <div class="navigation-container" v-if="showNavigation">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="updateAndSave"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.mb-6{
  margin-bottom: 28px !important;
}
.demographics-main__text {
  p {
    margin-bottom: 16px;
  }
}
:deep(.main-checkbox .v-checkbox-btn) {
  min-height: 0px;
  i{
    font-size: 24px;
  }
}

:deep(.main-checkbox .v-selection-control ) {
  align-items: center;
  @media (max-width:$lg-mobile-width) {
    align-items:flex-start;
  }

  .v-label{
  white-space: nowrap;
  font-size: 16px;
  padding-left: 8px;
  line-height: 25px;
  @media (max-width: $lg-mobile-width) {
    padding-left: 10px;
    white-space: wrap !important;
  }}
}
:deep(.v-selection-control--density-default) {
    --v-selection-control-size: 30px !important;
}
</style>
