<script setup>
import {defineProps, defineEmits, ref, watch} from 'vue';

const props = defineProps({
  inputTitle: {
    type: String,
  },
  inputValue:{
    type: String,
  },
  value: {
    type: [String, Number],
    required: false,
    default: "",
  },
  minValue: {
    type: Number,
    required: false,
    default: 0,
  },
  maxValue: {
    type: Number,
    required: false,
  }
});

const emit = defineEmits(['onSlideEnd','onClick']);

const sliderValue = ref(props.value);
const inputValue = ref(props.inputValue);

watch(
  () => props.value,
  (newValue) => {
    sliderValue.value = newValue
  },
  { deep: true }
);
watch(
  () => props.inputValue,
  (newValue) => {
    inputValue.value = newValue
  },
  { deep: true }
);

const onSlideEnd = (event) => {
  emit('onSlideEnd', event.toFixed(2))
};

const onClick = (event) => {
  emit('onClick', event)
};
</script>
<template>
      <div class="pb-0 pr-sm-2 mt-0 mt-md-1 px-0 width">
        <div class="body-2 pb-1 font-weight-medium labelColor fs-14">{{ inputTitle }}:</div>
        <div class="sliderContainer">
          <v-text-field
            class="amount-data light-gray font-weight-bold mb-4 pt-3"
            hide-details
            pattern="[0-9]*"
            inputmode="numeric"
            :disabled="true"
            variant="solo"
            flat
            dense
            v-model="inputValue"
          />
          <v-row class="text-block__row text-block_justified-row mx-3">
            <v-slider
              class="custom-slider text-block__slider py-3"
              track-color="white"
              :min="minValue"
              :max="maxValue"
              hide-details
              v-model="sliderValue"
              @end="onSlideEnd"
              @click="onClick"
            ></v-slider>
          </v-row>
        </div>
      </div>
  </template>
  
  <style lang="scss" scoped>
  
  .fs-14{
    font-size: 14px;
  }
.width{
    width: 334.33px;
}
  :deep(.v-field) {
    background: $slider-bg-color !important;
  }
  :deep(.v-text-field input) {
    text-align: center !important;
  }
  :deep(.v-field--disabled) {
    opacity: 1 !important;
  }
  
  .underlined {
    font-size: 13px;
    text-decoration: underline;
  }
  
  
  .sliderContainer {
    background: $slider-bg-color;
    :deep(.v-input__slot) {
      background: rgba(0, 0, 0, 0) !important;
      input {
        text-align: center;
        color: $primary-input-control;
      }
    }
  }
  :deep(.custom-slider) {
    .v-slider-thumb__surface {
      background: $white !important;
      border: 3px solid $slider-color-2 !important;
    }
    .v-slider-track__fill {
      background: $slider-color-2 !important;
    }
    .v-slider-track {
      height: 6px;
      background: $white;
  
    }
  }

  @media (max-width:$lg-mobile-width) {
    .width{
        width: 100%;
        margin-top: 20px !important;
    }
}
  </style>
  