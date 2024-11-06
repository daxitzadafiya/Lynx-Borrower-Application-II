<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import InlineSvg from 'vue-inline-svg';

const props = defineProps({
  icon: {
    type: String
  },
  header: {
    type: String,
    required: true
  },
  submitDisabled: {
    type: Boolean,
    default: false
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  isEditMode: {
    type: Boolean,
    required:false,
    default: false
  }
});

const emit = defineEmits(["edit","cancel","save"]);

const isEditMode = ref(props.isEditMode ? props.isEditMode : false)
const editIcon = ref(null)
const checkIcon = ref(null)
const closeIcon = ref(null)

const onEdit = () => {
  emit("edit");
  isEditMode.value = true;
}
const onCancel = () => {
  emit("cancel");
  isEditMode.value = false;
}
const onSave = () => {
  emit("save");
  isEditMode.value = false;
}

let edit = await import("@/assets/images/pencil-v2.svg");
editIcon.value = edit.default
let check = await import("@/assets/images/check.svg");
checkIcon.value = check.default
let close = await import("@/assets/images/close.svg");
closeIcon.value = close.default

watch(
  () => props.isEditMode,
  (newValue) => {
    isEditMode.value = newValue;
  },
  { deep: true }
);
</script>

<template>
  <div class="summaryCard">
    <div
      class="header d-flex align-center flex-wrap jusitfy-end"
      style="justify-content: end;"
    >
      <div class="flex-grow-1 pr-2 d-flex align-center">
        <!-- <div class="topIcon" v-if="icon">
          <inline-svg class="icon controlIcon" :src="icon"></inline-svg>
        </div> -->
        <div
          class="headerText font-weight-bold pl-2 pl-md-0"
        >
          {{ (isEditMode ? "Change " : "") + props.header }}
        </div>
      </div>
      <div class="headerButtons ml-md-1 d-flex" v-if="!props.isReadOnly">
        <v-btn
          class="summaryCardSecondaryButton "
          v-if="!isEditMode"
          @click="onEdit"
          elevation="0"
        >
          <inline-svg class="actionIcon editIcon" :src="editIcon"></inline-svg>
        </v-btn>
        <v-btn
          class="summaryCardPrimaryButton"
          v-if="isEditMode"
          elevation="0"
          @click="onSave"
          :disabled="props.submitDisabled"
        >
          <inline-svg class="actionIcon check-icon" :src="checkIcon"></inline-svg>
        </v-btn>
        <v-btn
          class="summaryCardSecondaryButton ml-3"
          v-if="isEditMode"
          elevation="0"
          @click="onCancel"
        >
          <inline-svg class="actionIcon close-icon" :src="closeIcon"></inline-svg>
        </v-btn>
      </div>
    </div>
    <div class="summaryCardBody">
      <div
        class="d-flex flex-column"
        :style="!isEditMode ? 'display:none !important;' : ''"
      >
        <slot name="editContent"></slot>
      </div>
      <div
        class="d-flex w-100 summaryCardViewMode overflow-hidden"
        :style="isEditMode ? 'display:none !important;' : ''"
      >
        <div class="flex-grow-1 mt-auto mb-auto viewModeContent">
          <slot name="displayContent"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.summaryCard {
  margin-top: 30px;
  border-radius: $container-border-radius;

  .header {
    border-top-right-radius: $container-border-radius;
    border-top-left-radius: $container-border-radius;
    padding: $header-padding;

    // @media (max-width: $tablet-width) {
    //   padding: $content-padding-tablet-y $content-padding-tablet-x;
    // }

    // @media (max-width: $mobile-width) {
    //   padding: $content-padding-mobile-y $content-padding-mobile-x;
    // }
  }

  .summaryCardBody {
    border: $container-border;
    border-top: 0px;
    border-bottom-right-radius: $container-border-radius;
    border-bottom-left-radius: $container-border-radius;
    background-color: white;
  }

  .summaryCardViewMode {
    padding: $content-padding-x;
    padding-top: 41px;
    padding-bottom: 12px;

    @media (max-width: $tablet-width) {
      padding: $content-padding-tablet-y $content-padding-tablet-x;
      padding-bottom: 12px;
    }

    @media (max-width: $mobile-width) {
      padding: $content-padding-mobile-y $content-padding-mobile-x;
      padding-bottom: 12px;
    }
  }
}

.headerButtons {
  button.summaryCardSecondaryButton {
    background: $action-secondary-bg-color !important;
    color: $action-primary-icon-color;
    text-transform: none !important;
    letter-spacing: 0px;
    width: $action-box-width;
    height: $action-box-height;
    min-width: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 !important;
  }

  button.summaryCardPrimaryButton {
    background: $action-primary-bg-color !important;
    color: $action-secondary-icon-color;
    text-transform: none !important;
    letter-spacing: 0px;
    width: $action-box-width;
    height: $action-box-height;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 !important;
    min-width: unset;
  }
}

.header {
  background: $table-header-bg;
  padding: $content-padding-x;

  @media (max-width: $tablet-width) {
    padding: $content-padding-tablet-y $content-padding-tablet-x;
  }

  @media (max-width: $mobile-width) {
    padding: $content-padding-mobile-y $content-padding-mobile-x;
  }

  .headerText {
    color: $summarycard-title-text-color;
    font-size: $header-title-size;
    line-height: 22.5px;
  }
}

.topIcon {
  flex-shrink: 0;
  width: $header-icon-width;
  height: $header-icon-height;
  position: relative;
  margin-right: 32px !important;
  color: $action-primary-icon-color;
  @media (max-width: $tablet-width) {
    margin-right: 13px !important;
    width: 18px;
    height: 18px;
  }
  &::before {
    content: "";
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 37px;
    background-color: #b7b4b2;
    @media (max-width: $tablet-width) {
      right: -10px;
      height: 35px;
    }
  }
  svg {
    width: 100%;
    height: 100%;
  }
}

.actionIcon{
  width: $header-icon-width;
  height: $header-icon-height;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $action-primary-icon-color;
  svg {
    width: 100%;
    height: 100%;
  }
}

.check-icon{
  color: $action-secondary-icon-color !important;
  width: $action-icon-width !important;
  height: $action-icon-height !important;
}

.close-icon{
  width: $action-icon-width !important;
  height: $action-icon-height !important;
}

:v-deep(.redColor) {
  color: red !important;
}

:v-deep(.labelColor) {
  color: $summarycard-title-text-color;
}

:v-deep(.v-input) {
  &:not(.v-input--is-focused) {
    fieldset {
      border-color: $summarycard-input-border-color;
    }
  }
}

// :deep(.controlIcon) {
//   path {
//     fill: $icon-color;
//   }
//   circle {
//     stroke: $icon-color;
//   }
// }

.viewModeContent {
  overflow-x: hidden;
}

:deep(.summaryItem) {
  font-size: 14px;
  margin-bottom: 18px;
  padding-top: 0;
  padding-bottom: 0;
}

.summaryTitle {
  flex-shrink: 0;
}

.summaryValue {
  max-width: 100%;
  text-overflow: ellipsis;
  max-height: 20px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// :deep(.editIcon) {
//   path {
//     fill: $icon-color;
//   }
// }

// :deep(.summaryCardSecondaryButton .icon) {
//   path {
//     fill: $icon-color;
//   }
//   circle {
//     stroke: $icon-color;
//   }
// }
</style>
