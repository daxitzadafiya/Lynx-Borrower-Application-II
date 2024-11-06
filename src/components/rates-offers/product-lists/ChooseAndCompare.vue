<script setup>
import { ref, defineEmits, computed } from "vue";
import { useRatesAndOffersStore } from "@/stores/ratesAndOffers.js";

const ratesAndAccountStore = useRatesAndOffersStore();

const selectedProduct = ref([]);
const chooseProduct = ref({});
const chooseIndex = ref(null);

const emit = defineEmits(["onCompare"]);

const onCompare = (e, index) => {
  const repaymentItem = repayMentInfo.value[index];
  if (e) {
    selectedProduct.value.push(repaymentItem);
  } else {
    const selectedIndex = selectedProduct.value.indexOf(repaymentItem);
    if (selectedIndex !== -1) {
      selectedProduct.value.splice(selectedIndex, 1);
    }
  }
  emit("onCompare", selectedProduct.value);
};

const onChoose = (item, index) => {
  chooseIndex.value = index;
  chooseProduct.value = item;
  ratesAndAccountStore.setSelectedProduct({ ...item });
};

const repayMentInfo = computed(() => {
  return ratesAndAccountStore.getLoanProductsList() || [];
});
</script>
<template>
  <div>
    <div
      class="p-4 d-flex content-container image-content-type"
      v-for="(item, index) in repayMentInfo"
      :key="index"
      :class="{
        'bordered-item': (chooseProduct ? chooseIndex : '') === index,
      }"
    >
      <div class="d-flex w-100 gap-4 repayment_section">
        <div class="w-100">
          <div class="repayment_box">
            <div class="col-span-2">
              <p>Repayment Term</p>
              <span>{{ item.VendorProductName }}</span>
            </div>
            <div>
              <p>Rate<v-icon>mdi-information-outline</v-icon></p>
              <span>{{ item.QuoteDetail.Rate }}</span>
            </div>
            <div>
              <p>APR<v-icon>mdi-information-outline</v-icon></p>
              <span>{{ item.QuoteDetail.Apr }}</span>
            </div>
            <div>
              <p>Upfront Costs<v-icon>mdi-information-outline</v-icon></p>
              <span>{{ item.QuoteDetail.UpfrontFee }}</span>
            </div>
            <div>
              <p>Principal and Interest</p>
              <span>{{ item.QuoteDetail.Piti }}</span>
            </div>
          </div>
          <!-- <v-divider class="my-4"></v-divider> -->
          <!-- <div class="monthly_info">
              <div class="monthly_info_title">
                <span>Monthly Payment Information</span
                ><v-btn class="minus_btn" @click="onMinusClick(index)"
                  ><v-icon>{{ item.isExpanded ? "mdi-minus" : "mdi-plus" }}</v-icon></v-btn
                >
              </div>
              <div :class="{ repayment_box_monthly: true, expanded: item.isExpanded }">
                <div>
                  <p>Principal and Interest</p>
                  <span>{{ item.PrincipalAndInterest }}</span>
                </div>
                <div>
                  <p>Tax & Insurance</p>
                  <span>{{ item.TaxAndInsurance }}</span>
                </div>
                <div>
                  <p>Mortgage Insurance</p>
                  <span>{{ item.MortgageInsurance }}</span>
                </div>
                <div>
                  <p>Total Monthly Payment</p>
                  <span>{{ item.TotalMonthlyPayment }}</span>
                </div>
              </div>
            </div> -->
        </div>
        <div class="action_btn">
          <v-btn class="choose_btn" @click="onChoose(item, index)">Choose</v-btn>
          <CheckBox
            v-if="selectedProduct.length < 3 || selectedProduct.includes(item)"
            label="Compare"
            class="custom-checkbox"
            @toggle="onCompare($event, index)"
            hide-details
          >
          </CheckBox>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-content-type {
  min-height: fit-content !important;
  justify-content: flex-start;
  align-items: flex-start;
}

.p-4 {
  padding: 16px;
}
.space-between {
  justify-content: space-between;
}
.col-span-2 {
  grid-column: span 2;
}
.my-4 {
  margin: 16px 0px;
}
.gap-4 {
  gap: 16px;
}

.w-100 {
  width: 100% !important;
}

:deep(.v-input__slot) {
  min-height: 40px !important;
}

:deep(.v-text-field--enclosed .v-input__append-inner) {
  margin-top: 8px !important;
}

.choose_btn {
  background-color: $orangeV2 !important;
  color: $whiteV2 !important;
  text-transform: none;
  min-width: 100px;
}
:deep(.v-checkbox .v-selection-control){
  min-height: 0;
}
.action_btn {
  display: flex;
  flex-direction: column;
}
.v-btn:not(.v-btn--round).v-size--default {
  min-width: 100px !important;
}
.repayment_box {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  p {
    margin-bottom: 4px !important;
    font-size: 14px;
  }
  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
}

.repayment_box_monthly {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  p {
    margin-bottom: 4px !important;
    font-size: 14px;
  }
  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
}
.repayment_box_monthly.expanded {
  max-height: 500px;
}

.monthly_info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  &_title {
    font-size: 14px !important;
    font-weight: 500;
    line-height: 21px;
  }
}

.mdi-information-outline {
  font-size: 14px !important;
  margin-left: 4px;
}
:deep(.v-list-item) {
  min-height: 40px;
}
:deep(.v-list-item__content) {
  padding: 0 !important;
}
.monthly_info_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  :deep(.v-btn:not(.v-btn--round).v-size--default) {
    min-width: 30px !important;
    max-height: 30px !important;
    padding: 0 !important;
    display: none !important;
  }
  :deep(.v-icon) {
    color: $action-primary-icon-color !important;
  }
}
.image-content-type:last-child {
  margin-bottom: 70px;
}
@media (max-width: $desktop-width) {
  .repayment_box {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .repayment_box_monthly {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: $lg-tablet-width) {
  .repayment_box {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: $mobile-width) {
  .repayment_section {
    flex-wrap: wrap;
  }
  .image-content-type:last-child {
    margin-bottom: 30px;
  }
  .action_btn {
    flex-direction: row-reverse;
    justify-content: end;
    display: flex;
    width: 100%;
    gap: 10px;
  }
  .monthly_info_title {
    :deep(.v-btn:not(.v-btn--round).v-size--default) {
      display: block !important;
      background: #fafafa;
      box-shadow: 0px 0px 4px 0px #00000024, 0px 0px 1px 0px #00000024;
    }
    :deep(.v-btn:not(.v-btn--round)) {
      background: transparent !important;
    }
    :deep(.v-btn::before) {
      background: transparent !important;
    }
  }
  .repayment_box {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .Conventional_section {
    flex-wrap: wrap;
  }
  .compareBtn_1 {
    width: 100%;
  }
  .compareBtn-main {
    width: 100%;
  }
  .repayment_box_monthly {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
.bordered-item {
  border: 1px solid $primaryV2;
}
.custom-checkbox{
  margin-left: -8px;
  :deep(.v-label){
    font-size: 14px;
    font-weight: 400;
  }  
}
</style>
