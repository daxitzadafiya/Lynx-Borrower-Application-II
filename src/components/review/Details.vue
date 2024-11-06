<script setup>
import QualifyingBorrower from "@/components/review/QualifyingBorrower.vue";
import PropertyNLoans from "@/components/review/PropertyNLoans.vue";
import TransactionsDetails from "@/components/review/TransactionsDetails.vue";
import { useRouter } from "vue-router";
import { useGeneralStore } from "@/stores/generalStore";

const router = useRouter();
const generalStore = useGeneralStore();

const updateAndSave = () => {
  generalStore.saveLoanPatches();
  router.push("/underwriting");
};
</script>
<template>
  <div class="review-data">
    <v-card class="main__card" width="100%" light>
      <QualifyingBorrower />
      <PropertyNLoans />
      <TransactionsDetails />
      <v-divider />
      <div class="main__button">
        <div class="main_desktop-button">
          <CustomButton
            value="Next"
            customClass="primary-button"
            @onHandleClick="updateAndSave"
          />
        </div>
      </div>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.review-data {
  padding-top: 30px;
  margin-bottom: 30px;
}
.main__button {
    width: 152px;
    margin-left: 44px;
    padding: 24px 0;
}

@media (max-width: $tablet-width){
  .main__button{
    margin: 0 auto !important
  }
}
</style>
