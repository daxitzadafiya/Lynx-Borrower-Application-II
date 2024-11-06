<script setup>
import { computed, defineEmits, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useBorrowersStore } from "@/stores/borrowersStore";

const emit = defineEmits(["setProgressVisibility"]);
const headerTitle = ref("Declarations");
const route = useRoute();
const borrowersStore = useBorrowersStore();
const headerIcon = ref(null);
let icon = await import("@/assets/images/sidebar/declarations.svg");
headerIcon.value = icon.default;

const setProgressVisibility = ({ name }) => {
  emit("setProgressVisibility", { name, step: 7 });
};

const declarations = computed(() => {
  return borrowersStore.Borrower && borrowersStore.Borrower.Declarations ? borrowersStore.Borrower.Declarations : {};
});

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
  headerTitle.value =
    `${firstName.value}'s ` + (route.meta.title || headerTitle.value);
});
</script>
<template>
  <div class="declarations">
    <div class="main-header">
      <inline-svg class="header-icon" :src="headerIcon"></inline-svg>
      <div class="header-title">
        Declarations -
        <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
      </div>
    </div>
    <!--<div class="header-secondary-title" v-html="headerTitle"></div>-->
    <!-- @saveAndRedirect="({ route }) => saveAndAdvance(true, route)" -->
    <router-view :declarations="declarations"></router-view>
  </div>
</template>
