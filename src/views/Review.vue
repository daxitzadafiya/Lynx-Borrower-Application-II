<script setup>
import { useRoute } from "vue-router";
import { useBorrowersStore } from "@/stores/borrowersStore";
import { computed, onMounted, defineEmits, ref } from "vue";

const headerIcon = ref(null);
let icon = await import("@/assets/images/sidebar/review.svg");
headerIcon.value = icon.default;

const emit = defineEmits(["setProgressVisibility"]);
const route = useRoute();
const borrowersStore = useBorrowersStore();

const setProgressVisibility = ({ name }) => {
  emit("setProgressVisibility", { name, step: 11 });
};

const firstName = computed(() => {
  return borrowersStore.Borrower ? borrowersStore.Borrower.FirstName : "";
});

const lastName = computed(() => {
  return borrowersStore.Borrower ? borrowersStore.Borrower.LastName : "";
});
onMounted(() => {
  setProgressVisibility({ name: route.name });
});
</script>

<template>
  <div class="review">
    <div class="main-header">
      <inline-svg class="header-icon stroked" :src="headerIcon"></inline-svg>
      <div class="header-title">
        Review -
        <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
      </div>
    </div>
    <!-- @saveAndRedirect="({ route }) => saveAndAdvance(true, route)" -->
    <router-view></router-view>
  </div>
</template>
