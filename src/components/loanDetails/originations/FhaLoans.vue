<script setup>
import { useGeneralStore } from "@/stores/generalStore";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed } from "vue";
import { useDisplay } from 'vuetify'

const { sm } = useDisplay()
const generalStore = useGeneralStore();
const borrowersStore = useBorrowersStore();
const origination = computed(() => {
  return generalStore.currentLoan && generalStore.currentLoan.Origination
    ? generalStore.currentLoan.Origination
    : {};
});

const cols = computed(() => {
  return sm.value ? [4, 7]
       : [12, 12]
})
const updateOrigination = (prop, value) => {
  let Origination = {
    ...origination.value,
    [prop]: value,
  };
  if (!value) {
    delete Origination[prop];
  }
  borrowersStore.setCurrentLoan({ ...generalStore.currentLoan, Origination });
};
</script>
<template>
  <v-card light flat>
    <v-card-text class="pa-sm-4 pa-0">
      <v-row class="ma-0 pa-0 d-flex flex-wrap">
        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Loan Lender Identifier</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="origination.FHALoanLenderIdentifier"
            @update:model-value="
              (value) => updateOrigination('FHALoanLenderIdentifier', value)
            "
            placeholder="Loan Lender Identifier"
            hide-details
            :style="{ maxWidth: '300px' }"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >Loan Sponsor Identifier</span
          >
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="origination.FHALoanSponsorIdentifier"
            placeholder="Loan Sponsor Identifier"
            hide-details
            :style="{ maxWidth: '300px' }"
            @update:model-value="
              (value) => updateOrigination('FHALoanSponsorIdentifier', value)
            "
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1"
            >Taxpayer Identifier Type</span
          >
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="origination.TaxpayerIdentifierType"
            readonly
            placeholder="Taxpayer Identifier Type"
            hide-details
            :style="{ maxWidth: '300px' }"
          />
        </v-col>

        <v-col class="pa-1 d-flex mt-3 mt-sm-0" :md="2" :cols="cols[0]">
          <span class="font-weight-medium align-self-center ls-1">Taxpayer Identifier</span>
        </v-col>
        <v-col class="pa-1" :md="10" :cols="cols[1]">
          <v-text-field
            variant="underlined"
            class="mx-1 my-0 input-field"
            dense
            :model-value="origination.TaxpayerIdentifierValue"
            placeholder="Taxpayer Identifier"
            hide-details
            :style="{ maxWidth: '300px' }"
            @update:model-value="
              (value) => updateOrigination('TaxpayerIdentifierValue', value)
            "
          />
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
.font-weight-medium {
  color: #00000099 !important;
}
.button{
  margin: 40px 0 15px 0px;
}
</style>