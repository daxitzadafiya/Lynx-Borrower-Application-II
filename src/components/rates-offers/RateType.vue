<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRatesAndOffersStore } from "@/stores/ratesAndOffers.js";

const ratesAndAccountStore = useRatesAndOffersStore();
const rateTypes = ref([
  {
    title: "Fixed Rate",
    value: "Fixed",
  },
  {
    title: "Adjustable Rate",
    value: "Adjustable",
  },
]);

let imageList = await Promise.all([
  import("@/assets/images/rates-offers/fixed-rate.svg"),
  import("@/assets/images/rates-offers/adjustable-rate.svg"),
]);

rateTypes.value.map((type, index) => (type.src = imageList[index].default));
const requestedNextPath = ref(null);

const activeRateType = computed(() => {
  return ratesAndAccountStore.getRateType();
});

const nextRoute = computed(() => {
  return activeRateType.value == "Fixed"
    ? "/ratesandoffers/fixed-repayment-terms"
    : "/ratesandoffers/arm-repayment-terms";
});

const isNextDisabled = computed(() => {
  return activeRateType.value === null || activeRateType.value === "";
});

const onRateTypeSelect = (rateType) => {
  rateType
    ? ratesAndAccountStore.setRateType(rateType)
    : ratesAndAccountStore.setRateType(null);
};

watch(activeRateType, (newStatus) => {
  requestedNextPath.value = nextRoute.value;
});
onMounted(() => {
  requestedNextPath.value = nextRoute.value;
});
</script>

<template>
  <div>
    <div class="content-container image-content-type mt-0">
      <div class="content-header-container w-100">
        <div class="header-text">Do you want a fixed rate or adjustable rate loan?</div>
      </div>
      <v-btn-toggle class="btnToggleGroup" :model-value="activeRateType" @update:model-value="onRateTypeSelect">
        <v-row class="form-container">
          <ToggleCard v-for="item in rateTypes" :key="item.title" :value="item.value" :colsVal="12" :smVal="6"
            :mdVal="4" :lgVal="3" :isRatesOffers="true">
            <inline-svg :src="item.src"></inline-svg>
            <p>{{ item.title }}</p>
          </ToggleCard>
        </v-row>
      </v-btn-toggle>
    </div>
    <div class="navigation-container">
      <NavigationButtons ButtonType="secondary" NextBtnWidth="100px" :ConditionsMet="isNextDisabled"
        :RequestedNextPath="requestedNextPath">
      </NavigationButtons>
    </div>
  </div>
</template>
<style scoped lang="scss">
.v-btn-group--density-default.v-btn-group {
  height: auto;
}
.form-container{
  margin:0px !important
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

  .navButtonsContianer {
    padding-left: 2px !important;
    padding-right: 0px !important;
  }
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
  margin: 0;
  padding: 16px;
}

:deep(.itemContainer .cardBtn:hover .btnContent) {
  opacity: 100 !important;
}

.w-100 {
  width: 100% !important;
}

.content-header-container {
  background: $table-header-bg;
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
.content-header-container{
  background: $table-header-bg !important
}
</style>
