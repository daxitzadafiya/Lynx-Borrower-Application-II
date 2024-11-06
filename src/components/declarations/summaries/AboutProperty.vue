<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, ref } from "vue";
import { number } from "@/mixins/onlyNum";
import { deleteEmptyProp } from "@/mixins/deleteEmptyProp";
import { useLoanPropertyStore } from "@/stores/loanPropertyStore";
import { useGeneralStore } from "@/stores/generalStore";

const borrowersStore = useBorrowersStore();
const { isOnlyNum } = number();
const { deletePropWithCondition, deleteEmptyPropValue } = deleteEmptyProp();
const loanPropertyStore = useLoanPropertyStore();
const generalStore = useGeneralStore();

const options = ref([
  {
    label: "Yes",
    value: "Yes",
  },
  {
    label: "No",
    value: "No",
  },
]);
const options2 = ref([
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
]);
const propertyTypes = ref([
  { text: "Primary Residence", value: "PrimaryResidence" },
  { text: "Second Home", value: "SecondHome" },
  { text: "Investment", value: "Investment" },
  { text: "FHA Secondary Residence", value: "FHASecondaryResidence" },
]);

const propertyTitles = ref([
  { text: "By yourself", value: "Sole" },
  { text: "Jointly With Spouse", value: "JointWithSpouse" },
  { text: "Jointly With Another Person", value: "JointWithOtherThanSpouse" },
]);

const dataBeforeEdit = ref(null);

const setDeclarationsProp = (val, prop) => {
  let Declarations = { ...declarations.value, [prop]: val };

  //Intent To Occupy
  deletePropWithCondition(Declarations, Declarations.IntentToOccupyType === "No", [
    "IntentToOccupyExplanation",
    "HomeownerPastThreeYearsType",
    "PriorPropertyUsageType",
    "PriorPropertyTitleType",
    "HomeownerPastThreeYearsExplanation",
  ]);

  //ULADSpecialBorrowerSellerRelationship
  deletePropWithCondition(
    Declarations,
    !Declarations.ULADSpecialBorrowerSellerRelationshipIndicator,
    ["ULADSpecialBorrowerSellerRelationshipIndicatorExplanation"]
  );

  //Undisclosed Borrowed Funds
  deletePropWithCondition(Declarations, !Declarations.UndisclosedBorrowedFundsIndicator, [
    "UndisclosedBorrowedFundsAmount",
    "UndisclosedBorrowedFundsExplanation",
  ]);

  //Homeowner Past Three Years
  deletePropWithCondition(
    Declarations,
    Declarations.HomeownerPastThreeYearsType === "No",
    [
      "PriorPropertyUsageType",
      "PriorPropertyTitleType",
      "HomeownerPastThreeYearsExplanation",
    ]
  );

  //Undisclosed Mortgage Application
  deletePropWithCondition(
    Declarations,
    !Declarations.UndisclosedMortgageApplicationIndicator,
    ["UndisclosedMortgageApplicationExplanation"]
  );

  //Undisclosed Credit Application
  deletePropWithCondition(
    Declarations,
    !Declarations.UndisclosedCreditApplicationIndicator,
    ["UndisclosedCreditApplicationExplanation"]
  );

  //Property Proposed Clean Energy Lien
  deletePropWithCondition(
    Declarations,
    !Declarations.PropertyProposedCleanEnergyLienIndicator,
    ["PropertyProposedCleanEnergyLienExplanation"]
  );

  //Update
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const setMixedUseProp = (val, prop) => {
  const property = loanPropertyStore.getProperty()
    ? { ...loanPropertyStore.getProperty(), [prop]: val }
    : { [prop]: val };

  if (
    loanPropertyStore.getProperty() &&
    !loanPropertyStore.getProperty().PropertyMixedUsageIndicator
  ) {
    delete loanPropertyStore.getProperty().PropertyMixedUsageExplanation;
  }
  loanPropertyStore.getProperty() &&
    deleteEmptyPropValue(
      loanPropertyStore.getProperty(),
      "PropertyMixedUsageExplanation"
    );
  loanPropertyStore.setProperty(property);
};

const onEditClicked = () => {
  generateOnCancelData();
};

const generateOnCancelData = () => {
  dataBeforeEdit.value = JSON.parse(JSON.stringify(declarations.value));
};

const onCancelClicked = () => {
  setDeclarationsProp(dataBeforeEdit.value.IntentToOccupyType, "IntentToOccupyType");
  setDeclarationsProp(
    dataBeforeEdit.value.HomeownerPastThreeYearsType,
    "HomeownerPastThreeYearsType"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.PriorPropertyUsageType,
    "PriorPropertyUsageType"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.PriorPropertyTitleType,
    "PriorPropertyTitleType"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.HomeownerPastThreeYearsExplanation,
    "HomeownerPastThreeYearsExplanation"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.ULADSpecialBorrowerSellerRelationshipIndicator,
    "ULADSpecialBorrowerSellerRelationshipIndicator"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.ULADSpecialBorrowerSellerRelationshipIndicatorExplanation,
    "ULADSpecialBorrowerSellerRelationshipIndicatorExplanation"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.UndisclosedBorrowedFundsIndicator,
    "UndisclosedBorrowedFundsIndicator"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.UndisclosedBorrowedFundsAmount,
    "UndisclosedBorrowedFundsAmount"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.UndisclosedBorrowedFundsExplanation,
    "UndisclosedBorrowedFundsExplanation"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.UndisclosedMortgageApplicationIndicator,
    "UndisclosedMortgageApplicationIndicator"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.UndisclosedMortgageApplicationExplanation,
    "UndisclosedMortgageApplicationExplanation"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.UndisclosedCreditApplicationIndicator,
    "UndisclosedCreditApplicationIndicator"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.UndisclosedCreditApplicationExplanation,
    "UndisclosedCreditApplicationExplanation"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.PropertyProposedCleanEnergyLienIndicator,
    "PropertyProposedCleanEnergyLienIndicator"
  );
  setDeclarationsProp(
    dataBeforeEdit.value.PropertyProposedCleanEnergyLienExplanation,
    "PropertyProposedCleanEnergyLienExplanation"
  );
  setMixedUseProp(
    dataBeforeEdit.value.PropertyMixedUsageIndicator,
    "PropertyMixedUsageIndicator"
  );
  setMixedUseProp(
    dataBeforeEdit.value.PropertyMixedUsageExplanation,
    "PropertyMixedUsageExplanation"
  );
};

const onSaveClicked = () => {
  generalStore.saveLoanPatches();
};

const declarations = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Declarations
    ? borrowersStore.Borrower.Declarations
    : {};
});

const propertyTypeText = computed(() => {
  let propertyType = propertyTypes.value.find(
    (x) => x.value === declarations.value.PriorPropertyUsageType
  );
  if (propertyType == null) {
    return null;
  }
  return propertyType.text;
});

const propertyTitleText = computed(() => {
  let propertyTitle = propertyTitles.value.find(
    (x) => x.value === declarations.value.PriorPropertyTitleType
  );
  if (propertyTitle == null) {
    return null;
  }
  return propertyTitle.text;
});
</script>
<template>
  <NewSummaryControl
    header="About this Property and Your Money for this Loan"
    @edit="onEditClicked"
    @cancel="onCancelClicked"
    @save="onSaveClicked"
  >
    <template v-slot:displayContent>
      <v-row class="summary-content-container">
        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Will you occupy the property as your primary residence?
            </div>
            <div class="summaryAnswer yesNoAnswer" v-if="declarations.IntentToOccupyType">
              {{ declarations.IntentToOccupyType }}
            </div>
          </div>
        </v-col>

        <template
          v-if="
            declarations.IntentToOccupyType && declarations.IntentToOccupyType === 'Yes'
          "
        >
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="summaryValue">
              <div class="summaryQuestion">
                Have you had any ownership interest in another property in the last three
                years?
              </div>
              <div
                class="summaryAnswer yesNoAnswer"
                v-if="declarations.HomeownerPastThreeYearsType"
              >
                {{ declarations.HomeownerPastThreeYearsType }}
              </div>
            </div>
          </v-col>

          <v-col
            sm="12"
            cols="12"
            class="summaryItem pl-13"
            v-if="
              declarations.HomeownerPastThreeYearsType &&
              declarations.HomeownerPastThreeYearsType !== 'No'
            "
          >
            <div class="summaryValue">
              <div class="summaryQuestion">
                What type of property did you own: Property Residence, FHA Secondary
                Residence, Second Home, or Investment Property?
              </div>
              <div class="summaryAnswer d-flex justify-end" v-if="propertyTypeText">
                <div class="yesNoAnswer">{{ propertyTypeText }}</div>
              </div>
            </div>
          </v-col>

          <v-col
            sm="12"
            cols="12"
            class="summaryItem pl-13"
            v-if="
              declarations.HomeownerPastThreeYearsType &&
              declarations.HomeownerPastThreeYearsType !== 'No'
            "
          >
            <div class="summaryValue">
              <div class="summaryQuestion">
                How did you hold title to the property: by yourself, jointly with your
                spouse, or jointly with another person?
              </div>
              <div
                class="summaryAnswer justify-end"
                v-if="
                  declarations.HomeownerPastThreeYearsExplanation || propertyTitleText
                "
              >
                <div class="d-flex flex-column align-end">
                  <div class="yesNoAnswer">{{ propertyTitleText }}</div>
                </div>
              </div>
            </div>
          </v-col>
        </template>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              If this is a purchase Transaction: Do you have family relationship or
              business affiliation with the seller of the property?
            </div>
            <div class="summaryAnswer justify-end">
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <div class="yesNoAnswer">
                    {{
                      declarations.ULADSpecialBorrowerSellerRelationshipIndicator ===
                      undefined
                        ? ""
                        : declarations.ULADSpecialBorrowerSellerRelationshipIndicator
                        ? "Yes"
                        : "No"
                    }}
                  </div>
                </div>
                <div
                  class="d-flex mt-3"
                  v-if="declarations.ULADSpecialBorrowerSellerRelationshipIndicator"
                >
                  <div class="primary-text">Explanation:</div>
                  <div class="pl-1">
                    {{ declarations.ULADSpecialBorrowerSellerRelationshipIndicatorExplanation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Are you borrowing any money for this real estate transaction or obtaining
              any money from another party, such as the seller or realtor, that you have
              not disclosed on this loan application?
            </div>
            <div class="summaryAnswer justify-end">
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <div class="yesNoAnswer">
                    {{
                      declarations.UndisclosedBorrowedFundsIndicator === undefined
                        ? ""
                        : declarations.UndisclosedBorrowedFundsIndicator
                        ? "Yes"
                        : "No"
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col
          sm="12"
          cols="12"
          class="summaryItem pl-13"
          v-if="declarations.UndisclosedBorrowedFundsAmount"
        >
          <div class="summaryValue">
            <div class="summaryQuestion">
              What is the Amount of money you are borrowing?
            </div>
            <div
              class="summaryAnswer justify-end"
              v-if="declarations.HomeownerPastThreeYearsExplanation || propertyTitleText"
            >
              <div class="d-flex flex-column align-end">
                <div class="yesNoAnswer">
                  {{ getFormattedValue(declarations.UndisclosedBorrowedFundsAmount) }}
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Have you or will you be applying for a mortgage loan on another property on
              or before closing this transaction that is not disclosed on this loan
              application?
            </div>
            <div
              class="summaryAnswer justify-end"
              v-if="
                typeof declarations.UndisclosedMortgageApplicationIndicator === 'boolean'
              "
            >
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <div class="yesNoAnswer">
                    {{
                      declarations.UndisclosedMortgageApplicationIndicator === undefined
                        ? ""
                        : declarations.UndisclosedMortgageApplicationIndicator
                        ? "Yes"
                        : "No"
                    }}
                  </div>
                </div>
                <div
                  class="d-flex mt-3"
                  v-if="declarations.UndisclosedMortgageApplicationIndicator"
                >
                  <div class="primary-text">Explanation:</div>
                  <div class="pl-1">
                    {{ declarations.UndisclosedMortgageApplicationExplanation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Have you or will you be applying for any new credit on or before closing
              this loan that is not disclosed on this application?
            </div>
            <div
              class="summaryAnswer justify-end"
              v-if="
                typeof declarations.UndisclosedCreditApplicationIndicator === 'boolean'
              "
            >
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <div class="yesNoAnswer">
                    {{
                      declarations.UndisclosedCreditApplicationIndicator === undefined
                        ? ""
                        : declarations.UndisclosedCreditApplicationIndicator
                        ? "Yes"
                        : "No"
                    }}
                  </div>
                </div>
                <div
                  class="d-flex mt-3"
                  v-if="declarations.UndisclosedCreditApplicationIndicator"
                >
                  <div class="primary-text">Explanation:</div>
                  <div class="pl-1">
                    {{ declarations.UndisclosedCreditApplicationExplanation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              Will this property be subject to a lien that could take priority over the
              first mortgage lien, such as clean energy lien paid through your property
              taxes (e.g. The Property Assessed Clean Energy Program)?
            </div>
            <div
              class="summaryAnswer justify-end"
              v-if="
                typeof declarations.PropertyProposedCleanEnergyLienIndicator === 'boolean'
              "
            >
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <div class="yesNoAnswer">
                    {{
                      declarations.PropertyProposedCleanEnergyLienIndicator === undefined
                        ? ""
                        : declarations.PropertyProposedCleanEnergyLienIndicator
                        ? "Yes"
                        : "No"
                    }}
                  </div>
                </div>
                <div
                  class="d-flex mt-3"
                  v-if="declarations.PropertyProposedCleanEnergyLienIndicator"
                >
                  <div class="primary-text">Explanation:</div>
                  <div class="pl-1">
                    {{ declarations.PropertyProposedCleanEnergyLienExplanation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col sm="12" cols="12" class="summaryItem">
          <div class="summaryValue">
            <div class="summaryQuestion">
              If you are occupying this property, will you set aside space within the
              property to operate your own business?
            </div>
            <div
              class="summaryAnswer justify-end"
              v-if="loanPropertyStore.getProperty()"
            >
              <div class="d-flex flex-column align-end">
                <div class="d-flex">
                  <div class="yesNoAnswer">
                    {{
                      loanPropertyStore.getProperty() === undefined
                        ? ""
                        : loanPropertyStore.getProperty().PropertyMixedUsageIndicator
                        ? "Yes"
                        : "No"
                    }}
                  </div>
                </div>
                <div class="d-flex mt-3" v-if="declarations.PropertyMixedUsageIndicator">
                  <div class="primary-text">Explanation:</div>
                  <div class="pl-1">{{ declarations.PropertyMixedUsageExplanation }}</div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row></template
    >
    <template v-slot:editContent>
      <v-form fast-fail>
        <v-row class="form-container">
          <Radio
            label="Will you occupy the property as your primary residence?"
            :value="declarations.IntentToOccupyType"
            :yesNoValues="true"
            :options="options"
            @change="(e) => setDeclarationsProp(e, 'IntentToOccupyType')"
          />

          <template
            v-if="
              declarations.IntentToOccupyType && declarations.IntentToOccupyType === 'Yes'
            "
          >
            <Radio
              label="Have you had any ownership interest in another property in the last three years?"
              :yesNoValues="true"
              :options="options"
              :value="declarations.HomeownerPastThreeYearsType"
              @change="
                (e) =>
                  setDeclarationsProp(
                    e === 'Yes' ? 'Yes' : 'No',
                    'HomeownerPastThreeYearsType'
                  )
              "
            />
            <v-row
              class="property-type pl-13"
              v-if="
                declarations.HomeownerPastThreeYearsType &&
                declarations.HomeownerPastThreeYearsType !== 'No'
              "
            >
              <v-col sm="8" class="pt-0 px-0">
                <span class="property-text"
                  >What type of property did you own: Primary Residence, FHA Secondary
                  Residence, Second Home, or Investment Property?</span
                >
              </v-col>
              <v-col sm="4" class="p-2 pt-0">
                <SelectBox
                  :smVal="12"
                  v-if="
                    declarations.HomeownerPastThreeYearsType &&
                    declarations.HomeownerPastThreeYearsType !== 'No'
                  "
                  class="select-box"
                  placeholder="Property Type"
                  :items="propertyTypes"
                  :itemText="'text'"
                  :itemValue="'value'"
                  :value="declarations.PriorPropertyUsageType"
                  @change="(e) => setDeclarationsProp(e, 'PriorPropertyUsageType')"
                />
              </v-col>
            </v-row>

            <v-row
              class="property-type pl-13 pb-5"
              v-if="
                declarations.HomeownerPastThreeYearsType &&
                declarations.HomeownerPastThreeYearsType !== 'No'
              "
            >
              <v-col sm="8" class="px-0 pt-2">
                <span class="property-text"
                  >How did you hold title to the property: by yourself, jointly with your
                  spouse, or jointly with another person?</span
                >
              </v-col>
              <v-col class="p-2">
                <SelectBox
                  :smVal="12"
                  v-if="
                    declarations.HomeownerPastThreeYearsType &&
                    declarations.HomeownerPastThreeYearsType !== 'No'
                  "
                  class="select-box"
                  placeholder="Title to the property"
                  :items="propertyTitles"
                  :itemText="'text'"
                  :itemValue="'value'"
                  :value="declarations.PriorPropertyTitleType"
                  @change="(e) => setDeclarationsProp(e, 'PriorPropertyTitleType')"
                />
              </v-col>
            </v-row>
          </template>

          <Radio
            class="purchase"
            label="If this is a purchase Transaction: Do you have a family relationship or business affiliation with the seller of the property?"
            :value="declarations.ULADSpecialBorrowerSellerRelationshipIndicator"
            @change="
              (e) =>
                setDeclarationsProp(e, 'ULADSpecialBorrowerSellerRelationshipIndicator')
            "
            :options="options2"
          />

          <v-col
            v-if="declarations.ULADSpecialBorrowerSellerRelationshipIndicator"
            sm="4"
            cols="10"
            class="field-value itemContainer"
          >
            <TextArea
              class="textarea ps-0 mb-6"
              :rows="1"
              :smVal="12"
              placeholder="Explanation"
              :value="declarations.ULADSpecialBorrowerSellerRelationshipIndicatorExplanation"
              @onChange="
                (e) =>
                  setDeclarationsProp(
                    e,
                    'ULADSpecialBorrowerSellerRelationshipIndicatorExplanation'
                  )
              "
            />
          </v-col>

          <Radio
            class="transaction text-1"
            label="Are you borrowing any money for this real estate transaction or obtaining any money from another party, such as the seller or realtor, that you have not disclosed on this loan application?"
            :value="declarations.UndisclosedBorrowedFundsIndicator"
            @change="(e) => setDeclarationsProp(e, 'UndisclosedBorrowedFundsIndicator')"
            :options="options2"
          />

          <v-col
            v-if="declarations.UndisclosedBorrowedFundsIndicator"
            class="pl-11 money itemContainer"
            sm="12"
            cols="12"
          >
            <div class="radioText pl-2">
              What is the Amount of money you are borrowing?
            </div>
            <div class="radioInputs">
              <TextBox
                class="pl-2"
                :smVal="12"
                :value="getFormattedValue(declarations.UndisclosedBorrowedFundsAmount)"
                @input="
                  (e) =>
                    setDeclarationsProp(
                      +e.target.value.replace(/,/g, ''),
                      'UndisclosedBorrowedFundsAmount'
                    )
                "
                @keypress="(e) => isOnlyNum(e, true)"
                prefix="$"
              />
            </div>
          </v-col>

          <Radio
            label="Have you or will you be applying for a mortgage loan on another property on or before closing this transaction that is not disclosed on this loan application?"
            :value="declarations.UndisclosedMortgageApplicationIndicator"
            @change="
              (e) => setDeclarationsProp(e, 'UndisclosedMortgageApplicationIndicator')
            "
            :options="options2"
            class="text-2"
          />

          <v-col
            v-if="declarations.UndisclosedMortgageApplicationIndicator"
            sm="4"
            cols="10"
            class="field-value itemContainer"
          >
            <TextArea
              class="pl-0 textarea mb-6"
              :rows="1"
              :smVal="12"
              placeholder="Explanation"
              :value="declarations.UndisclosedMortgageApplicationExplanation"
              @onChange="
                (e) => setDeclarationsProp(e, 'UndisclosedMortgageApplicationExplanation')
              "
            />
          </v-col>

          <Radio
            label="Have you or will you be applying for any new credit on or before closing this loan that is not disclosed on this application?"
            :value="declarations.UndisclosedCreditApplicationIndicator"
            @change="
              (e) => setDeclarationsProp(e, 'UndisclosedCreditApplicationIndicator')
            "
            :options="options2"
            class="text-2"
          />

          <v-col
            v-if="declarations.UndisclosedCreditApplicationIndicator"
            sm="4"
            cols="10"
            class="field-value itemContainer"
          >
            <TextArea
              class="pl-0 textarea mb-6"
              :rows="1"
              :smVal="12"
              placeholder="Explanation"
              :value="declarations.UndisclosedCreditApplicationExplanation"
              @onChange="
                (e) => setDeclarationsProp(e, 'UndisclosedCreditApplicationExplanation')
              "
            />
          </v-col>

          <Radio
            label="Will this property be subject to a lien that could take priority over the first mortgage lien, such as clean energy lien paid through your property taxes ( e.g, The Property Assessed Clean Energy Program)?"
            :value="declarations.PropertyProposedCleanEnergyLienIndicator"
            @change="
              (e) => setDeclarationsProp(e, 'PropertyProposedCleanEnergyLienIndicator')
            "
            :options="options2"
            class="text-2"
          />

          <v-col
            v-if="declarations.PropertyProposedCleanEnergyLienIndicator"
            sm="4"
            cols="10"
            class="field-value itemContainer"
          >
            <TextArea
              class="pl-0 textarea mb-6"
              :rows="1"
              :smVal="12"
              placeholder="Explanation"
              :value="declarations.PropertyProposedCleanEnergyLienExplanation"
              @onChange="
                (e) =>
                  setDeclarationsProp(e, 'PropertyProposedCleanEnergyLienExplanation')
              "
            />
          </v-col>

          <Radio
            label="If you are occupying this property, will you set aside space within the property to operate your own business?"
            :value="
              loanPropertyStore.getProperty()
                ? loanPropertyStore.getProperty().PropertyMixedUsageIndicator
                : null
            "
            @change="(e) => setMixedUseProp(e, 'PropertyMixedUsageIndicator')"
            :options="options2"
            class="text-2"
          />

          <!-- <v-col
            v-if="
              loanPropertyStore.getProperty() &&
              loanPropertyStore.getProperty().PropertyMixedUsageIndicator
            "
            sm="4"
            cols="10"
            class="field-value itemContainer explanation"
          >
            <TextArea
            class="textarea"
              :rows="1"
              :smVal="12"
              placeholder="Explanation"
              :value="declarations.PropertyMixedUsageExplanation"
              @onChange="(e) => setMixedUseProp(e, 'PropertyMixedUsageExplanation')"
            />
          </v-col> -->
        </v-row>
      </v-form>
    </template>
  </NewSummaryControl>
</template>
<style lang="scss" scoped>
:deep(.form-container) {
  margin: -10px !important;
  padding: 28px 30px !important;
}

.p-2 {
  padding: 10px;
}

.pt-2 {
  padding-top: 9px !important;
}

.pb-5 {
  padding-bottom: 26px !important;
}

.mb-6 {
  margin-bottom: 25px !important;
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
  padding-left: 40px;
  margin-top: -35px;
}

.summaryQuestion {
  flex: 7;
  padding-right: 10px;
}

.summaryValue {
  display: flex;
  justify-content: space-between;
  max-height: fit-content !important;
  width: 100%;
}

.summaryAnswer {
  flex: 3;
  text-align: end;
  padding-left: 10px;
  padding-right: 20px;
}

:deep(.v-radio-group) {
  .v-selection-control-group {
    height: 28px;
  }
}

.yesNoAnswer {
  font-weight: 600;
}

.summary-content-container {
  > :not(:last-child) {
    padding-bottom: 10px;
  }
}

.summary-content-container {
  padding-left: 0px;
}

:deep(.v-radio-group) {
  .v-input__control {
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: start;
    padding: 10.5px 10px;

    .v-label {
      font-size: 16px !important;
      opacity: 1 !important;
      white-space: normal !important;
      flex: 7;
      margin-inline-start: 0;
      letter-spacing: 0;
      line-height: 24px !important;
    }
  }

  .v-selection-control-group {
    flex-direction: row !important;
    flex: 3;
    margin-top: 0px !important;
    padding-left: 10px;
    margin-right: 16px;
    justify-content: end;
    gap: 8px;
    padding-top: 7px !important;
    margin-top: -1px !important;

    .v-selection-control {
      flex: none;

      .v-label {
        font-size: 12.8px !important;
        white-space: nowrap !important;
      }
    }
    i{
      font-size: 24px !important;
    }
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

.form-container {
  padding: 29px 30px !important;

  .field-value {
    padding-left: 57px !important;
    padding-right: 10px !important;
  }
}

.form-container .itemContainer {
  padding: 0px 10px;
  padding-left: 33px;
}

.property-type {
  align-items: start;
  padding: 1px 0px 0px 40px;
}

.v-row {
  margin: 0px;
}

.explanation {
  margin-top: -65px !important;

  .itemContainer {
    padding-left: 10px;
  }
}

.radioInputs {
  padding: 10px 0;
}

:deep(.purchase) {
  .v-selection-control-group {
    padding-top: 0 !important;
  }
}

.textarea {
  :deep(.v-field__input) {
    padding: 16px !important;
    padding-left: 12px !important;
  }
}

.text-1 {
  margin-top: -1px !important;
}

.text-2 {
  margin-top: -1px !important;
}

.v-radio-group .v-selection-control-group {
  padding: 0 !important;
  margin: 0 !important;
}

.v-input--selection-controls {
  padding-top: 0px !important;
}

.money {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

:deep(.radioInputs) {
  .titleText {
    margin-bottom: 0 !important;
  }
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
      padding-inline-start: 24px !important;
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
  :deep(.form-container) {
    margin: -10px !important;
    padding: 30px 10px !important;
  }
  :deep(.v-radio-group) {
    .v-selection-control-group {
      padding-top: 0px !important;
      .v-label{
        padding-right: 0px;
      }
    }
  }
}
</style>
