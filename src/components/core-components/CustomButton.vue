<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  btnType: {
    type: String,
    required: false,
    default: 'button'
  },
  value: {
    type: String,
    required: false,
    default: 'CustomButton'
  },
  customClass: {
    type: String,
    required: false,
    default: ''
  },
  color: {
    type: String,
    default: 'primary'
  },
  width: {
    type: String,
    required: false,
    default: '152px'
  },
  height: {
    type: String,
    required: false,
    default: '40px'
  },
  isDisabled: {
    type: Boolean,
    required: false,
    default: false
  },
  isNotSelected: {
    type: Boolean,
    required: false,
    default: false
  },
  isOutlined: {
    type: Boolean,
    required: false,
    default: false
  }
})

const buttonClass = computed(() => {
  return !props.isOutlined ? props.customClass + ' white--text' : props.customClass
})

const emit = defineEmits(['onHandleClick'])

const clicked = (e) => {
  if (props.btnType === 'submit') {
    e.preventDefault()
  }
  emit('onHandleClick')
}
</script>

<template>
  <div class="button">
    <v-btn
      class="text-capitalize"
      :class="buttonClass + (isNotSelected ? ' unselected-button' : '') + (isOutlined ? ` outlined outlined_${color}` : '')"
      :color="color"
      :width="width"
      :height="height"
      :disabled="isDisabled"
      :outlined="isNotSelected"
      :type="btnType"
      @click="clicked"
    >
      {{ value }}
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
.button {
  -webkit-appearance: inherit;
  &:deep(.v-btn) {
    display: inline-block;
    letter-spacing: 0px;
  }
}

:deep(.primary-button) {
  background: $primary-input-control !important;
  span {
    color: $white !important;
  }
}

:deep(.danger-button) {
  background: $red !important; 
  span {
    color: $white !important;
  }
}

:deep(.default-button) {
  background: $white2 !important;
  span {
    color: $black !important;
  }
}

.outlined {
  background: $white !important;
  box-shadow: none !important;
  &_primary{
    color: $primary-input-control !important;
    border: 1px solid $primary-input-control !important;
  }
  &_danger{
    color: $red !important;
    border: 1px solid $red !important;
  }
  &_default{
    color: $secondary !important;
    border: 1px solid $secondary !important;
  }
}
</style>