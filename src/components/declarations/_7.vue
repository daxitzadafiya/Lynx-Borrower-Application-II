<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { computed, defineProps } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { loanPatch } from "@/mixins/loanPatch";

const { isOnlyNum } = number();
const borrowersStore = useBorrowersStore();
const { saveAndAdvance } = loanPatch();

const props = defineProps({
  declarations: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const setDeclarationsProp = (val) => {
  let Declarations = {
    ...props.declarations,
    UndisclosedBorrowedFundsAmount: val,
  };
  Declarations.UndisclosedBorrowedFundsIndicator = !!Declarations.UndisclosedBorrowedFundsAmount;
  if (!Declarations.UndisclosedBorrowedFundsIndicator) {
    delete Declarations.UndisclosedBorrowedFundsAmount;
  }
  borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
};

const checkAmountAndRedirect = () => {
  if (!props.declarations || !props.declarations.UndisclosedBorrowedFundsAmount) {
    let Declarations = {
      ...props.declarations,
      UndisclosedBorrowedFundsIndicator: false,
    };
    delete Declarations.UndisclosedBorrowedFundsAmount;
    borrowersStore.updateBorrower({ prop: "Declarations", value: Declarations });
  }
  saveAndAdvance(true);
};

const isNextDisabled = computed(() => {
  return !props.declarations || !props.declarations.UndisclosedBorrowedFundsAmount;
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Are you borrowing any money for this real estate transaction?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <div class="form-container">
        <span class="main__subtitle">
          Are you borrowing any money for this real estate transaction (e.g., money for
          your closing costs or down payment) or obtaining any money from another party,
          such as the Seller or Real Estate Agent, that you have not disclosed on this
          loan application?
        </span>
        <TextBox
          placeholder="Amount Borrowed"
          :value="getFormattedValue(declarations.UndisclosedBorrowedFundsAmount)"
          @input="(e) => setDeclarationsProp(+e.target.value.replace(/,/g, ''))"
          @keypress="(e) => isOnlyNum(e, true)"
          prefix="$"
        />
      </div>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="checkAmountAndRedirect"
        :ConditionsMet="isNextDisabled"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-field__field) {
  align-items: center !important;
  height: 40px;
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
</style>
