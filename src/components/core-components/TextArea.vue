<script setup>
import { computed, reactive, ref, watch } from "vue";

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
    type: [String, Number, Boolean],
    required: false,
    default: "",
  },
  hint: {
    type: String,
    required: false,
    default: "",
  },
  id: {
    type: String,
    required: false,
    default: "",
  },
  autoFocus: {
    type: Boolean,
    required: false,
    default: null,
  },
  maximumLength: {
    type: Number,
    required: false,
    default: null,
  },
  defaultPlaceholder: {
    type: String,
    required: false,
    default: "",
  },
  rows: {
    type: Number,
    required: false,
  },
});

const requiredRule = (value) => !!value || "Field is required.";

const rules = computed(() => {
  let rulesArray = [];

  if (props.isRequired) {
    rulesArray.push(requiredRule);
  }

  return rulesArray.length > 0 ? rulesArray : undefined;
});

const emit = defineEmits(["onChange", "keyup"]);

const onHandleChange = (e) => {
  const target = e.target;
  emit("onChange", target.value);
};

const onKeyUp = (e) => {
  emit("keyup", e);
};

const inputVal = ref(props.value || "");

watch(
  () => props.value,
  (newValue) => {
    inputVal.value = newValue;
  },
  { deep: true }
);
</script>
<template>
  <v-col :cols="colsVal" :md="mdVal" :sm="smVal" :lg="lgVal" class="itemContainer">
    <div class="titleText" v-if="isFixedTitle || inputTitle">
      {{ isFixedTitle ? placeholder : inputTitle
      }}<span v-if="isRequired" class="red-text">*</span
      >{{ isFixedTitle && placeholder ? ":" : "" }}
    </div>
    <v-textarea
    :id="id"
    class="px-0"
    :type="type"
    v-model="inputVal"
    :label="
      isFixedTitle
        ? null
        : placeholder
        ? isRequired
          ? placeholder + '*'
          : placeholder
        : ''
    "
    variant="outlined"
    @input="onHandleChange"
    :rules="rules"
    hideDetails="auto"
    autocomplete="on"
    validate-on-blur="validate-on-blur"
    :hint="hint"
    color="primary"
    :maxlength="maximumLength"
    @keyup="onKeyUp"
    :rows="rows"
    auto-grow
    no-resize
  ></v-textarea>
  </v-col>
</template>

<style lang="scss" scoped>
:deep(.v-label.v-field-label) {
  top: 21px !important;
}
:deep(.text-primary) {
  color: $primary-input-control !important;
}
:deep(.v-field__input){
  padding-left: 0;
}
</style>
