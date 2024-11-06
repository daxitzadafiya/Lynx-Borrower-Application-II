<script setup>
import { onMounted, ref, computed } from 'vue';
import ToggleCard  from '@/components/core-components/ToggleCard.vue'
import InlineSvg from 'vue-inline-svg';
import { useBorrowersStore } from '@/stores/borrowersStore.js'
const { getSpecificResidence, updateResidenceProp } = useBorrowersStore()
const type = ref("Current");
const activeStatus = ref(null);
const statuses = ref([
  {
    title: "Rent",
    value: "Rent"
  },
  {
    title: "Own",
    value: "Own"
  },
  {
    title: "Living Rent Free",
    value: "LivingRentFree"
  }
]);

const currentResidence = computed(() => {return getSpecificResidence("Current");});
let imageList = await Promise.all([
import("@/assets/images/borrowers/rent.svg"),
import("@/assets/images/borrowers/own.svg"),
import("@/assets/images/borrowers/rent-free.svg"),
]);
statuses.value.map((status,index) => status.src= imageList[index].default);
onMounted(async () => {
  let activatedStatus = statuses.value.find((item)=>item.value == currentResidence.value.ResidencyBasisType)
  activeStatus.value = activatedStatus?.value;
});

</script>

<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Do you have any living expenses at
        {{ currentResidence ? currentResidence.AddressLineText : "" }}?
      </div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-btn-toggle
        class="btnToggleGroup"
        v-model="activeStatus"
        @update:modelValue="value=>{updateResidenceProp({ type, value, prop: 'ResidencyBasisType' })}"
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
      <NavigationButtons :ConditionsMet="!activeStatus"></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.v-btn-group--density-default.v-btn-group {
    height: auto !important;
}
</style>