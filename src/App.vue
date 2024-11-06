<script async setup>
import { onMounted } from 'vue'
import overlaySpinner from '@/components/UI/overlaySpinner.vue'
import { useBrandingStore } from '@/stores/brandingStore'
import ChangePassword from "@/components/user-account/ChangePassword.vue"
import EditProfile from "@/components/user-account/EditProfile.vue"
import Invite from "@/components/borrowers/invite.vue"
import ExpectedRentalIncome from "@/components/loan-property/ExpectedRentalIncome.vue"
import OrderPopup from '@/components/credit/OrderPopup.vue'
import AddEditLiabilityDialog from '@/components/credit/liabilities/AddEditLiabilityDialog.vue'
import EditDerogatoryDialog from '@/components/credit/derogatoryItems/EditDerogatoryDialog.vue'
import MortgageLoansDialog from '@/components/real-estate/MortgageLoansDialog.vue'
import { ref } from "vue"
import { useUsStatesStore } from './stores/usStatesStore'
import { useGeneralStore } from "@/stores/generalStore";

const brandingStore = useBrandingStore()
const usStatesStore = useUsStatesStore();
const generalStore = useGeneralStore()

const isHostedMode = ref(false)

onMounted(async () => {
  await brandingStore.setBranding();
  await usStatesStore.getUsStates();
  isHostedMode.value = brandingStore.isHostedMode
});

</script>

<template>
  <v-app id="lynx-app" :class="isHostedMode ? 'hosted-app-back' : ''">
    <Suspense>
      <v-layout>
        <RouterView />
        <EditProfile></EditProfile>
        <ChangePassword></ChangePassword>
        <Invite />
        <ExpectedRentalIncome />
        <overlaySpinner v-show="generalStore.requestCounter" />
        <OrderPopup />
        <AddEditLiabilityDialog></AddEditLiabilityDialog>
        <EditDerogatoryDialog></EditDerogatoryDialog>
        <MortgageLoansDialog
          v-if="generalStore.onlayComponent == 'mortgage-loan'"
        ></MortgageLoansDialog>
      </v-layout>
    </Suspense>
  </v-app>
</template>
<style>
#lynx-app>.v-application--wrap {
  height: 100%;
  min-height: 100%;
}

.hosted-app-back {
  background: #f6f9fc !important;
}

.v-layout {
  overflow: visible !important;
}
</style>
