<script setup>
import PreviousEmployMent from "@/components/images/employment/PreviousEmployMent.vue";
import { ref } from "vue";
import { loanPatch } from "@/mixins/loanPatch";
import { useEmployMentStore } from "@/stores/employmentStore";

const employmentStore = useEmployMentStore();

const haveAnotherJob = ref(null);
const { saveAndAdvance } = loanPatch();

const setIndexAndRedirect = () => {
  if (haveAnotherJob.value) {
    employmentStore.setAdditionalEmploymentIndex(employmentStore.getAdditionalEmployments().length);
    saveAndAdvance("/employmentandincome/additional-employment-type");
  } else {
    saveAndAdvance("/employmentandincome/other-income");
  }
};

const setHaveAnotherJob = (val) => {
    haveAnotherJob.value = val;
};
</script>

<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText primary-text primary-text">
        Do you have another job you would like to provide income details for?
      </div>
      <PreviousEmployMent />
      <v-form class="my-5">
        <AgreeToggle :value="haveAnotherJob" @input="setHaveAnotherJob"></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :NextClicked="setIndexAndRedirect"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container {
  svg {
    width: auto;
    height: auto;
    max-height: 375px;
    margin: 20px 0;
    @media (max-width: $mobile-width) {
      width: 100%;
    }
  }
}
.v-btn-group--density-default.v-btn-group {
  padding: 0;
  overflow: visible;
}
</style>