<script setup>
import { defineEmits, computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBorrowersStore } from "@/stores/borrowersStore";

const borrowersStore = useBorrowersStore();
const route = useRoute();
const emit = defineEmits(["setProgressVisibility"]);
const headerTitle = ref("Accounts & Assets");

const firstName = computed(() => {
  return borrowersStore.Borrower ? borrowersStore.Borrower.FirstName : "";
});

const lastName = computed(() => {
  return borrowersStore.Borrower ? borrowersStore.Borrower.LastName : "";
});

const setProgressVisibility = ({ name }) => {
  emit("setProgressVisibility", { name, step: 4 });
};

onMounted(() => {
  setProgressVisibility({ name: route.name });
  headerTitle.value = route.meta.title;
});
</script>
<template>
  <div class="accounts">
    <div class="main-header">
      <div class="header-title">
        Account & Assets -
        <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
      </div>
    </div>
    <div class="header-secondary-title">{{ headerTitle }}</div>
    <!-- @saveAndRedirect="({ route }) => saveAndAdvance(true, route)" -->
    <router-view />
  </div>
</template>

<style lang="scss" scoped>

</style>
