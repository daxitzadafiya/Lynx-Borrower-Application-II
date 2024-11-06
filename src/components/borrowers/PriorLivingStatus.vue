<script setup>
import { computed, onMounted, ref } from "vue";
import ToggleCard from "@/components/core-components/ToggleCard.vue";
import InlineSvg from "vue-inline-svg";
import { useBorrowersStore } from "@/stores/borrowersStore.js";
const { getSpecificResidence, updateResidenceProp } = useBorrowersStore();
const type = ref("Prior");
const currentResidence = computed(() => {
  return getSpecificResidence("Prior");
});
const activeStatus = ref(null);
const statuses = ref([
  {
    title: "Rented",
    value: "Rent",
  },
  {
    title: "Owned",
    value: "Own",
  },
  {
    title: "Lived Rent Free",
    value: "None",
  },
]);

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

let imageList = await Promise.all([
  import("@/assets/images/borrowers/rent.svg"),
  import("@/assets/images/borrowers/own.svg"),
  import("@/assets/images/borrowers/rent-free.svg"),
]);
statuses.value.map((status, index) => (status.src = imageList[index].default));
onMounted(async () => {
  let activatedStatus = statuses.value.find(
    (item) => item.value == currentResidence.value.ResidencyBasisType
  );
  activeStatus.value = activatedStatus?.value;
});
</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Did you have any living expenses at
        {{ currentResidence ? currentResidence.AddressLineText : "" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        v-model="activeStatus"
        @update:modelValue="
          (value) => {
            updateResidenceProp({ type, value, prop: 'ResidencyBasisType' });
          }
        "
      >
        <v-row class="form-container">
          <ToggleCard
            v-for="({ src, title, value }, index) in statuses"
            :key="index"
            :value="value"
          >
            <inline-svg
              :src="src"
              :class="value === 'None' ? 'stroked' : ''"
            ></inline-svg>
            <p>{{ title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (max-width: $sm-tablet-width) {
  .text-block {
    margin-top: 0;
    &__col {
      padding-top: 20px;
    }
  }
}
.v-btn-group--density-default.v-btn-group {
  height: auto !important;
}
</style>
