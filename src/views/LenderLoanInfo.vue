<script setup>
import { useGeneralStore } from "@/stores/generalStore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useBorrowersStore } from "@/stores/borrowersStore";
import PropertyAndLoanInfo from "@/components/lenderLoanInfo/PropertyAndLoanInfo.vue";
import TitleInfo from "@/components/lenderLoanInfo/TitleInfo.vue";
import MortgageLoanInfo from "@/components/lenderLoanInfo/MortgageLoanInfo.vue";
import QualifyingTheBorrower from "@/components/lenderLoanInfo/QualifyingTheBorrower.vue";

const generalStore = useGeneralStore();
const router = useRouter();
const borrowersStore = useBorrowersStore();

const loanIdentifierTypes = ref([
  {
    text: "Agency Case",
    value: "AgencyCase",
  },
  {
    text: "Lender Loan",
    value: "LenderLoan",
  },
  {
    text: "Universal Loan",
    value: "UniversalLoan",
  },
]);

const model = computed(() => {
  return generalStore.currentLoan || {};
});
onMounted(() => {
  if (!generalStore.currentLoan) router.push("/borrowers");
});
</script>
<template>
  <div class="fill-height lenderloan" v-if="generalStore.currentLoan">
    <v-row>
      <v-col class="d-flex justify-start flex-wrap lender-loan-row flex-column flex-sm-row align-start align-sm-center">
        <div class="d-flex flex-column" id="B-01">
          <p class="font-italic body-2 mb-0">
            To be completed by the
            <span class="font-weight-medium">Lender</span>
          </p>

          <p class="body-2 align-self-end">Lender Loan No./Universal Loan Identifier</p>
        </div>
        <v-select
          light
          variant="underlined"
          class="mt-0 pt-0 mx-sm-3 align-self-end loan-input w-100 w-sm-auto select-field"
          :items="loanIdentifierTypes"
          item-title="text"
          item-value="value"
          placeholder="Loan Type"
          :model-value="model.LoanIdentifierType"
          @update:model-value="
            (value) =>
              borrowersStore.setCurrentLoan({
                ...generalStore.currentLoan,
                LoanIdentifierType: value,
              })
          "
        >
        </v-select>
        <v-text-field
          light
          class="mt-0 pt-0 mx-sm-3 align-self-end loan-input w-100 w-sm-auto truncate"
          variant="underlined"
          placeholder="Loan Identifier"
          :model-value="model.LoanIdentifier"
          id="B-03"
          @input="
            (e) =>
              borrowersStore.setCurrentLoan({
                ...generalStore.currentLoan,
                LoanIdentifier: e.target.value,
              })
          "
        >
        </v-text-field>

        <p class="body-2 align-self-sm-end align-self-start agency" id="B-02">Agency Case No.</p>
        <v-text-field
          light
          placeholder="Agency Case No."
          class="mt-0 pt-0 mx-sm-3 align-self-end loan-input w-100 w-sm-auto truncate"
          variant="underlined"
          :model-value="model.AgencyCaseIdentifier"
          @input="
            (e) =>
              borrowersStore.setCurrentLoan({
                ...generalStore.currentLoan,
                AgencyCaseIdentifier: e.target.value,
              })
          "
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="loan-border-top-3">
        <p class="display-1 font-weight-black">
          Uniform Residental Loan Application - Lender Loan Application
        </p>
        <p>This section is completed by your Lender.</p>
      </v-col>
    </v-row>
    <property-and-loan-info :model="generalStore.currentLoan" />
    <title-info :model="generalStore.currentLoan" />
    <mortgage-loan-info :model="generalStore.currentLoan" />
    <qualifying-the-borrower :model="generalStore.currentLoan" />
    <CustomButton
      value="Save"
      customClass="primary-button"
      @onHandleClick="generalStore.saveLoanPatches"
    />
  </div>
</template>
<style lang="scss">
.lenderloan {
  padding: 0 20px;
  @media(max-width:$lg-mobile-width){
    padding: 0 10px;
    }
  .lender-loan-row {
    align-items: center;
    padding: 6px 12px 5px;

    .select-field{
      line-height: 18px !important;
    }
  }


  .body-2 {
    letter-spacing: 0.0178571429em !important;
    font-size: 14px !important;
  }

  p {
    margin-bottom: 16px;
    font-size: 13px !important;
  }

  span,
  .v-field__input,
  .v-label {
    font-size: 13px !important;
  }

  .loan-form-chapter {
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    padding-top: 2px;
    padding-bottom: 1px;
  }

  .loan-grey-bg {
    background-color: #eee !important;
  }

  .loan-white-bg {
    background-color: $white !important;
  }

  .loan-border-top-3 {
    border-top: 3px solid $black !important;
  }

  .loan-border-top {
    border-top: thin solid $black !important;
  }

  .loan-border-left {
    border-left: thin solid $black !important;
  }

  .loan-border-right {
    border-right: thin solid $black !important;
    @media(max-width: $lg-mobile-width){
      border-right: 0 !important;
    }
  }

  .loan-border-bottom {
    border-bottom: thin solid $black !important;
  }

  .loan-border-x {
    border-left: thin solid $black !important;
    border-right: thin solid $black !important;
  }

  .loan-border-y {
    border-top: thin solid $black !important;
    border-bottom: thin solid $black !important;
  }

  .loan-border-a {
    border: thin solid $black !important;
  }

  .button {
    margin: 20px 0 10px;
  }

  .black {
    background-color: $black !important;
    border-color: $black !important;
  }

  .white--text {
    color: $white !important;
    caret-color: $white !important;
  }

  .display-1 {
    font-size: 2.125rem !important;
    line-height: 2.5rem;
    letter-spacing: 0.25px;
  }

  @media (max-width: $desktop-width) {
    margin-top: 55px;
  }
}

.v-checkbox .v-selection-control {
  min-height: 24px !important;
  margin-left: -8px;
  height: 24px !important;
  @media(max-width: $lg-desktop-width){
    height: auto !important;
  }
  label {
    letter-spacing: normal !important;
  }
}
.v-selection-control__input {
  height: 28px !important;
  width: 28px !important;
  i {
    font-size: 20px;
  }
}

.agency{
  margin-bottom: 24px !important;
  @media(max-width: $lg-mobile-width){
    margin-bottom: 0 !important;
  }
}
.truncate{
  input{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

</style>
