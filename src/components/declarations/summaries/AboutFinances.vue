<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, ref } from "vue";
import chapters from "@/components/declarations/summaries/Chapters.vue";
import { deleteEmptyProp } from "@/mixins/deleteEmptyProp";
import { useGeneralStore } from "@/stores/generalStore";

const borrowersStore = useBorrowersStore();
const generalStore = useGeneralStore();

const { deletePropWithCondition } = deleteEmptyProp();

const options = ref([
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
]);
const dataBeforeEdit = ref(null);

const declarations = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Declarations
    ? borrowersStore.Borrower.Declarations
    : {};
});

const setDeclarationsProp = (val, prop) => {
  let Declarations = { ...declarations.value, [prop]: val };

  deletePropWithCondition(Declarations, !Declarations.UndisclosedComakerOfNoteIndicator, [
    "UndisclosedComakerOfNoteExplanation",
  ]);

  deletePropWithCondition(Declarations, !Declarations.OutstandingJudgmentsIndicator, [
    "OutstandingJudgmentsExplanation",
  ]);

  deletePropWithCondition(Declarations, !Declarations.PresentlyDelinquentIndicator, [
    "PresentlyDelinquentExplanation",
  ]);

  deletePropWithCondition(Declarations, !Declarations.PartyToLawsuitIndicator, [
    "PartyToLawsuitExplanation",
  ]);

  deletePropWithCondition(
    Declarations,
    !Declarations.PriorPropertyDeedInLieuConveyedIndicator,
    ["PriorPropertyDeedInLieuConveyedExplanation"]
  );

  deletePropWithCondition(
    Declarations,
    !Declarations.PriorPropertyShortSaleCompletedIndicator,
    ["PriorPropertyShortSaleCompletedExplanation"]
  );

  deletePropWithCondition(
    Declarations,
    !Declarations.PriorPropertyForeclosureCompletedIndicator,
    ["PriorPropertyForeclosureCompletedExplanation"]
  );

  deletePropWithCondition(Declarations, !Declarations.BankruptcyIndicator, [
    "BankruptcyExplanation",
    "BankruptcyChapterType",
  ]);

  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(declarations.value));
};

const onCancelClicked = () => {
  borrowersStore.updateBorrower({ prop: "Declarations", value: dataBeforeEdit.value });
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};
</script>
<template>
  <NewSummaryControl
    header="About You Finances"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row class="summary-content-container">
        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Are you a co-signer or guarantor on any debt or loan that is not disclosed
              on this application?
            </div>
            <div class="summaryAnswer">
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <span class="yesNoAnswer">
                    {{
                      declarations.UndisclosedComakerOfNoteIndicator === undefined
                        ? ""
                        : declarations.UndisclosedComakerOfNoteIndicator === true
                        ? "Yes"
                        : "No"
                    }}
                  </span>
                </div>
                <div
                  class="d-flex mt-3"
                  v-if="declarations.UndisclosedComakerOfNoteIndicator"
                >
                  <span class="primary-text">Explanation:</span>
                  <span class="pl-1">{{
                    declarations.UndisclosedComakerOfNoteExplanation
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Are there any outstanding judgements against you?
            </div>
            <div class="summaryAnswer justify-end">
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <span class="yesNoAnswer">
                    {{
                      declarations.OutstandingJudgmentsIndicator === undefined
                        ? ""
                        : declarations.OutstandingJudgmentsIndicator === true
                        ? "Yes"
                        : "No"
                    }}
                  </span>
                </div>
                <div
                  class="d-flex mt-3"
                  v-if="declarations.OutstandingJudgmentsIndicator"
                >
                  <span class="primary-text">Explanation:</span>
                  <span class="pl-1">{{
                    declarations.OutstandingJudgmentsExplanation
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Are you currently delinquent or in default on a federal debt?
            </div>
            <div class="summaryAnswer justify-end">
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <span class="yesNoAnswer">
                    {{
                      declarations.PresentlyDelinquentIndicator === undefined
                        ? ""
                        : declarations.PresentlyDelinquentIndicator === true
                        ? "Yes"
                        : "No"
                    }}
                  </span>
                </div>
                <div class="d-flex mt-3" v-if="declarations.PresentlyDelinquentIndicator">
                  <span class="primary-text">Explanation:</span>
                  <span class="pl-1">{{
                    declarations.PresentlyDelinquentExplanation
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Are you a party to a lawsuit in which you potentially have any personal
              financial liability?
            </div>
            <div class="summaryAnswer justify-end">
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <span class="yesNoAnswer">
                    {{
                      declarations.PartyToLawsuitIndicator === undefined
                        ? ""
                        : declarations.PartyToLawsuitIndicator === true
                        ? "Yes"
                        : "No"
                    }}
                  </span>
                </div>
                <div class="d-flex mt-3" v-if="declarations.PartyToLawsuitIndicator">
                  <span class="primary-text">Explanation:</span>
                  <span class="pl-1">{{ declarations.PartyToLawsuitExplanation }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Have you conveyed title to any property in lieu of foreclosure in the past 7
              years?
            </div>
            <div class="summaryAnswer justify-end">
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <span class="yesNoAnswer">
                    {{
                      declarations.PartyToLawsuitIndicator === undefined
                        ? ""
                        : declarations.PartyToLawsuitIndicator === true
                        ? "Yes"
                        : "No"
                    }}
                  </span>
                </div>
                <div class="d-flex mt-3" v-if="declarations.PartyToLawsuitIndicator">
                  <span class="primary-text">Explanation:</span>
                  <span class="pl-1">{{ declarations.PartyToLawsuitExplanation }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Within the past 7 years, have you completed a pre-foreclosure sale or short
              sale, whereby the property was sold to a third party and the Lender agreed
              to accept less than the outstanding mortgage balance due?
            </div>
            <div class="summaryAnswer">
              <span class="yesNoAnswer">{{
                  declarations.PriorPropertyShortSaleCompletedIndicator === undefined
                    ? ""
                    : declarations.PriorPropertyShortSaleCompletedIndicator === true
                    ? "Yes"
                    : "No"
                }}</span>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Have you had a property foreclosed upon in the 7 years?
            </div>
            <div class="summaryAnswer">
              <span class="yesNoAnswer">
                {{
                  declarations.PriorPropertyForeclosureCompletedIndicator === undefined
                    ? ""
                    : declarations.PriorPropertyForeclosureCompletedIndicator === true
                    ? "Yes"
                    : "No"
                }}</span
              >
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Have you declared bankruptcy within the past 7 years?
            </div>
            <div class="summaryAnswer">
              <span class="yesNoAnswer">
                {{
                  declarations.BankruptcyIndicator === undefined
                    ? ""
                    : declarations.BankruptcyIndicator === true
                    ? "Yes"
                    : "No"
                }}</span
              >
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:editContent>
      <v-form fast-fail class="form-finances">
        <!-- <v-row class="form-container"> -->
        <!-- Co-signer or guarantor question -->
        <Radio
          label="Are you a co-signer or guarantor on any debt or loan that is not disclosed on this application?"
          :value="declarations.UndisclosedComakerOfNoteIndicator"
          @change="(e) => setDeclarationsProp(e, 'UndisclosedComakerOfNoteIndicator')"
          :options="options"
        />

        <v-col
          v-if="declarations.UndisclosedComakerOfNoteIndicator"
          class="field-value itemContainer"
          sm="4"
          cols="10"
        >
          <TextArea
            :rows="1"
            :smVal="12"
            placeholder="Explanation"
            :value="declarations.UndisclosedComakerOfNoteExplanation"
            @onChange="
              (e) => setDeclarationsProp(e, 'UndisclosedComakerOfNoteExplanation')
            "
          />
        </v-col>

        <!-- Outstanding judgements question -->
        <Radio
          label="Are there any outstanding judgements against you?"
          :value="declarations.OutstandingJudgmentsIndicator"
          @change="(e) => setDeclarationsProp(e, 'OutstandingJudgmentsIndicator')"
          :options="options"
        />

        <v-col
          v-if="declarations.OutstandingJudgmentsIndicator"
          class="field-value itemContainer"
          sm="4"
          cols="10"
        >
          <TextArea
            :rows="1"
            :smVal="12"
            placeholder="Explanation"
            :value="declarations.OutstandingJudgmentsExplanation"
            @onChange="(e) => setDeclarationsProp(e, 'OutstandingJudgmentsExplanation')"
          />
        </v-col>

        <!-- Federal debt default question -->
        <Radio
          label="Are you currently deliquent or in default on a federal debt?"
          :value="declarations.PresentlyDelinquentIndicator"
          @change="(e) => setDeclarationsProp(e, 'PresentlyDelinquentIndicator')"
          :options="options"
        />

        <v-col
          v-if="declarations.PresentlyDelinquentIndicator"
          class="field-value itemContainer"
          sm="4"
          cols="10"
        >
          <TextArea
            :rows="1"
            :smVal="12"
            placeholder="Explanation"
            :value="declarations.PresentlyDelinquentExplanation"
            @onChange="(e) => setDeclarationsProp(e, 'PresentlyDelinquentExplanation')"
          />
        </v-col>

        <!-- Lawsuit financial liability question -->
        <Radio
          label="Are you a party to a lawsuit in which you potentially have any personal financial liability?"
          :value="declarations.PartyToLawsuitIndicator"
          @change="(e) => setDeclarationsProp(e, 'PartyToLawsuitIndicator')"
          :options="options"
        />

        <v-col
          v-if="declarations.PartyToLawsuitIndicator"
          class="field-value itemContainer"
          sm="4"
          cols="10"
        >
          <TextArea
            :rows="1"
            :smVal="12"
            placeholder="Explanation"
            :value="declarations.PartyToLawsuitExplanation"
            @onChange="(e) => setDeclarationsProp(e, 'PartyToLawsuitExplanation')"
          />
        </v-col>

        <!-- Property deed in lieu question -->
        <Radio
          label="Have you conveyed title to any property in lieu of foreclosure in the past 7 years?"
          :value="declarations.PriorPropertyDeedInLieuConveyedIndicator"
          @change="
            (e) => setDeclarationsProp(e, 'PriorPropertyDeedInLieuConveyedIndicator')
          "
          :options="options"
        />

        <v-col
          v-if="declarations.PriorPropertyDeedInLieuConveyedIndicator"
          class="field-value itemContainer"
          sm="4"
          cols="10"
        >
          <TextArea
            :rows="1"
            :smVal="12"
            placeholder="Explanation"
            :value="declarations.PriorPropertyDeedInLieuConveyedExplanation"
            @onChange="
              (e) => setDeclarationsProp(e, 'PriorPropertyDeedInLieuConveyedExplanation')
            "
          />
        </v-col>

        <!-- Pre-foreclosure or short sale question -->
        <Radio
          label="Within the past 7 years, have you completed a pre-foreclosure sale or short sale, whereby the property was sold to a third party and the Lender agreed to accept less than the outstanding mortgage balance due?"
          :value="declarations.PriorPropertyShortSaleCompletedIndicator"
          @change="
            (e) => setDeclarationsProp(e, 'PriorPropertyShortSaleCompletedIndicator')
          "
          :options="options"
        />

        <v-col
          v-if="declarations.PriorPropertyShortSaleCompletedIndicator"
          class="field-value itemContainer"
          sm="4"
          cols="10"
        >
          <TextArea
            :rows="1"
            :smVal="12"
            placeholder="Explanation"
            :value="declarations.PriorPropertyShortSaleCompletedExplanation"
            @onChange="
              (e) => setDeclarationsProp(e, 'PriorPropertyShortSaleCompletedExplanation')
            "
          />
        </v-col>

        <!-- Foreclosure question -->
        <Radio
          class="text"
          label="Have you had a property foreclosed upon in the last 7 years?"
          :value="declarations.PriorPropertyForeclosureCompletedIndicator"
          @change="
            (e) => setDeclarationsProp(e, 'PriorPropertyForeclosureCompletedIndicator')
          "
          :options="options"
        />

        <v-col
          v-if="declarations.PriorPropertyForeclosureCompletedIndicator"
          class="field-value itemContainer"
          sm="4"
          cols="10"
        >
          <TextArea
            :rows="1"
            :smVal="12"
            placeholder="Explanation"
            :value="declarations.PriorPropertyForeclosureCompletedExplanation"
            @onChange="
              (e) =>
                setDeclarationsProp(e, 'PriorPropertyForeclosureCompletedExplanation')
            "
          />
        </v-col>

        <!-- Bankruptcy question -->
        <Radio
          label="Have you declared bankruptcy within the past 7 years?"
          :value="declarations.BankruptcyIndicator != undefined"
          @change="(e) => setDeclarationsProp(e, 'BankruptcyIndicator')"
          :options="options"
        />

        <v-col :sm="12" :cols="12" class="itemContainer">
          <v-row>
            <chapters
              v-if="declarations.BankruptcyIndicator"
              :isDisabled="!declarations.BankruptcyIndicator"
              :chapter="declarations.BankruptcyChapterType"
              @setChapter="(val) => setDeclarationsProp(val, 'BankruptcyChapterType')"
            />

            <TextArea
              v-if="declarations.BankruptcyIndicator"
              :rows="1"
              :smVal="3"
              placeholder="Explanation"
              :value="declarations.BankruptcyExplanation"
              @onChange="(e) => setDeclarationsProp(e, 'BankruptcyExplanation')"
            />
          </v-row>
        </v-col>
        <!-- </v-row> -->
      </v-form>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
.form-container {
  margin: -10px !important;
}

.v-divider {
  margin-bottom: 15px;
}

.center-aligned {
  align-items: center;
}

.field-title {
  font-size: 16px;
}

.field-value {
  margin-left: auto;
  padding-top: 0px;
  padding-left: 60px;
  margin-top: -30px;

  @media (max-width: $tablet-width) {
    margin-top: 0;
  }
}

.summaryQuestion {
  flex: 7;
  padding-right: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.summaryValue {
  display: flex;
  justify-content: space-between;
  max-height: fit-content !important;
  width: 100%;
  height: 20px;
}

.summaryAnswer {
  flex: 3;
  text-align: end;
  padding-left: 10px;
  padding-right: 20px;
}

.yesNoAnswer {
  font-weight: 600;
}

.summary-content-container {
  > :not(:last-child) {
    padding-bottom: 10px !important;
  }
  > :not(:first-child) {
    padding-top: 10px;
  }
}

.summary-content-container {
  padding-left: 0px;
}

:deep(.v-radio-group) {
  .v-input__control {
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center;
    padding: 12px 10px;

    .v-label {
      font-size: 16px !important;
      opacity: 1 !important;
      white-space: normal !important;
      flex: 7;
      margin-inline-start: 0;
      letter-spacing: normal !important;
    }
  }

  .v-selection-control-group {
    flex-direction: row !important;
    flex: 3;
    padding-left: 10px;
    justify-content: end;
    margin-top: 0px !important;
    max-height: 20px !important;
    gap: 10px;
    padding-right: 20px;

    .v-selection-control {
      flex: none;

      .v-label {
        font-size: 12.8px !important;
        white-space: nowrap !important;
      }
    }
    i {
      font-size: 24px !important;
    }
  }
}

.v-selection-control--density-default {
  --v-selection-control-size: 24px !important;
}

:deep(.v-selection-control) {
  .v-label {
    word-break: normal;
  }
}

:deep(.v-field__field) {
  align-items: center !important;
  height: 40px;
}

:deep(.v-field__input) {
  padding: 12px !important;
}

:deep(.v-select .v-theme--light),
:deep(.v-field__append-inner) {
  max-height: 40px !important;
}

:deep(.v-text-field__prefix) {
  padding-left: 12px;
}

:deep(.v-field--active.v-field--focused .v-text-field__prefix) {
  color: $black !important;
}

:deep(.v-text-field--prefixed.v-text-field .v-field__input) {
  padding: 4px !important;
}

.p-0 {
  padding: 0;
}

.form-finances {
  padding: 28px 30px;
  margin: -10px !important;

  @media (max-width: 767px) {
    padding: 20px;
  }
}

:deep(.chapters) {
  margin-top: 0;
}

:deep(.titleText) {
  margin-bottom: 5px;
}

.text {
  margin-top: -4px !important;
}

.form-container .itemContainer {
  padding-left: 30px;
  padding-right: 0px;
}
@media (max-width: $lg-mobile-width) {
  :deep(.v-radio-group) {
    .v-input__control .v-label {
      padding-right: 10px;
    }
    .v-selection-control-group {
      flex-direction: column !important;
      height: unset !important;
      gap: 2px;
      margin-right: 0 !important;
      .v-label {
        padding-left: 10px;
      }
    }
    .v-selection-control--density-default {
      --v-selection-control-size: 20px;
    }
  }
}
@media (max-width: $mobile-width) {
  :deep(.form-finances) {
    margin: -10px !important;
    padding: 30px 10px !important;
  }
  :deep(.v-radio-group) {
    .v-input__control {
      padding: 10px !important;
      align-items: start;
    }
    .v-selection-control-group {
      justify-content: start !important;

      padding-right: 0px;
    }
  }
}
</style>
