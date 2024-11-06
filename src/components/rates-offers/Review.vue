<script setup>
import { ref } from "vue";

const options = ref([
  { value: true, label: "Yes", content: "I want to proceed with this rate" },
  { value: false, label: "No", content: "I want to select a different rate" },
]);
</script>
<template>
  <div>
    <div class="review-title">
      <p>Please take a moment to review and confirm you loan product and rate solution</p>
    </div>
    <div class="p-4 review-amount-box content-container image-content-type">
      <div>
        <p>Purchase Price / Estimated Value</p>
        <span>$ 500,000</span>
      </div>
      <div>
        <p>Down Payment</p>
        <span>$ 45,000 | 10%</span>
      </div>
      <div>
        <p>Loan Amount</p>
        <span>$ 450,000</span>
      </div>
      <div>
        <p>Loan to Value</p>
        <span>90%</span>
      </div>
      <div>
        <p>Property Type</p>
        <span>Single Family</span>
      </div>
    </div>
    <div class="p-4 content-container image-content-type">
      <div class="review-repayment-box w-100">
        <div>
          <p>Repayment Term</p>
          <span>Conventional 30 yr fixed</span>
        </div>
        <div>
          <p>Rate <v-icon>mdi-information-outline</v-icon></p>
          <span>3.990%</span>
        </div>
        <div>
          <p>APR <v-icon>mdi-information-outline</v-icon></p>
          <span>4.315%</span>
        </div>
        <div>
          <p>Upfront Costs<v-icon>mdi-information-outline</v-icon></p>
          <span>$17,830</span>
        </div>
        <div>
          <p>Points</p>
          <span>3.96%</span>
        </div>
      </div>
      <v-divider class="my-4 w-100"></v-divider>
      <div class="review_monthly_info w-100">
        <div class="review_monthly_info_title">Monthly Payment Information</div>
        <div class="review_repayment_box_monthly w-100">
          <div>
            <p>Principal and Interest</p>
            <span>$2,250.00</span>
          </div>
          <div>
            <p>Tax & Insurance</p>
            <span>$400.00</span>
          </div>
          <div>
            <p>Mortgage Insurance</p>
            <span>$100.00</span>
          </div>
          <div>
            <p>Total Monthly Payment</p>
            <span>$2,750.00</span>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 review-product-rate content-container image-content-type">
      <p>Would you like to continue with this product and rate?</p>
      <AgreeToggle :options="options" :isRatesOffers="true"></AgreeToggle>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.p-4 {
  padding: 16px;
}

.w-100 {
  width: 100%;
}

.image-content-type {
  min-height: fit-content !important;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 15px !important;
}

.review-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.0015em;
  color: $dark-grayV2;
  p{
    margin-bottom: 16px;
  }
}

.review-amount-box {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  p {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 0.001em;
    color: $dark-grayV2;
    margin: 0px 0px 4px;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: $dark-grayV2;
    letter-spacing: 0.001em;
  }
}

.review-repayment-box {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;

  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: 0.001em;
    margin: 0px 0px 4px;
    color: $dark-grayV2;
  }

  .mdi-information-outline {
    font-size: 14px !important;
    margin-left: 4px;
  }

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: $dark-grayV2;
    letter-spacing: 0.0015em;
  }
}

.review_monthly_info {
  .review_monthly_info_title {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 0.001em;
    color: $dark-grayV2;
    margin-bottom: 16px;
  }

  .review_repayment_box_monthly {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;

    p {
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
      letter-spacing: 0.001em;
      margin: 0px 0px 4px;
    }

    span {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0.0015em;
    }
  }
}

.review-product-rate {
  p {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.0015em;
    color: $dark-grayV2;
    margin-bottom: 24px;
  }

  :deep(.v-btn__content) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    align-items: center;
    text-transform: none !important;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 0.001em;
    text-align: center;

    span {
      width: 100%;
      white-space: break-spaces;
    }
  }
  :deep(.v-btn-toggle .v-theme--light.v-btn.primary-button:not(.bordered) ) {
    border: 2px solid $primaryV2 !important;
  }
  :deep(.v-btn-toggle .v-theme--light.v-btn.primary-button:not(.bordered)  span) {
    color: $primaryV2 !important;
  }
  :deep(.v-btn-toggle .v-theme--light.v-btn.primary-button) {
    padding: 24px 32px !important;
    height: 132px !important;
  }
  :deep(.v-btn-toggle) {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: 0 !important;
  }
}
:deep(.mdi-checkbox-marked-circle) {
  display: none !important;
}

@media (max-width: $desktop-width) {
  .review-product-rate {
    .v-btn-toggle {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: $tablet-width) {
  .review-amount-box {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .review-repayment-box {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .review_monthly_info {
    .review_repayment_box_monthly {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  .review-product-rate {
    :deep(.v-btn-toggle) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }
    :deep(.v-item-group .theme--light.v-btn) {
      height: 111px !important;
    }
  }
}

@media (max-width: $mobile-width) {
  .review-amount-box div:first-child,
  .review-amount-box div:nth-child(2),
  .review-amount-box div:nth-child(5) {
    grid-column: span 2;
  }
  .review-repayment-box {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .review-repayment-box div:first-child {
    grid-column: span 2;
  }
  .review_monthly_info {
    .review_repayment_box_monthly {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
  .review-product-rate {
    :deep(.v-btn-toggle) {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      width: 100%;
    }
    :deep(.v-item-group .theme--light.v-btn) {
      height: 132px !important;
    }
    :deep(.v-item-group .theme--light.v-btn) {
      padding: 24px 35px !important;
    }
  }
}
</style>
