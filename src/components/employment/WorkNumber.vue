<script setup>
import { ref } from "vue";
import WorkNumber from "@/components/images/employment/WorkNumber.vue";

const loadDataOnYourBehalf = ref(null);
const setLoadDataOnYourBehalf = (bool) => {
  loadDataOnYourBehalf.value = bool;
};
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">
        Since you indicated you are a W2 wage earner, we can attempt to automatically
        retrieve your employment and income details from the federal database.
      </div>
      <div class="titleSecondaryText primary-text font-weight-bold">
        Would you like us to do this on your behalf?
      </div>
      <WorkNumber />
      <v-form class="my-5">
        <AgreeToggle
          :value="loadDataOnYourBehalf"
          @input="setLoadDataOnYourBehalf"
        ></AgreeToggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        RequestedNextPath="employmentandincome/employedByFamilyMember"
        :ConditionsMet="loadDataOnYourBehalf === null"
      ></NavigationButtons>
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
