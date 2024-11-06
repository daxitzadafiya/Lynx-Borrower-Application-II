<script setup>
import { computed, watch, ref, onMounted, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import { useBorrowersStore } from '@/stores/borrowersStore'
import { useLoanPropertyStore } from '@/stores/loanPropertyStore'
const route = useRoute()

const isBorrowersPage = computed(() => {
  return route.name === 'borrowers'
})

const borrowersStore = useBorrowersStore();
const loanPropertyStore = useLoanPropertyStore();
const emit = defineEmits(['setProgressVisibility'])
const firstName = computed(() => {
    return borrowersStore.getBorrower().FirstName;
})

const lastName = computed(() => {
    return borrowersStore.getBorrower().LastName;
})

const currentBorrowerInfo = ref(null);

watch(
  () => borrowersStore.Borrower,
  (newValue) => {
    currentBorrowerInfo.value = newValue 
  },
  { deep: true }
)

onMounted(() => {
  currentBorrowerInfo.value = borrowersStore.Borrower 
});

const setProgressVisibility = ({ name }) => {
   emit("setProgressVisibility", { name, step: 1 });
}

const updateCurrentBorrower = ({ prop, value }) => {
  borrowersStore.updateBorrower({ prop, value })
};

</script>
<template>
  <div
    v-if="borrowersStore.Borrower"
    :class="{ isBorrowersPage: isBorrowersPage }"
    class="borrowers"
  >
    <div
      v-if="route.name !== 'borrowers'"
      class="main-header"
    >
      <div class="header-title">
        Borrowers <span class="font-weight-regular" v-if="firstName || lastName"> - </span>
        <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
      </div>
    </div>
    <router-view
      :currentBorrower="currentBorrowerInfo"
      :property="loanPropertyStore.property"
      @setProgressVisibility="setProgressVisibility"
      @updateBorrower="updateCurrentBorrower"
    />
  </div>
</template>
<style scoped lang="scss">
.isBorrowersPage {
  display: flex;
  justify-content: start;
  align-items: start;
  margin-top: 32px;
}
.borrowers {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
