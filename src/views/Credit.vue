<script setup>
import { onMounted, ref, watch, computed, defineEmits } from "vue";
import { useRoute } from "vue-router";
import { useBorrowersStore } from "@/stores/borrowersStore";

const isCard = ref(true);
const hasImage = ref(true);
const headerTitle = ref("Order Credit Report");
const route = useRoute();
const borrowersStore = useBorrowersStore();
const emit = defineEmits(["setProgressVisibility"]);

const firstName = computed(() => {
  return borrowersStore.Borrower ? borrowersStore.Borrower.FirstName : "";
});
const coFirstName = computed(() => {
  return coBorrower.value ? coBorrower.value.FirstName : "";
});
const lastName = computed(() => {
  return borrowersStore.Borrower ? borrowersStore.Borrower.LastName : "";
});

const coBorrower = computed(() => {
  return borrowersStore.Borrowers.length && !borrowersStore.Borrower.CoBorrower
    ? borrowersStore.Borrowers.find(
        (item) => item.CoBorrower && item.LinkedBorrowerId === borrowersStore.Borrower.Id
      )
    : null;
});

const setProgressVisibility = ({ name }) => {
  emit("setProgressVisibility", { name, step: 3 });
};
onMounted(() => {
  setProgressVisibility({ name: route.name });
  headerTitle.value = route.meta.title;
  isCard.value = !!route.meta.isCard;
  hasImage.value = !!route.meta.hasImage;
  if (route.meta.isUserInfo) {
    headerTitle.value = "";
  }
});

watch(
  () => route.meta,
  (to) => {
    headerTitle.value = to.title;
    isCard.value = !!to.isCard;
    hasImage.value = !!to.hasImage;

    if (to.isUserInfo) {
      headerTitle.value += ` (${firstName.value}${
        coBorrower.value ? " & " + coFirstName.value : ""
      }- $22,176)`;
    }
  },
  { immediate: true }
);

</script>
<template>
  <div class="credit">
    <div class="main-header">
      <div class="header-title">
        <span>Credit & Liabilities - </span>
        <span class="font-weight-regular">{{ firstName }} {{ lastName }}</span>
        <span class="font-weight-regular" v-if="coBorrower">
          & {{ coBorrower.FirstName }} {{ coBorrower.LastName }}
        </span>
      </div>
    </div>
      <!-- @saveAndRedirect="({ route }) => saveAndAdvance(true, route)" -->
    <router-view
    ></router-view>
  </div>
</template>
