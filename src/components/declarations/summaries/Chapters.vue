<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: true,
  },
  chapter: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["setChapter"])

const chapters = ref({
  ChapterSeven: "Chapter 7",
  ChapterEleven: "Chapter 11",
  ChapterTwelve: "Chapter 12",
  ChapterThirteen: "Chapter 13",
});

</script>
<template>
  <v-col class="no-pad" :sm="9" :md="7" cols="6">
    <v-row class="chapters">
      <v-col v-for="(value, name) in chapters" :key="name" :sm="3" cols="12">
        <CheckBox
          class="defaultCheckbox mt-0 pt-0"
          :value="chapter === name"
          :label="value"
          :disabled="isDisabled"
          @toggle="emit('setChapter', name)"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
<style lang="scss" scoped>
.chapters {
  position: relative;
  margin-top: 20px;
  margin-bottom: 0px;
  &__item {
    align-items: center;
  }
  &__title {
    margin-left: 5px;
  }
  &_disabled {
    opacity: 0.5;
  }
}

@media (max-width: 450px) {
  .chapters {
    flex-direction: column;
  }
  .no-pad-mobile {
    padding: 0 12px;
  }
}
</style>
