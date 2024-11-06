<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { number } from "@/mixins/onlyNum";
import { computed, ref } from "vue";
import { useRealEstateStore } from "@/stores/realEstateStore";

const { isOnlyNum } = number();
const isAdditional = ref(null);
const realEstateStore = useRealEstateStore();

const expenses = ref([
  {
    text: "Association Dues",
    value: "PropertyAssociationDuesExpenseAmount",
  },
  { text: "Insurance", value: "PropertyInsuranceExpenseAmount" },
  { text: "Taxes", value: "PropertyTaxesExpenseAmount" },
]);

const getCorrectText = (key) => {
  const expense = expenses.value.find((item) => item.value === key);
  return expense.text;
};

const setNewExpenseTitle = (prop) => {
  if (!realEstateStore.getRealEstate().length) {
    realEstateStore.setRealEstate([{ [prop]: "" }]);
  } else {
    const realEstates = realEstateStore.getRealEstate().map((item, i) => {
      if (i === realEstateStore.getRealEstateEditingIndex()) {
        item[prop] = "";
      }
      return item;
    });
    realEstateStore.setRealEstate(realEstates);
  }
  isAdditional.value = false;
};

const setAmount = (value, prop) => {
  const realEstates = realEstateStore.getRealEstate().map((item, i) => {
    if (i === realEstateStore.getRealEstateEditingIndex()) {
      item[prop] = value;
      item.PropertyMaintenanceExpenseAmount = getAmountsSum(item);
    }
    return item;
  });
  realEstateStore.setRealEstate(realEstates);
};

const getAmountsSum = (obj) => {
  return Object.keys(obj).reduce((acc, cur) => {
    if (keys.value.indexOf(cur) !== -1 && !isNaN(obj[cur])) {
      acc += obj[cur] || 0;
    }
    return acc;
  }, 0);
};

const remove = (prop) => {
  let realEstate = { ...currentRealEstate.value };
  delete realEstate[prop];
  realEstate.PropertyMaintenanceExpenseAmount = getAmountsSum(realEstate);
  let realEstates = [...realEstateStore.getRealEstate()];
  realEstates[realEstateStore.getRealEstateEditingIndex()] = realEstate;
  realEstateStore.setRealEstate(realEstates);
};

const currentRealEstate = computed(() => {
  return (
    realEstateStore.getRealEstate()[realEstateStore.getRealEstateEditingIndex()] || {}
  );
});

const total = computed(() => {
  return keys.value.reduce((acc, cur) => {
    if (cur in currentRealEstate.value)
      acc += !isNaN(currentRealEstate.value[cur]) ? +currentRealEstate.value[cur] : 0;
    return acc;
  }, 0);
});

const isAllExpenses = computed(() => {
  return filteredKeys.value.length === keys.value.length;
});

const options = computed(() => {
  return expenses.value.filter((item) => !(item.value in currentRealEstate.value));
});

const filteredKeys = computed(() => {
  let filteredKeys = [];
  for (var i = 0; i < keys.value.length; i++) {
    if (keys.value[i] in currentRealEstate.value) {
      filteredKeys.push(keys.value[i]);
    }
  }
  return filteredKeys;
});

const keys = computed(() => {
  return expenses.value.map((x) => x.value);
});
</script>
<template>
  <v-form class="fast-fail form-outer-container">
    <div v-if="filteredKeys.length">
      <v-row class="form-container deleteAbleItem" v-for="key in filteredKeys" :key="key">
        <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
          <v-btn dense="dense" icon="icon" @click="remove(key)" elevation="0">
            <v-icon small="small">mdi-close</v-icon>
          </v-btn>
        </v-col>
        <TextBox
          :readOnly="true"
          placeholder="Housing Expense"
          :value="getCorrectText(key)"
        />
        <TextBox
          prefix="$"
          placeholder="Monthly Amount"
          :value="getFormattedValue(currentRealEstate[key])"
          @input="(e) => setAmount(+e.target.value.replace(/,/g, ''), key)"
          @keypress="(e) => isOnlyNum(e, true)"
        />
      </v-row>
    </div>
    <v-row class="form-container deleteAbleItem" v-if="isAdditional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="isAdditional = false" elevation="0">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <SelectBox
        :items="options"
        itemText="text"
        itemValue="value"
        placeholder="Housing Expense"
        @change="(e) => setNewExpenseTitle(e)"
      />
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="8">
        <v-btn
          class="addItemBtn"
          dense="dense"
          plain="plain"
          elevation="0"
          @click="isAdditional = true"
          v-if="!isAllExpenses"
        >
          <v-icon small="small">mdi-plus</v-icon
          ><span class="addBtnText">Add Expense</span>
        </v-btn>
      </v-col>
      <v-col class="itemContainer totalsColumn" sm="4" cols="12"
        >Total: ${{ getFormattedValue(total) || 0 }}</v-col
      >
    </v-row>
  </v-form>
</template>
<style lang="scss" scoped>
:deep(.form-container) {
  margin: -10px -10px;
}
.deleteAbleItem {
  margin-bottom: -45px !important;
}
.itemDeleteCrossContainer {
  :deep(.v-btn--icon.v-btn--density-default) {
    height: 36px !important;
    width: 36px !important;
    background: transparent;
  }
  :deep(.v-icon) {
    font-size: 16px;
    color: $close-icon-color !important;
  }
}
.form-container.addItemBtnContainer {
  margin-top: -30px !important;
  .addItemBtn {
    max-width: unset !important;
  }
  i {
    padding: 12px !important;
    font-size: 16px !important;
  }
}
</style>
