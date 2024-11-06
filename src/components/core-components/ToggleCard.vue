<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  mdVal: {
    type: [String, Number]
  },
  lgVal: {
    type: [String, Number]
  },
  smVal: {
    type: [String, Number],
    default: 4
  },
  colsVal: {
    type: Number,
    default: 12
  },
  value: {
    type: [String, Boolean]
  },
  isChecked: {
    type: Boolean
  },
  bordered: {
    type: Boolean
  },
  isRatesOffers: {
    type: Boolean,
    default: false
  }
});

</script>

<template>
  <v-col
    :cols="colsVal"
    :md="mdVal"
    :sm="smVal"
    :lg="lgVal"
    class="itemContainer"
  >
    <v-btn
      :disabled="bordered"
      plain
      :value="value"
      :class="{
        cardBtn: true,
        'v-item--active': isChecked,
        bordered: bordered,
        removeBackground: isRatesOffers,
      }"
    >
      <div class="btnContent"><slot /></div>
      <v-icon class="mdi-checkbox-marked-circle">check_circle</v-icon>
    </v-btn>
  </v-col>
</template>

<style lang="scss" scoped>
.itemContainer {
  .cardBtn {
    width: 100%;
    background-color: $background-extra-light;
    border-radius: 7px;
    height: 137px !important;
    position: relative;
    z-index: 1;

    :deep(.v-btn__content) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 1 !important;
      color: $icon-inactive-color;
      position: static;
      p {
        width: 100%;
        white-space: break-spaces;
      }
    }
    &:hover {
      :deep(.btnContent) {
        opacity: 0.7 !important;
      }
    }
    .mdi-checkbox-marked-circle {
      position: absolute;
      right: -10px;
      top: -10px;
      border-radius: 50%;
      z-index: 2;
      background-color: $white;
      opacity: 0;
      font-size: 24px;
    }
    :deep(p) {
      margin-top: 12px;
      text-transform: none;
      letter-spacing: 0px;
    }
    :deep(svg *) {
      fill: $icon-inactive-color !important;
    }

    :deep(svg.stroked *) {
      stroke: $icon-inactive-color !important;
      fill: transparent !important;
    }

    :deep(svg.noStroke *) {
      stroke: transparent !important;
    }
    &.v-btn--active {
      background-color: $white !important;
      border: 2px solid $primary-input-control !important;
      &.v-btn {
        border-color: $primary-input-control !important;
      }
      :deep(.v-btn__content) {
        color: $primary-input-control;
      }
      :deep(svg *) {
        fill: $primary-input-control !important;
      }
      :deep(svg.stroked *) {
        stroke: $primary-input-control !important;
        fill: transparent !important;
      }
      .mdi-checkbox-marked-circle {
        opacity: 1;
      }
      :deep(.v-btn__overlay){
          opacity: 0 !important;
        }
      &:hover {
        :deep(.v-btn__overlay){
          opacity: 0 !important;
        }
      }
    }
    &.v-item--active {
      background-color: $white !important;
      border: 2px solid $primary-input-control !important;
      &.v-btn {
        border-color: $primary-input-control !important;
      }
      :deep(.v-btn__content) {
        color: $primary-input-control;
      }
      :deep(svg *) {
        fill: $primary-input-control !important;
      }
      :deep(svg.stroked *) {
        stroke: $primary-input-control !important;
        fill: transparent !important;
      }
      .mdi-checkbox-marked-circle {
        opacity: 1;
      }
      :deep(.v-btn__overlay){
          opacity: 0 !important;
        }
      &:hover {
        :deep(.v-btn__overlay){
          opacity: 0 !important;
        }
      }
    }
    &.bordered {
      border: 2px solid $primary-input-control !important;
      cursor: default;
    }
    &.removeBackground{
      background-color: $white;
      box-shadow: 0px 0px 4px 0px #00000024,
                  0px 0px 1px 0px #00000024;

    }
  }
}

:deep(svg) {
  max-height: 65px;
}
</style>
