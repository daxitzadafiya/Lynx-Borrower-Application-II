<script setup>
import { useProgressNavigation } from "@/composables/useProgressNavigation";
import { loanPatch } from "@/mixins/loanPatch.js";
import { useRouter } from "vue-router";
import { ref, defineProps, onUnmounted, onMounted, defineEmits, computed } from "vue";
import { useGeneralStore } from "@/stores/generalStore";

const {
  currentSection,
  currentSectionAndPageData,
  getAppHistoryLength,
  nextButtonConditionsOverridden,
} = useGeneralStore();

const { navigateToNextStep } = useProgressNavigation();
const router = useRouter();
const { saveAndAdvance } = loanPatch();
const currentSections = ref(currentSection);
const currentSectionAndPage = ref(currentSectionAndPageData);
const emit = defineEmits(["previousClicked"]);

const props = defineProps({
  hideProgressAndPrevious: {
    type: Boolean,
    required: false,
    default: false,
  },
  ConditionsMet: {
    type: Boolean,
    default: false,
  },
  nextButtonText: {
    type: String,
    required: false,
    default: "Next",
  },
  ButtonType: {
    type: String,
    default: "primary",
  },
  isProgressDot: {
    type: Boolean,
    required: false,
    default: true,
  },
  SaveOnNextClick: {
    type: Boolean,
    default: true,
  },
  RequestedNextPath: {
    type: String,
  },
  NextClicked: {
    type: Function,
  },
  HasDefaultNavigation: {
    type: Boolean,
    default: true,
  },
  NextBtnWidth: {
    type: String,
    default: undefined,
  },
});

const onNextClicked = () => {
  if (props.NextClicked) {
    props.NextClicked();
  }
  if (props.HasDefaultNavigation) {
    saveAndAdvance(props.SaveOnNextClick, props.RequestedNextPath);
  } else if (props.RequestedNextPath) {
    router.push("/" + props.RequestedNextPath);
  }
};

const progressContainer = ref(null);
const totalDotsWidthAvailable = ref(null);

const pages = computed(() => {
  if (currentSections.value?.Pages == null) {
    return [];
  }
  var computedPagesLength = currentSections.value.Pages.length - 1;
  if (
    currentSections.value?.Pages[currentSections.value?.Pages.length - 1].Route.includes(
      "summary"
    )
  ) {
    computedPagesLength--;
  }
  if (
    currentSections.value?.Pages[currentSections.value?.Pages.length - 2].Route.includes(
      "review"
    )
  ) {
    computedPagesLength--;
  }
  return Array.from({ length: computedPagesLength + 1 }, (_, i) => i);
});

const navigateToPreviousPage = () => {
  router.back();
  emit("previousClicked");
};

onMounted(() => {
  setTotalDotWidthAvailable();
  window.addEventListener("resize", setTotalDotWidthAvailable);
  
});

onUnmounted(()=>{
  window.removeEventListener("resize", setTotalDotWidthAvailable);
})

const setTotalDotWidthAvailable = () => {
  if (progressContainer.value != null) {
    totalDotsWidthAvailable.value =
      progressContainer.value.getBoundingClientRect().width - 10; //10=margin
  }
};

const computedPageDivideFactor = computed(() => {
  if (totalDotsWidthAvailable.value < 19) {
    return Infinity;
  }
  const dotsSpace = totalDotsWidthAvailable.value / 19;
  let divisor = 1;
  if (dotsSpace == 0) {
    return;
  }
  while (pages.value.length / divisor > dotsSpace) {
    divisor++;
  }

  return divisor;
});

const computedPagesArray = computed(() => {
  if (computedPageDivideFactor.value == Infinity) {
    return [];
  }
  return Array.from(
    {
      length: Math.ceil(pages.value.length / computedPageDivideFactor.value),
    },
    (_, i) => i
  );
});

const computedActivePagesArray = computed(() => {
  return computedPagesArray.value.filter(
    (index) =>currentSectionAndPage.value?.PageIndex / computedPageDivideFactor.value >= index);
  });

const computedInActivePagesArray = computed(() => {
  return computedPagesArray.value.filter(
    (index) =>
    currentSectionAndPage.value?.PageIndex / computedPageDivideFactor.value < index
    );
  });

const previousPage = computed(() => {
  return getAppHistoryLength() <= 1;
});

const isNextDisabled = computed(() => {
  let nbo = nextButtonConditionsOverridden.value;
  let cm = props.ConditionsMet;
  return nbo ? false : cm;
});
</script>
<template>
  <div
    class="d-flex navButtonsContianer"
    :class="hideProgressAndPrevious ? 'justify-center' : 'justify-space-between'"
  >
    <v-btn
      variant="outlined"
      color="primary"
      :style="previousPage ? 'opacity:0;pointer-events:none;' : ''"
      v-if="!hideProgressAndPrevious"
      @click="navigateToPreviousPage"
      class="variableButtonWidth"
      :class="`previous-${ButtonType}-button` + (NextBtnWidth ? '' : ' variableButtonWidth')"
      :width="NextBtnWidth"
      >Previous
    </v-btn>
    <div
      class="d-flex justify-center flex-grow-1 progressContainer"
      v-if="!hideProgressAndPrevious || isProgressDot"
    >
      <div
        class="position-absolute d-flex justify-center align-center progressInnerContainer"
        ref="progressContainer"
      >
        <div class="activeProgressDotContainer">
          <div class="progressDot" v-for="index in computedActivePagesArray"></div>
        </div>
        <div class="inactiveProgressDotContainer">
          <div
            class="progressDot"
            v-for="(index, i) in computedInActivePagesArray"
            :style="
              'transform:scale(' +
              (1 - (computedPageDivideFactor - 1) * 0.03 * (i + 1)) +
              ')'
            "
          ></div>
        </div>
      </div>
    </div>

    <v-btn
      variant="flat"
      color="primary"
      :class="`${ButtonType}-button` + (NextBtnWidth ? '' : 'variableButtonWidth')"
      @click="onNextClicked"
      :disabled="isNextDisabled"
      :width="NextBtnWidth"
      class="variableButtonWidth"
    >
      {{ nextButtonText || "Next" }}
    </v-btn>
  </div>
</template>
<style lang="scss" scoped>
// @import "@/assets/styles/colors.scss";
// @import "@/assets/styles/variables.scss";
.progressDot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #b8b4b3;
  margin: 0px 5px;
}

.inactiveProgressDotContainer,
.activeProgressDotContainer {
  display: contents;
}

.activeProgressDotContainer {
  .progressDot {
    background: $primary;
  }
}
.navButtonsContianer {
  padding: $content-padding-x;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  @media (max-width: $tablet-width) {
    padding: $content-padding-tablet-y $content-padding-tablet-x;
  }
  @media (max-width: $mobile-width) {
    padding: $content-padding-mobile-y $content-padding-mobile-x;
  }
}

.progressContainer {
  position: relative;
  margin: 0px 5px;
  .progressInnerContainer {
    width: calc(100% - 10px);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
  }
}

.variableButtonWidth {
  width: 152px;
  @media (max-width: $tablet-width) {
    width: 100px !important;
  }
  @media (max-width: $mobile-width) {
    width: 75px !important;
  }
}

.v-btn {
  border-radius: 5px;
  text-transform: none;
  letter-spacing: normal;
  padding: 8px 15px;
  font-weight: 500;
  font-size:14px;
  line-height: 21px;
  letter-spacing: 0.01em;
  height: 37px;

  @media (max-width: $mobile-width) {
    padding: 4px 15px !important;
    height: 29px !important;
  }

}

:deep(.bg-primary){
  background: $primary !important;
}

:deep(.secondary-button){
  background: $orange !important;
}

:deep(.text-primary){
  color: $primary !important;
}
</style>
