<script setup>
import { onMounted, ref, watch } from "vue";
const props = defineProps({
  value: {
    type: [Boolean, String, null],
  },
  options: {
    type: Array,
    default: () => [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  isRatesOffers: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["input"]);

const booleanValue = ref(false);

onMounted(() => {
  booleanValue.value = props.value;
});

watch(
  () => props.value,
  (newValue) => {
    booleanValue.value = newValue;
  },
  { deep: true }
);

const handleClick = (value) => {
  booleanValue.value = value;
  emit("input", value);
};
</script>
<template>
  <v-btn-toggle v-model="booleanValue" mandatory>
    <v-btn
      v-for="(item, index) in options"
      :key="index"
      :value="item.value"
      min-width="80"
      :class="[
        'primary-button',
        'lynx-primary',
        item.value !== booleanValue ? 'bordered' : '',
        isRatesOffers ? 'text-color' : 'inactive-text-color',
      ]"
      @click="handleClick(item.value)"
      :style="{
        border:
          isRatesOffers && item.value !== booleanValue
            ? '2px solid rgba(0, 0, 0, 0.12) !important'
            : '1px solid transparent',
        background: isRatesOffers ? '#ffffff !important' : '#f4f3f2 !important',
        'box-shadow': isRatesOffers
          ? ' 0px 0px 4px 0px #00000024, 0px 0px 1px 0px #00000024 !important'
          : 'none !important',
      }"
    >
      {{ item.label }}
      <v-icon class="mdi-checkbox-marked-circle">check_circle</v-icon>
      <span v-if="item.content">{{ item.content }}</span>
    </v-btn>
  </v-btn-toggle>
</template>

<style lang="scss" scoped>
.variableButtonWidth {
  @media (max-width: $tablet-width) {
    width: 100px !important;
  }
  @media (max-width: $mobile-width) {
    width: 75px !important;
  }
}
.v-btn-group--density-default.v-btn-group {
  overflow: visible;
  gap: 20px;
  height: auto !important;
}
.v-btn-toggle {
  display: flex;
  justify-content: center;
  gap: 20px;
  .v-theme--light.v-btn.primary-button {
    height: 60px !important;
    padding: 0 16px !important;
    border-radius: 5px !important;
    font-size: 13px;
    opacity: 1;
    .mdi-checkbox-marked-circle {
      position: absolute;
      right: -10px;
      top: -8px;
      border-radius: 50%;
      background-color: $white;
      z-index: 2;
      opacity: 0;
      font-size: 24px;
    }
    &.v-btn--active {
      &:hover {
        &::before {
          opacity: 0.08;
        }
      }
      &::before {
        opacity: 0;
      }
      :deep(.v-btn__overlay) {
        opacity: 0 !important;
      }
    }
    &:not(.bordered) {
      border: 1px solid $primary-input-control !important;
      background-color: $white !important;
      :deep(span) {
        color: $primary-input-control !important;
      }
      &::before {
        display: none;
      }
      .mdi-checkbox-marked-circle {
        opacity: 1;
      }
    }
    &.bordered {
      border: 1px solid transparent !important;
      background-color: $background-extra-light !important;
      box-shadow: none !important;
      :deep(span) {
        color: $icon-inactive-color !important;
      }
    }
  }
}
</style>
