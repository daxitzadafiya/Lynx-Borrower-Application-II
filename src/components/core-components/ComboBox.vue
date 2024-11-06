<script setup>
import { computed, reactive, ref, watchEffect, watch } from "vue";

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
  items: {
    type: Array,
    required: false,
    default: [],
  },
  itemText: {
    type: String,
    required: false,
    default: "",
  },
  itemValue: {
    type: String,
    required: false,
    default: "",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  filter:{
    type: Boolean,
    required: false,
    default: false,
  }

});

const emit = defineEmits(["change","search"]);

const inputVal = ref(props.value || "");

watch(
  () => props.value,
  (newValue) => {
    inputVal.value = newValue;
  },
  { deep: true }
);

const onUpdateValue = (event) => {
  emit("change", event);
};

const onSearch = (event) => {
  emit("search", event);
};
</script>
<template>
  <v-col :cols="colsVal" :md="mdVal" :sm="smVal" :lg="lgVal" class="itemContainer">
    <div class="titleText" v-if="isFixedTitle || inputTitle">
      {{ isFixedTitle ? placeholder : inputTitle
      }}<span v-if="isRequired" class="red-text">*</span
      >{{ isFixedTitle && placeholder ? ":" : "" }}
    </div>
    <v-combobox
      :label="
        isFixedTitle
          ? null
          : placeholder
          ? isRequired
            ? placeholder + '*'
            : placeholder
          : ''
      "
      :items="items"
      :item-title="itemText"
      :item-value="itemValue"
      variant="outlined"
      color="primary"
      v-model="inputVal"
      @update:model-value="onUpdateValue($event)"
      :placeholder="placeholder ? placeholder : ''"
      :disabled="disabled"
      :loading="loading"
      :filter="filter"
      @update:search="onSearch"
    />
  </v-col>
</template>

<style lang="scss" scoped>
:deep(.v-label.v-field-label) {
  top: 21px !important;
}
:deep(.v-field__input) {
  padding: 0 12px !important; 
  min-height: 40px !important;
  letter-spacing: normal;
}
:deep(.v-field__append-inner){
  padding: 10px 0 !important;
}
:deep(.v-input__details){
  padding: 0 !important;
  min-height: auto !important;
  display: none;
}

:deep(.text-primary){
  color: $primary-input-control !important;
}

:deep(.v-combobox .v-theme--light),
:deep(.v-field__append-inner) {
  max-height: 40px !important;
}
</style>
