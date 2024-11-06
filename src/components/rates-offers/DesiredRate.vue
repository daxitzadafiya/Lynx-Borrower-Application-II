<script setup>
import { getFormattedValue } from "@/mixins/currencyFormat.js";
import { useRatesAndOffersStore } from "@/stores/ratesAndOffers.js";
import { useGeneralStore } from "@/stores/generalStore";
import { useRouter } from "vue-router";
import { computed, onUnmounted, ref } from "vue";

const generalStore = useGeneralStore();
const ratesAndAccountStore = useRatesAndOffersStore();
const router = useRouter();
const headers = ref([
  { title: "Rate", key: "rate" },
  { title: "Discount", key: "discount" },
  { title: "Discount1", key: "discount1" },
  { title: "Discount2", key: "discoun2" },
  { title: "Discount3", key: "discount3" },
  { title: "Action", key: "actions", align: "right" },
]);

const items = ref([
  {
    rate: "3.990%",
    discount: "7.132% ($500)",
    discount1: "7.132% ($500)",
    discount2: "7.132% ($500)",
    discount3: "7.132% ($500)",
    actions: "Select",
  },
  {
    rate: "3.990%",
    discount: "7.132% ($500)",
    discount1: "7.132% ($500)",
    discount2: "7.132% ($500)",
    discount3: "7.132% ($500)",
    actions: "Select",
  },
  {
    rate: "3.990%",
    discount: "7.132% ($500)",
    discount1: "7.132% ($500)",
    discount2: "7.132% ($500)",
    discount3: "7.132% ($500)",
    actions: "Select",
  },
  {
    rate: "3.990%",
    discount: "7.132% ($500)",
    discount1: "7.132% ($500)",
    discount2: "7.132% ($500)",
    discount3: "7.132% ($500)",
    actions: "Select",
  },
  {
    rate: "3.990%",
    discount: "7.132% ($500)",
    discount1: "7.132% ($500)",
    discount2: "7.132% ($500)",
    discount3: "7.132% ($500)",
    actions: "Select",
  },
  {
    rate: "3.990%",
    discount: "7.132% ($500)",
    discount1: "7.132% ($500)",
    discount2: "7.132% ($500)",
    discount3: "7.132% ($500)",
    actions: "Select",
  },
  {
    rate: "3.990%",
    discount: "7.132% ($500)",
    discount1: "7.132% ($500)",
    discount2: "7.132% ($500)",
    discount3: "7.132% ($500)",
    actions: "Select",
  },
  {
    rate: "3.990%",
    discount: "7.132% ($500)",
    discount1: "7.132% ($500)",
    discount2: "7.132% ($500)",
    discount3: "7.132% ($500)",
    actions: "Select",
  },
]);

const goToProductList = () => {
  router.push("/ratesandoffers/product-list");
};

const selectedProduct = computed(() => {
  return ratesAndAccountStore.getSelectedProduct();
});

onUnmounted(() => {
  ratesAndAccountStore.setSelectedProduct(null);
});
</script>
<template>
  <div>
    <div class="p-4 review-amount-box content-container image-content-type">
      <!-- <div class="col-span-2">
        <p>Purchase Price / Estimated Value</p>
        <span>$ 500,000</span>
      </div> -->
      <div>
        <p>Down Payment</p>
        <span>{{
          "$" +
          " " +
          getFormattedValue(generalStore.currentLoan.DownPaymentAmount) +
          " | " +
          (generalStore.currentLoan.DownPaymentPercentage + "%")
        }}</span>
      </div>
      <div>
        <p>Loan Amount</p>
        <span>$ {{ getFormattedValue(generalStore.currentLoan.LoanAmount) }}</span>
      </div>
      <div>
        <p>Loan to Value</p>
        <span>{{ generalStore.currentLoan.LoanToValueRatio * 100 }}%</span>
      </div>
      <div>
        <p>Property Type</p>
        <span>{{ generalStore.currentLoan.Property?.PropertyType }}</span>
      </div>
      <div class="col-span-2">
        <p>Selected Product</p>
        <span>{{ selectedProduct ? selectedProduct.VendorProductName : "" }}</span>
      </div>
    </div>
    <div>
      <p class="select-product-title">
        Now that you have chosen a product, select your desired rate below.
      </p>
    </div>

    <v-data-table :headers="headers" :items="items" class="fixed-action-table" :disable-sort="true" hide-default-footer
      ref="dataTable">
      <!-- :mobile-breakpoint="0" -->
      <!-- :sticky="true" -->
      <template v-slot:[`column.header`]="{ column }">
        <th :key="column.key" :class="{ 'text-end': column.align === 'right' }" scope="col" class="shadow">
          {{ column.title }}
        </th>
      </template>

      <template v-slot:body="{ items }">
        <tr v-for="(item, index) in items" :key="index">
          <td>{{ item.rate }}</td>
          <td>{{ item.discount }}</td>
          <td>{{ item.discount1 }}</td>
          <td>{{ item.discount2 }}</td>
          <td>{{ item.discount3 }}</td>
          <td class="fixed-action">
            <div class="shadow"></div>
            <v-btn outlined elevation="0">Select <span class="this-rate">this rate</span></v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <div class="content-container image-content-type return_product_section">
      <span class="product_section_title">Want to select a different product or change your search information?</span>
      <v-btn class="return_btn" @click="goToProductList()" elevation="0">Return to Product Selection</v-btn>
    </div>
  </div>
</template>
<style lang="scss" scoped>

.p-4 {
  padding: 16px;
}

.space-y-6 {
  margin-top: 24px;
}

.w-100 {
  width: 100%;
}

.image-content-type {
  min-height: fit-content !important;
  justify-content: flex-start;
  align-items: flex-start;
}

.review-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.0015em;
  color: $dark-grayV2;
}

.review-amount-box {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 0 !important;

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

.select-product-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: $dark-grayV2;
  letter-spacing: 0.0015em;
  margin: 24px 0px;
}

.fixed-action-table {
  position: relative;
}

.fixed-action {
  position: sticky;
  right: 0;
  background-color: $white;
  z-index: 2;

  button {
    background-color: $orangeV2;
    color: $white !important;
    text-transform: none !important;
    padding: 4px 16px !important;
    height: 34px;
  }
}

.this-rate {
  margin-left: 4px;
}

.fixed-action-table {
  tbody {
    tr {
      td:last-child {
        text-align: end !important;
      }
    }
  }
}

:deep(.v-data-table__th) {
  min-width: 192px !important;

  @media(max-width: $tablet-width) {
    min-width: auto !important;
  }

  &:first-child {
    min-width: 122px !important;

    @media(max-width: $tablet-width) {
      min-width: auto !important;
    }
  }

  &:last-child {
    min-width: 181.48px !important;
    position: sticky;
    right: 0;
    z-index: 3;
    width: 181.48px !important;

    @media(max-width: $tablet-width) {
      min-width: 117px !important;

      &:after {
        display: block !important;
        position: absolute;
        content: "";
        left: -10px;
        top: 0;
        background: linear-gradient(90deg, rgb(255 255 255 / 0%) 0%, rgb(0 0 0 / 20%) 100%);
        height: 100%;
        width: 10px;
        z-index: 1;
      }
    }
  }
}

:deep(th.text-start) {
  background: $table-header-bg !important;
}

.v-table {
  height: 319px !important;
  overflow: auto !important;
}

:deep(.v-data-table__th) {
  background: $table-header-bg !important;
  font-size: 14px !important;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.001em;
  height: 37px !important;
  text-align: left !important;
  color: $table-header-text-color !important;
}

:deep(.v-table__wrapper) {
  table {
    thead {
      tr {
        th {
          border-bottom: none !important;
        }
      }
    }

    tbody {
      tr {
        td {
          border-bottom: none !important;
          font-size: 14px;
          font-weight: 400;
          line-height: 21px;
          letter-spacing: 0.001em;
          text-align: left;
          color: $dark-grayV2 !important;
          height: 47px !important;
        }
      }
    }
  }
}

@media (max-width: $tablet-width) {
  .this-rate {
    display: none;
  }

  .shadow {
    display: block !important;
    position: absolute;
    left: -10px;
    top: 0;
    background: linear-gradient(90deg, rgb(255 255 255 / 0%) 0%, rgb(0 0 0 / 20%) 100%);
    height: 100%;
    width: 10px;
    z-index: 1;
  }

  .review-amount-box {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: $mobile-width) {
  .col-span-2 {
    grid-column: span 2;
  }
}

.fixed-action-table {
  .v-table__wrapper {
    overflow-x: auto;
  }

  .shadow {
    display: none;
  }
}

.return_product_section {
  padding: 16px;
  gap: 24px;
  margin-top: 24px !important;

  .product_section_title {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: $dark-grayV2;
    letter-spacing: 0.0015em;
  }

  .return_btn {
    color: $action-primary-bg-color;
    text-transform: none;
    display: flex;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0px 0px 4px 0px #00000024, 0px 0px 1px 0px #00000024 !important;
    background-color: $white !important;
    height: 38px !important;
    padding: 8px 15px !important;
    width: 222px !important;
  }
}
</style>
