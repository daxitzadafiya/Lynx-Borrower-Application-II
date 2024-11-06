<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useBorrowersStore } from "@/stores/borrowersStore";

const emit = defineEmits(["setProgressVisibility"]);
const headerTitle = ref("Documents");
const route = useRoute();
const borrowersStore = useBorrowersStore();
const headerIcon = ref(null);
let icon = await import("@/assets/images/sidebar/documents.svg");
headerIcon.value = icon.default;

const setProgressVisibility = ({ name }) => {
  emit("setProgressVisibility", { name, step: 7 });
};

const firstName = computed(() => {
  return borrowersStore.Borrower.FirstName || "";
});

const lastName = computed(() => {
  return borrowersStore.Borrower.LastName || "";
});

watch(route, (to) => {
  headerTitle.value = `${firstName.value}'s ` + to.meta.title;
});
onMounted(() => {
  setProgressVisibility({ name: route.name });
  headerTitle.value = `${firstName.value}'s ` + (route.meta.title || headerTitle.value);
});
</script>
<template>
  <div class="documents">
    <div class="main-header">
      <inline-svg class="header-icon" :src="headerIcon"></inline-svg>
      <div class="header-title">
        Documents -
        <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
      </div>
    </div>
      <!-- @saveAndRedirect="({ route }) => saveAndAdvance(true, route)" -->
    <router-view
    ></router-view>
  </div>
</template>
