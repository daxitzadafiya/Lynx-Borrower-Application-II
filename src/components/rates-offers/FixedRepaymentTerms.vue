<script setup>
import { computed, ref } from "vue";
import { useRatesAndOffersStore } from "@/stores/ratesAndOffers.js";

const ratesAndAccountStore = useRatesAndOffersStore();
const fixRate = ref([
  {
    title: "30 yr fixed",
    value: "30 year fixed",
  },
  {
    title: "25 yr fixed",
    value: "25 year fixed",
  },
  {
    title: "20 yr fixed",
    value: "20 year fixed",
  },
  {
    title: "15 yr fixed",
    value: "15 year fixed",
  },
  {
    title: "10 yr fixed",
    value: "10 year fixed",
  },
]);

const setRepaymentTerm = (repaymentTerms) => {
  ratesAndAccountStore.setRepaymentTerms(repaymentTerms);
};

const title = computed(() => {
  return "What repayment terms are your looking for?";
});

const repaymentTerms = computed(() => {
  return ratesAndAccountStore.getRepaymentTerms();
});

const isNextDisabled = computed(() => {
  return repaymentTerms.value.length == 0;
});
</script>
<template>
  <div>
    <div class="content-container image-content-type mt-0">
      <div class="content-header-container w-100">
        <div class="header-text">{{ title }}</div>
      </div>
      <div class="repayment-title">
        <p class="mb-0">
          Please note that longer terms typically yield lower monthly payments.
        </p>
      </div>
      <v-btn-toggle
        class="btnToggleGroup"
        :model-value="repaymentTerms"
        @update:model-value="setRepaymentTerm"
        :multiple="true"
      >
        <ToggleCard
          v-for="item in fixRate"
          :key="item.title"
          :value="item.value"
          :colsVal="12"
          :smVal="6"
          :mdVal="4"
          :lgVal="3"
          :isRatesOffers="true"
        >
          <p>{{ item.title }}</p>
        </ToggleCard>
      </v-btn-toggle>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        ButtonType="secondary"
        NextBtnWidth="100px"
        :HasDefaultNavigation="false"
        :RequestedNextPath="'ratesandoffers/monthly-payment'"
        :ConditionsMet="isNextDisabled"
      >
      </NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.v-btn-group--density-default.v-btn-group {
  height: auto;
}
.image-content-type {
  min-height: calc(100vh - 360px);
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 5px !important;

}

.itemContainer {
  .cardBtn {
    .v-btn__content {
      p {
        color: $dark-grayV2;
      }
    }
  }
  :deep(.removeBackground) {
    border: 2px solid rgb(0 0 0 / 14%) !important;
  }
}

.navigation-container {
  border: 0 !important;
  .navButtonsContianer{
    padding-left:2px !important;
    padding-right:0px !important;
  }
}

:deep(.itemContainer .cardBtn svg *) {
  fill: $dark-grayV2 !important;
}

:deep(.itemContainer .cardBtn svg *) {
  fill: $dark-grayV2 !important;
}

:deep(.mdi-checkbox-marked-circle) {
  display: none !important;
}

:deep(.itemContainer .cardBtn.v-btn--active.v-btn) {
  border-color: $primaryV2 !important;
}

:deep(.itemContainer .cardBtn.v-btn--active.v-btn p) {
  color: $primaryV2 !important;
}

:deep(.itemContainer .cardBtn.v-btn--active svg *) {
  fill: $primaryV2 !important;
}

:deep(.btnToggleGroup .form-container) {
  justify-content: flex-start !important;
}

:deep(.itemContainer .cardBtn:hover .btnContent) {
  opacity: 100 !important;
}

.w-100 {
  width: 100% !important;
}

.content-header-container {
  background: $table-header-bg !important;
  padding: 16px 15px !important;
}
.header-text {
  color: $dark-grayV2;
  font-weight: 500 !important;
  font-size: 16px;
}

.row {
  margin: 0 !important;
  padding: 16px !important;
}

.repayment-title {
  padding: 16px !important;

  p {
    font-size: 14px;
    color: $dark-grayV2 !important;
  }
}

:deep(.btnToggleGroup) {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px 16px;
  padding: 8px 16px;
}

:deep(.itemContainer) {
  max-width: 100% !important;
  padding: 0 !important;
}

:deep(.itemContainer .cardBtn) {
  height: 70px !important;
  p{
    margin-top: 0 !important;
  }
}

@media (max-width: $lg-tablet-width) {
  .btnToggleGroup {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: $tablet-width) {
  .btnToggleGroup {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: $sm-width) {
  .btnToggleGroup {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>