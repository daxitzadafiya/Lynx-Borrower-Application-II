<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRatesAndOffersStore } from "@/stores/ratesAndOffers.js";

const ratesAndAccountStore = useRatesAndOffersStore();
const props = defineProps({
  products: {
    type: Array,
  },
});
const router = useRouter();
const emit = defineEmits(["closeDialog"]);
const headers = ref([]);
const items = ref([]);
const baseItems = ref([
  { label: "Rate" },
  { label: "APR" },
  { label: "Upfront Costs" },
  { label: "Principal & Interest" },
]);
const keyMapping = ref({
  Rate: "QuoteDetail.Rate",
  APR: "QuoteDetail.Apr",
  "Upfront Costs": "QuoteDetail.UpfrontFee",
  "Principal & Interest": "QuoteDetail.Piti ",
});

const onClose = () => {
  emit("closeDialog");
};

const onChoose = (productData, productType) => {
  const name = headers.value.find((header) => header.key === productType);
  const selectedProduct = productData.reduce((acc, item) => {
    acc[
      keyMapping.value[item.label].charAt(0).toUpperCase() +
        keyMapping.value[item.label].slice(1)
    ] = item[productType];
    return acc;
  }, {});
  ratesAndAccountStore.setSelectedProduct({ ...selectedProduct, ProductName: name.text });
  onClose();
  router.push("/ratesandoffers/desired-rate");
};

onMounted(() => {
  headers.value = [
    { title: "Value", key: "label" },
    ...props.products.map((product) => ({
      title: product.VendorProductName,
      key: product.VendorProductName.toLowerCase().replace(/\s+/g, ""),
    })),
  ];
  items.value = baseItems.value.map((baseItem) => {
    const dynamicItem = { label: baseItem.label };

    headers.value.slice(1).forEach((header) => {
      const product = props.products.find((p) => p.VendorProductName === header.title);
      if (product) {
        const key = keyMapping.value[baseItem.label];
        if (key && key.includes("QuoteDetail")) {
          dynamicItem[header.key] =
            product.QuoteDetail[key.replace("QuoteDetail.", "").trim()];
        } else {
          dynamicItem[header.key] = product[key];
        }
      }
    });
    return dynamicItem;
  });
});
</script>
<template>
  <div class="content-container image-content-type mt-0 mb-0">
    <div class="content-header-container w-100">
      <div class="header-text">Compare Products</div>
      <v-btn class="close_btn" elevation="0" @click="onClose()">
        <v-icon class="v-btn__content">mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="product_details w-100">
      <v-data-table
        :headers="headers"
        :items="items"
        hide-no-data
        hide-default-footer
        class="compare-table"
        ref="dataTable"
        :mobile-breakpoint="0"
        :sortable="false"
      >
        <!-- Custom header -->
        <template v-slot:[`column.header`]="{ column }">
          <!-- <th :key="column.key" scope="col">
            {{ column.title }}
          </th> -->
          <span>{{ column.key }}</span>
        </template>

        <!-- Custom body content -->
        <template v-slot:body="{ items }">
          <!-- <tbody> -->
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.label }}</td>
            <td v-for="header in headers.slice(1)" :key="header.key">
              {{ item[header.key] }}
            </td>
          </tr>
          <!-- Add the button row at the bottom -->
          <tr class="button-row">
            <td></td>
            <td v-for="header in headers.slice(1)" :key="header.key">
              <v-btn class="choose_btn" @click="onChoose(items, header.key)"
                >Choose</v-btn
              >
            </td>
          </tr>
          <!-- </tbody> -->
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<style lang="scss" scoped>

.image-content-type {
  min-height: fit-content !important;
  justify-content: flex-start;
  align-items: flex-start;
}
.choose_btn {
  background-color: $orangeV2 !important;
  color: $whiteV2 !important;
  text-transform: none;
  box-shadow: none;
}
:deep(.v-data-table-header) {
  th {
    background: $table-header-bg !important;
    font-size: 14px !important;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 0.001em;
    color: $dark-grayV2 !important;
  }
}
.w-100 {
  width: 100%;
}
.content-header-container {
  background: $table-header-bg;
  padding: 12px 15px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  :deep(.v-btn:not(.v-btn--round)) {
    min-width: 30px !important;
    height: 30px !important;
    padding: 0;
    border-radius: 5px;
    background-color: $action-secondary-icon-color;
  }
}
:deep(.close_btn) {
  box-shadow: 0px 0px 4px 0px #00000024, 0px 0px 1px 0px #00000024 !important;
}
:deep(.content-header-container .v-btn__content) {
  color: $action-primary-bg-color;
  text-transform: none;
  display: flex;
  gap: 10px;
  font-size: 20px;
  font-weight: 500;
}

.product_details {
  padding: 12px 16px;
}

:deep(.content-container.mb-0) {
  margin-bottom: 0 !important;
  border-radius: 0px !important;
}
:deep(.v-dialog__content) {
  align-items: start !important;
  top: 80px !important;
}
:deep(.v-dialog) {
  border-radius: 8px !important;
}

:deep(.v-table__wrapper) {
  table {
    thead {
      tr {
        th {
          border-bottom: none !important;
          background: $table-header-bg;
          span {
            color: $dark-grayV2 !important;
            font-size: 14px;
            font-weight: 500;
          }
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
        }
      }
    }
  }
}
.button-row {
  padding-top: 10px;
  height: 48px !important;
}
.button-row:hover {
  background: transparent !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  height: 37px !important;
}
v-btn {
  width: 100%;
  color: $white;
}
.v-table--density-default {
  --v-table-header-height: 48px !important;
  --v-table-row-height: 37px !important;
}
</style>
