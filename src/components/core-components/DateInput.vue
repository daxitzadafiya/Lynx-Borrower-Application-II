<script setup>
import { computed, defineEmits, ref } from "vue";
import { VDateInput } from "vuetify/labs/VDateInput";
import moment from "moment";

const isFixedTitle = ref(true);

const props = defineProps({
  mdVal: {
    type: Number,
    required: false,
    default: null,
  },
  smVal: {
    type: Number,
    required: false,
    default: 6,
  },
  lgVal: {
    type: Number,
    required: false,
    default: null,
  },
  colsVal: {
    type: Number,
    required: false,
    default: 12,
  },
  type: {
    type: String,
    required: false,
    default: "text",
  },
  inputTitle: {
    type: String,
    required: false,
    default: "",
  },
  placeholder: {
    type: String,
    required: false,
    default: "",
  },
  isRequired: {
    type: Boolean,
    required: false,
    default: false,
  },
  value: {
    type: String,
    required: false,
    default: "",
  },
  maxDate: {
    type: String,
    default: null,
  },
  inputTitle: {
    type: String,
    default: "",
  },
  appendIcon: {
    type: String,
    default: "mdi-calendar-blank-outline",
  },
  isDisable: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const placeholder = computed(() => {
  return props.inputTitle == null ? "" : props.inputTitle ? 'Enter':'' + props.placeholder || props.inputTitle;
});

const emit = defineEmits(["dateUpdated", "dateCleared"]);

const date = computed(() => {
  return props.value
    ? new Date(props.value+'T00:00:00')
    : props.maxDate ? props.maxDate : "";
});

const dateUpdated = (event) => {
  emit("dateUpdated", event);
};

const rules = computed(() => {
  return props.isRequired ? [(value) => !!value || "Field is required."] : [];
});

const dateCleared = (e) => {
  emit("dateCleared", e);
};

const convertDateFormat = computed(() => {
  return new Date(date.value);
});

const displayDate = computed(() => {
  return moment(new Date(convertDateFormat.value), "UTC").format("MMMM D, YYYY");
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
    <div class="titleText" v-if="isFixedTitle || inputTitle">
      {{ isFixedTitle ? placeholder : inputTitle }}<span v-if="isRequired" class="red-text">*</span>{{ isFixedTitle && placeholder ? ':':'' }}
    </div>
    <v-date-input
      :label="isFixedTitle ? null : placeholder ? isRequired ? placeholder+'*' : placeholder : ''"
      variant="outlined"
      prepend-icon=""
      persistent-placeholder
      hide-details="auto"
      color="primary"
      @update:model-value="dateUpdated"
      :model-value="convertDateFormat"
      clearable
      cancel-text="Clear"
      :display-value="displayDate"
      @click:clear="dateCleared"
      :rules="rules"
      :max="maxDate"
      :disabled="isDisable"
      :placeholder="placeholder ? placeholder : ''"
      :append-inner-icon="appendIcon"
    ></v-date-input>
    <slot />
  </v-col>
</template>
<style lang="scss" scoped>
:deep(.v-field__input) {
  min-height: 40px !important;
  padding: 0 12px !important;
}

:deep(.text-primary){
  color: $primary-input-control !important;
}
</style>
