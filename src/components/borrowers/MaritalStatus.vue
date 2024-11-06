<script setup>
import { onMounted, ref,defineProps, defineEmits, watch } from "vue";
import ToggleCard from "@/components/core-components/ToggleCard.vue";
import InlineSvg from "vue-inline-svg";


const props = defineProps({
  currentBorrower: {
    type: Object,
    default: {},
  },
  property: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["updateBorrower"]);

const currentBorrower = ref(props.currentBorrower);

watch(
  () => props.currentBorrower,
  (newValue) => {
    currentBorrower.value = newValue;
  },
  { deep: true }
);

const activeStatus = ref(null);
const statuses = ref([
  {
    title: "Unmarried",
  },
  {
    title: "Married",
  },
  {
    title: "Separated",
  },
]);


const setMaritalStatus = (title) => {
  emit("updateBorrower", { prop: "MaritalStatusType", value: title });
  activeStatus.value = title;
};
let imageList = await Promise.all([
  import("@/assets/images/borrowers/unmarried.svg"),
  import("@/assets/images/borrowers/married.svg"),
  import("@/assets/images/borrowers/separated.svg"),
]);
statuses.value.map((status, index) => (status.src = imageList[index].default));
onMounted(async () => {
  activeStatus.value = currentBorrower.value?.MaritalStatusType || ""
});
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Borrower Marital Status</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        v-model="activeStatus"
        @update:modelValue="value=>{setMaritalStatus(value)}"
      >
        <v-row class="form-container">
          <ToggleCard v-for="item in statuses" :key="item.title" :value="item.title">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="!activeStatus"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.v-btn-group--density-default.v-btn-group {
  height: auto !important;
}
</style>
