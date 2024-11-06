<script setup>
import { ref, defineProps, computed } from "vue";

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["toggleInclude", "setBorrowerAndRedirect"]);
const headers = ref([
  "Status",
  "Fico",
  "Assets",
  "Income/Month",
  "Liabilities",
  "DTI",
  "Housing",
  "Include",
]);

const isCurrency = (item) => {
  return ["Assets", "Liabilities"].indexOf(item) !== -1;
};

const isPercentage = (item) => {
  return ["DTI", "Housing"].indexOf(item) !== -1;
};

const borrowersData = computed(() => {
  return props.tableData.length
    ? props.tableData.filter((item) => item.name !== "Totals:")
    : [];
});

const totals = computed(() => {
  const totals = props.tableData[props.tableData.length - 1];
  return {
    totalAssets: totals.assets,
    totalIncome: totals.income,
    totalLiabilities: totals.liabilities,
  };
});
</script>
<template>
  <div class="mobile-qualifying">
    <v-row class="text-block__row header-row mb-8">
      <v-col
        class="text-block__col relative pr-2 px-0 py-1"
        v-for="(info, index) in borrowersData"
        :key="index"
      >
        {{ info.name }}
        <div class="edit" @click="$emit('setBorrowerAndRedirect', { index })">
          <v-icon class="icon-color-main">mdi-pencil</v-icon>
        </div>
      </v-col>
    </v-row>

    <v-row class="text-block__row items" v-for="(item, index2) in headers" :key="index2">
      <v-col
        class="text-block__col"
        v-for="(info, dataIndex) in borrowersData"
        :key="dataIndex"
      >
        <v-row class="text-block__row data-title">{{ item }}</v-row>

        <v-row
          class="text-block__row data-value"
          v-if="item !== 'Income/Month' && item !== 'Include'"
        >
          <span v-if="isCurrency(item)">$</span>
          <span>
            {{
              info[item.toLowerCase()]
                ? info[item.toLowerCase()].toLocaleString("en-US")
                : info[item.toLowerCase()]
            }}
          </span>
          <span v-if="isPercentage(item)">%</span>
        </v-row>

        <v-row class="text-block__row data-value" v-else-if="item === 'Include'">
          <v-switch
            color="#000"
            class="mt-0 switch"
            :model-value="info.isInclude"
            v-if="info.name !== 'Totals:'"
            @change="$emit('toggleInclude', { index: dataIndex })"
            hide-details
          />
        </v-row>

        <v-row class="text-block__row data-value" v-else>
          <span>$</span>
          <span>{{ info.income.toLocaleString("en-US") }}</span>
        </v-row>
      </v-col>

      <v-row
        class="totals primary--text w-100"
        v-if="isCurrency(item) || item === 'Income/Month'"
      >
        <v-col class="text-block__col" sm="" cols="2">Totals:</v-col>

        <v-col class="text-block__col" v-if="item === 'Assets'">
          <span>$</span>
          <span>{{
            totals.totalAssets
              ? totals.totalAssets.toLocaleString("en-US")
              : totals.totalAssets
          }}</span>
        </v-col>

        <v-col class="text-block__col" v-else-if="item === 'Liabilities'">
          <span>$</span>
          <span>{{
            totals.totalAssets
              ? totals.totalLiabilities.toLocaleString("en-US")
              : totals.totalLiabilities
          }}</span>
        </v-col>

        <v-col class="text-block__col" v-else>
          <span>$</span>
          <span>{{
            totals.totalAssets
              ? totals.totalIncome.toLocaleString("en-US")
              : totals.totalIncome
          }}</span>
        </v-col>
      </v-row>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
:deep(.icon-color-main) {
  path {
    &[fill] {
      fill: $primary !important;
    }
    &[stroke] {
      stroke: $primary !important;
    }
  }
}
.mobile-qualifying {
  padding: 0 30px;
}

.header-row,
.data-value {
  font-weight: 500;
}

.items {
  border-bottom: 1px solid $nautical;
  padding: 15px 0;
  position: relative;
  &:last-child {
    border-bottom: none;
  }
}

.data-title {
  font-size: 12px;
}

.totals {
  margin-top: 10px;
  font-weight: 500;
  gap: 6px;
  &.primary--text{
    color: $primary;
  }
  .text-block__col{
    text-wrap: nowrap;
  }
}

.relative {
  position: relative;
}

.edit {
  position: absolute;
  left: 0;
  z-index: 2;
  i{
    font-size: 24px;
  }
  img {
    width: 25px;
    height: 25px;
  }
}
</style>
