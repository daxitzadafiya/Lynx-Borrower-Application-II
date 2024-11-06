<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { computed, defineEmits, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBorrowersStore } from "@/stores/borrowersStore";
// import { loanPatch } from "@/mixins/loanPatch";

const headerTitle = ref("Employment & Income");
const isUserInfo = ref(false);
const userInfo = ref(false);
const isDialog = ref(false);
const headerIcon = ref(null);
let icon = await import("@/assets/images/sidebar/employment-income.svg");
headerIcon.value = icon.default;

const emit = defineEmits(["setProgressVisibility"]);
const route = useRoute();
const router = useRouter();
const borrowersStore = useBorrowersStore();

const setProgressVisibility = ({ name }) => {
  emit("setProgressVisibility", { name, step: 5 });
};

// const { saveAndAdvance } = loanPatch();
onMounted(() => {
  setProgressVisibility({ name: route.name });
  headerTitle.value = route.meta.title || headerTitle.value;
  if (route.meta.isUserInfo) {
    isUserInfo.value = true;
    headerTitle.value += ` <span class="block-mobile">(${firstName.value} ${
      lastName.value
    } - $${getFormattedValue(mainIncome.value)})</span>`;
  } else {
    headerTitle.value = `${firstName.value}'s ` + headerTitle.value;
  }
});

const removeEmployment = () => {
  const name = route.name;
  let filtered = [];
  let newRoute = "/employmentandincome";

  if (name.includes("previous")) {
    filtered = borrowersStore
      .getBorrowerEmployment()
      .filter((item) => item.EmploymentStatusType !== "Previous");
    newRoute = "/employmentandincome/previous-employment";
  } else if (name.includes("additional")) {
    const additionalFiltered = additionalEmployments.value.filter(
      (item, i) => i !== employmentEditingIndex.value
    );
    filtered = borrowersStore
      .getBorrowerEmployment()
      .filter((item) => item.EmploymentClassificationType !== "Secondary");
    filtered.push(...additionalFiltered);
    newRoute = "/employmentandincome/additional-employment";
  } else {
    filtered = borrowersStore
      .getBorrowerEmployment()
      .filter((item) => item.EmploymentClassificationType !== "Primary");
  }

  borrowersStore.updateBorrower({ prop: "Employment", value: filtered });
  isDialog.value = false;
  router.push(newRoute);
};

const getIncomeSum = (incomes) => {
  return incomes.reduce(
    (a, c) =>
      (a += !isNaN(c.CurrentIncomeMonthlyTotalAmount)
        ? +c.CurrentIncomeMonthlyTotalAmount
        : 0),
    0
  );
};

const coBorrower = computed(() => {
  return borrowersStore.Borrowers.length && !borrowersStore.Borrower.CoBorrower
    ? borrowersStore.Borrowers.find(
        (item) => item.CoBorrower && item.LinkedBorrowerId === borrowersStore.Borrower.Id
      )
    : null;
});

const firstName = computed(() => {
  return borrowersStore.Borrower ? borrowersStore.Borrower.FirstName : "";
});

const lastName = computed(() => {
  return borrowersStore.Borrower ? borrowersStore.Borrower.LastName : "";
});

const mainIncome = computed(() => {
  if (borrowersStore.getBorrowerEmployment().length) {
    const currentEmployments = borrowersStore
      .getBorrowerEmployment()
      .filter((item) => item.EmploymentStatusType === "Current");
    return currentEmployments.reduce((acc, cur) => {
      if (cur.Income && cur.Income.length) {
        acc += getIncomeSum(cur.Income);
      }
      if (borrowersStore.Borrower.OtherIncome && borrowersStore.Borrower.OtherIncome) {
        acc += getIncomeSum(borrowersStore.Borrower.OtherIncome);
      }
      return acc;
    }, 0);
  }
  return 0;
});

const coIncome = computed(() => {
  if (!coBorrower.value) return 0;
  if (coBorrower.value.Employment && coBorrower.value.Employment.length) {
    return coBorrower.value.Employment.filter(
      (item) => item.EmploymentStatusType === "Current"
    ).reduce((acc, cur) => {
      if (cur.Income && cur.Income.length) {
        acc += getIncomeSum(cur.Income);
      }
      if (coBorrower.value.OtherIncome && coBorrower.value.OtherIncome) {
        acc += getIncomeSum(coBorrower.value.OtherIncome);
      }
      return acc;
    }, 0);
  }
  return 0;
});

const total = computed(() => {
  return mainIncome.value + coIncome.value;
});

const isCancelButton = computed(() => {
  const disabledRouteNames = [
    "employmentandincome",
    "employmentandincome-previous-employment",
    "employmentandincome-additional-employment",
    "employmentandincome-other-income",
    "employmentandincome-review",
    "employmentandincome-summary",
  ];
  return disabledRouteNames.indexOf(route.name) === -1;
});

watch(
  () => borrowersStore.Borrower,
  (newValue) => {
    if (isUserInfo.value) {
      userInfo.value = `(${firstName.value} ${lastName.value} - $${getFormattedValue(
        mainIncome
      )})`;
      headerTitle.value =
        headerTitle.value.split("(")[0] +
        `<span class="block-mobile">${userInfo.value}</span>`;
    }
  },
  { deep: true }
);

watch(
  () => route.meta,
  (to) => {
    headerTitle.value = to.title;
    isUserInfo.value = to.isUserInfo;
    if (isUserInfo.value) {
      headerTitle.value += ` <span class="block-mobile">${userInfo.value}</span>`;
    } else {
      headerTitle.value = `${firstName.value}'s ` + headerTitle.value;
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="accounts">
    <div class="main-header">
      <inline-svg class="header-icon" :src="headerIcon"></inline-svg>

      <div class="header-title">
        Employment & Income -
        <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
      </div>
    </div>
    <div class="header-secondary-title" v-if="isUserInfo">
      <div>{{ firstName }} {{ lastName }} ${{ getFormattedValue(mainIncome) || 0 }}</div>
      <div v-if="coBorrower">
        {{ coBorrower.FirstName }} {{ coBorrower.LastName }} ${{
          getFormattedValue(coIncome) || 0
        }}
      </div>
      <div>Total: ${{ getFormattedValue(total) || 0 }}</div>
    </div>
    <v-dialog v-model="isDialog" max-width="390">
      <v-card>
        <v-card-title class="mb-4 text-black--text">
          <span style="word-break: break-word; text-align: center"
            >Please, confirm you are going to remove employment information?
          </span></v-card-title
        >
        <v-card-text>
          <v-row class="justify-space-around">
            <CustomButton
              value="Yes"
              customClass="primary-button"
              width="130px"
              @onHandleClick="removeEmployment"
            ></CustomButton>
            <CustomButton
              value="No"
              customClass="button-no"
              width="130px"
              isOutlined="isOutlined"
              @onHandleClick="isDialog = false"
            ></CustomButton>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- @saveAndRedirect="({ route }) => saveAndAdvance(true, route)" -->
    <router-view />
  </div>
</template>
