<script setup>
import { useUserStore } from '@/stores/userStore'
import { useChangePasswordStore } from '@/stores/changePasswordStore';
import { useUpdateProfileStore } from '@/stores/updateProfileStore';
import { ref } from 'vue';
import Desktop from '../headers/Desktop.vue'
import { useGeneralStore } from '@/stores/generalStore';
import Mobile from '../headers/Mobile.vue'
import TestingNavMenu from '@/components/TestingNavMenu.vue'

const { logOut } = useUserStore()
const changePasswordStore = useChangePasswordStore();
const updateProfileStore = useUpdateProfileStore();
const { currentLoan, toggleIsOnlay, getIsTestingNav } = useGeneralStore()

const items = ref([
  { label: "LOAN AMOUNT", data: "", isIcon: true, isCurrency: true },
  {
    label: "INTEREST RATE",
    data: "",
    isIcon: true,
    isPercent: true,
    multiple: 100
  },
  {
    label: "DEBT TO INCOME",
    data: "",
    isIcon: true,
    isPercent: true,
    multiple: 1
  },
  { label: "EST.CLOSING DATE", data: "", isIcon: false }
]);
const newMessages = ref(2);
const accountItems = ref([
  { title: "Profile", icon: "settings" },
  { title: "Change Password", icon: "security" },
  { title: "Logout", icon: "logout" }
])

const loanItems = () => {
  let result = JSON.parse(JSON.stringify(items.value));
  if (currentLoan) {
    result = result.map(item => {
      if (item.label === "LOAN AMOUNT") {
        item.data = currentLoan.LoanAmount || 0;
      }
      if (item.label === "INTEREST RATE") {
        item.data =
          currentLoan.LenderLoanInformation &&
            currentLoan.LenderLoanInformation.MortgageLoanInformation
            ? currentLoan.LenderLoanInformation.MortgageLoanInformation
              .NoteRatePercent
            : "";
      }
      if (item.label === "DEBT TO INCOME") {
        item.data = currentLoan.DebtToIncomeRatio || 0;
      }
      if (item.label === "EST.CLOSING DATE") {
        item.data = currentLoan.EstimatedClosingDate;
      }
      return item;
    })
  }
  return result;
}

const address = () => {
  let result = "";
  if (currentLoan) {
    const { Property, LoanPurposeType } = currentLoan;
    if (Property && Property.AddressLineText) {
      const { AddressLineText, CityName, StateCode, PostalCode } = Property;
      result = `<span class='header-label-text' style='font-size: 11px'>${LoanPurposeType ? LoanPurposeType.toUpperCase() : ""
        }</span><br> ${AddressLineText} <br> ${CityName || ""} ${StateCode ||
        ""}, ${PostalCode || ""}`;
    }
  }
  return result;
}

const makeAction = async ({ title }) => {
  switch (title) {
    case "Profile":
      await updateProfileStore.onToggle(true);
      toggleIsOnlay({
        onlayComponent: "proflile",
        isOnlay: true
      });
      break;
    case "Change Password":
      await changePasswordStore.onToggle(true);
      toggleIsOnlay({
        onlayComponent: "changePassword",
        isOnlay: true
      });
      break;
    default:
      await logOut()
  }

}
</script>
<template>
  <header class="header position-fixed top-0 w-100">
    <v-container>
      <div class="testingMenuWrapper">
        <div class="testingMenuInnerWrapper">
          <TestingNavMenu class="testingNav" v-if="getIsTestingNav()"></TestingNavMenu>
          </div>
        
        </div>
      <v-row class="px-4" justify="space-between" align="center">
        <div class="desktop">
          <Desktop :items="loanItems()" :address="address()" :accountItems="accountItems" @makeAction="makeAction">
          </Desktop>
        </div>
        <div class="mobile">
          <Mobile :items="loanItems()" :address="address()" :accountItems="accountItems" :counter="newMessages" @makeAction="makeAction"></Mobile>
        </div>
      </v-row>
    </v-container>
  </header>
</template>
<style lang="scss" scoped>
.header {
  z-index: 999 !important;
  min-height: 88px;
  display: flex;
  align-items: center;

  background-color: $primary;

  &-account-list {
    padding: 0;
  }

  &-account-list-item {
    &:not(:last-child) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.17);
    }
  }

  &-account-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: $white;

    &.active {
      .v-icon:last-child {
        transform: rotate(180deg);
      }
    }

    .v-icon {
      transition: transform 0.3s;
    }

    span {
      margin-right: 8px;
    }
  }
}

:deep(.text-primary) {
  color: $primary !important;
}

:deep(.header-label-text) {
  color: $header-label-text-color;
}

:deep(.mdi-help-circle){
    color: $header-label-text-color;
}

.mobile {
  display: none;
}

@media (max-width: $sm-tablet-width) {
  .desktop {
    display: none;
  }

  .mobile {
    display: block;
  }
  
  .header{
    height: fit-content !important;
    min-height: auto !important;
  }
}
.testingNav {
  max-width: 280px;
  position: absolute;
  margin: 0 auto;
  transform: translateX(-50%);
  left: 50vw;
  top: 80px;
  width: 100vw;
  z-index: 100;
  @media only screen and (min-width: 1281px) {
    left: 0px;
    top: 175px;
    transform: translateX(5px);
  }
}
.testingMenuWrapper {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  pointer-events: none;
  z-index: 10000;
  .testingMenuInnerWrapper {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 1450px;
    margin: 0 auto;
    .testingNav {
      pointer-events: all;
    }
  }
}
</style>
