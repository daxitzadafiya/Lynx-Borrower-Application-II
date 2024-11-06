<script setup>
import { computed, reactive, ref, watch } from "vue";

// const isFixedTitle = ref(true);

const props = defineProps({
  mdVal: {
    type: Number,
    required: false,
    default: null,
  },
  smVal: {
    type: [String,Number],
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
  appendIcon: {
    type: String,
    required: false,
    default: "",
  },
  isPassword: {
    type: Boolean,
    required: false,
    default: false,
  },
  isPasswordCopy: {
    type: Boolean,
    required: false,
    default: false,
  },
  isEmail: {
    type: Boolean,
    required: false,
    default: false,
  },
  id: {
    type: [String, Number],
    required: false,
    default: "",
  },
  maxNum: {
    type: Number,
    required: false,
    default: null,
  },
  tabIndexValue: {
    type: Number,
    required: false,
    default: null,
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
  prependIcon: {
    type: String,
    required: false,
    default: "",
  },
  prefix: {
    type: String,
    required: false,
    default: "",
  },
  defaultPlaceholder: {
    type: String,
    required: false,
    default: "",
  },
  suffix: {
    type: String,
    required: false,
    default: "",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  readOnly: {
    type: Boolean,
    required: false,
  },
  maskValue: {
    type: String,
    required: false,
    default: "",
  },
  passwordValue: {
    type: String,
    required: false,
    default: "",
  },
  isFixedTitle:{
    type: Boolean,
    required: false,
    default: true,
  }
});

const emailRegex = reactive(
  /[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/
);

const requiredRule = (value) => !!value || "Field is required.";
const passwordRule = (value) =>
  value.length >= 8 || "Password must be at least 8 characters long.";
const emailRule = (value) => {
  const pattern = emailRegex;
  return pattern.test(value) || "Invalid e-mail.";
};
const passwordCopyRule = (value) => (value.length && value === props.passwordValue || "Passwords do not match")

const rules = computed(() => {
  let rulesArray = [];

  if (props.isRequired) {
    rulesArray.push(requiredRule);
  }
  if (props.isPassword) {
    rulesArray.push(passwordRule);
  }
  if (props.isEmail) {
    rulesArray.push(emailRule);
  }
  
  if(props.isPasswordCopy){
    rulesArray.push(passwordCopyRule);
  }

  return rulesArray.length > 0 ? rulesArray : undefined;
});

const emit = defineEmits(["onChange", "onIconClick","keyup","focus","blur"]);

const onHandleChange = (e) => {
  const target = e.target;
  if (props.maxNum) {
    target.value = parseInt(target.value) > props.maxNum ? props.maxNum : target.value;
    inputVal.value = parseInt(target.value) > props.maxNum ? target.value.charAt(0) : target.value;
  }
  emit("onChange", target.value);
};

const onIconClick = () => {
  emit("onIconClick");
};

const onKeyUp = (e) => {
  emit("keyup",e);
};

const onFocus = (e) => {
  emit("focus",e);
};

const onBlur = (e) => {
  emit("blur",e);
};

const inputVal = ref(props.value ?? "");

watch(
  () => props.value,
  (newValue) => {
    inputVal.value = newValue
  },
  { deep: true }
);
</script>
<template>
  <v-col
    :cols="colsVal"
    :md="mdVal"
    :sm="smVal"
    :lg="lgVal"
    class="itemContainer"
  >
    <div class="titleText" v-if="isFixedTitle  || inputTitle">
      {{ isFixedTitle ? placeholder : inputTitle }}<span v-if="isRequired" class="red-text">*</span>{{ isFixedTitle && placeholder ? ':':'' }}
    </div>
    <v-text-field
      :id="id"
      class="px-0"
      :type="type"
      v-model="inputVal"
      :label="isFixedTitle ? null : placeholder ? isRequired ? placeholder+'*' : placeholder : ''"
      variant="outlined"
      @input="onHandleChange"
      :rules="rules"
      hideDetails="auto"
      autocomplete="on"
      validate-on-blur="validate-on-blur"
      :hint="hint"
      @click:append-inner="onIconClick"
      color="primary"
      :maxlength="maximumLength"
      @keyup="onKeyUp"
      @focus="onFocus"
      :tabindex="tabIndexValue"
      :placeholder="placeholder ? placeholder : defaultPlaceholder"
      :prepend-inner-icon="prependIcon"
      :append-inner-icon="appendIcon"
      :prefix="prefix"
      :suffix="suffix"
      :disabled="disabled"
      @blur="onBlur"
      :readonly="readOnly"
      v-mask="maskValue"
    ></v-text-field>
  </v-col>
</template>

<style lang="scss" scoped>
:deep(.v-label.v-field-label) {
  top: 21px !important;
}
:deep(.v-field__input) {
  padding: 10px !important;
  min-height: auto !important;
}
:deep(.text-primary){
  color: $primary-input-control !important;
}
:deep(.v-input .v-text-field__prefix) {
  opacity: 1 !important;
  visibility: visible !important;
}
:deep(.v-input .v-text-field__suffix) {
  opacity: 1 !important;
  visibility: visible !important;
  padding-right: 12px;
}
:deep(.v-field__field) {
  align-items: center !important;
  height: 40px !important;
}
:deep(.v-field__input) {
  padding: 12px !important;
  letter-spacing: normal !important;
}
:deep(.v-text-field__prefix) {
  padding-left: 12px;
  min-height: auto !important;
}
:deep(.v-field--active.v-field--focused .v-text-field__prefix) {
  color: $black !important;
}
:deep(.v-text-field--prefixed.v-text-field .v-field__input) {
  padding: 4px !important;
}
</style>
