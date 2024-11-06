<script setup>
import { computed } from "vue";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { useLenderInfoStore } from "@/stores/lenderInfoStore";
import { useGeneralStore } from "@/stores/generalStore";
import Parties from '@/components/loanDetails/counselling/Parties.vue';
import Events from '@/components/loanDetails/counselling/Events.vue';

const borrowersStore = useBorrowersStore();
const lenderInfoStore = useLenderInfoStore();
const generalStore = useGeneralStore();

const parties = computed(()=>{
  return lenderInfoStore.getCounselingParties()
})

const borrowers = computed(() => {
  return borrowersStore.Borrowers;
});
</script>
<template>
  <v-card light>
    <v-card-title class="p-4">Counseling</v-card-title>
    <v-card-text>
      <Parties :parties="parties" :borrowers="borrowers" />
      <Events :parties="parties" :borrowers="borrowers" />
      <CustomButton value="Save" customClass="primary-button" class="button" @onHandleClick="generalStore.saveLoanPatches" />
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.no-background-active {
  &::after {
    background-color: transparent !important;
  }
}
.p-4 {
  padding: 16px;
}
.button{
  margin: 15px;
}
</style>
