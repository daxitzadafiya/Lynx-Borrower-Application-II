
<script setup>
import { ref, onMounted, computed } from 'vue'
import CreditResponse from '../images/loan-property/CreditResponse.vue';
import { useBrandingStore } from '@/stores/brandingStore';
import { useLoanPropertyStore } from '@/stores/loanPropertyStore'

const purposes = ref([
  {
    title: 'Purchase',
    value: 'Purchase'
  },
  {
    title: 'Refinance',
    value: 'Refinance'
  },
  {
    title: 'New Home Construction',
    value: 'Construction'
  }
])

let imageList = await Promise.all([
  import('@/assets/images/loan-property/purchase.svg'),
  import('@/assets/images/loan-property/refinance.svg'),
  import('@/assets/images/loan-property/construction.svg')
])
purposes.value.map((purpose, index) => (purpose.src = imageList[index].default))

const brandingStore = useBrandingStore();
const loanPropertyStore = useLoanPropertyStore();
const LoanPurposeType = ref(loanPropertyStore.getLoanPurposeType());

const section = computed(()=>{
  return brandingStore.getBrandingSection('LoanAndProperty')
})

const introSlide = computed(()=>{
  return brandingStore.getIsHostedMode() && section.value && section.value.IntroSlide
});

const title = computed(()=>{
  return(
    (introSlide.value && introSlide.Title || "What is the purpose of the Loan you are applying for?")
  )
});

const nextDisabled = computed(()=>{
  LoanPurposeType.value == null || LoanPurposeType.value === "Construction"
});

const setPurposeAndRedirect = (title) => {
  loanPropertyStore.setLoanPurposeType(title)
};
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <div class="titleText">{{ title }}</div>
      <div class="credit-img">
        <CreditResponse />
      </div>
    </div>
    <div class="inner-content-container">
      <v-form fast-fail="fast-fail">
        <v-btn-toggle
          class="btnToggleGroup"
          v-model="LoanPurposeType"
          @update:modelValue="setPurposeAndRedirect"
        >
          <v-row class="form-container">
            <ToggleCard
              v-for="{ src, title, value } in purposes"
              :key="title"
              :value="value"
            >
              <inline-svg :src="src"></inline-svg>
              <p>{{ title }}</p>
            </ToggleCard>
          </v-row>
        </v-btn-toggle>
      </v-form>
    </div>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="nextDisabled"></NavigationButtons>
    </div>
  </div>
</template>
  

  
<style lang="scss" scoped>
.inner-content-container {
  width: 100%;
}
.v-btn-group--density-default.v-btn-group {
  height: inherit;
  padding: 10px 4px;
}
.btnToggleGroup .form-container {
  align-items: center;
}
@media (max-width: $mobile-width) {
  .image-content-type .image-container .credit-img svg {
    width: 100%;
    height: 100%;
  }
}
.form-container,
.inner-content-container {
  padding: 6px 14px;
}
.image-content-type .image-container .titleText {
  color: $content-black;
}
</style>
  