<script setup>
import { computed, ref, onMounted, watch, defineEmits } from 'vue'
import { useBrandingStore } from '@/stores/brandingStore';
import Person from "@/components/images/illustrationPage/Person.vue";
import Home from "@/components/images/illustrationPage/Home.vue";
import { useRoute } from 'vue-router';

const brandingStore = useBrandingStore();
const title = computed(
  () =>
    (brandingStore.getIsHostedMode() && brandingStore.introSlide && brandingStore.introSlide.Title) ||
    'Thank you for choosing our company to help with your mortgage'
);

const currentStep = ref(0);
const currentActive = ref(0);
const route = useRoute();
const emit = defineEmits(['setProgressVisibility']);

watch(currentActive, (val) => {
  setTimeout(() => {
    if (val > 102) {
      currentActive.value = 0;
    } else {
      currentActive.value = val + 2.30;
    }
  }, 228);
});

watch(currentStep, (val) => {
  setTimeout(() => {
    if (val === steps.value.length + 1) {
      currentStep.value = 1;
    } else {
      currentStep.value = val + 1;
    }
  }, 1500);
});

const steps = ref([]);

onMounted(async () => {
  const images = await Promise.all([
    import('@/assets/images/animated-sidebar/step-1.svg'),
    import('@/assets/images/animated-sidebar/step-2.svg'),
    import('@/assets/images/animated-sidebar/step-3.svg'),
    import('@/assets/images/animated-sidebar/step-4.svg'),
    import('@/assets/images/animated-sidebar/step-5.svg'),
    import('@/assets/images/animated-sidebar/step-6.svg')
  ]);

  steps.value = images.map(image => image.default);
  currentStep.value = 1;
  currentActive.value = 1;
  emit('setProgressVisibility',{name:route.name})
});
const content = computed(() => brandingStore.getIsHostedMode() && brandingStore.introSlide && brandingStore.introSlide.Content)
</script>
<template>
  <div class="w-100 flex-column justify-center align-center text-center greetingsContainer mx-auto">
    <div class="bg-white sub-greet">
      <div class="main-content">
        <div class="titleText primary-text">{{ title }}</div>
        <div class="titleSecondaryText" v-if="content">
          {{ content }}
        </div>
        <div class="titleSecondaryText" v-else>
          Our process is broken down into 6 simple sections to help speed up and simplify your mortgage process. At any time, in any section you can click the help icon at the top right to get instant answers to any questions you may have. Our entire process from start to finish can take as little as 5 minutes!
        </div>
      </div>
      <!-- animated illustration start -->
      <div class="position-relative d-flex flex-column justify-center align-center text-center illustration">
        <Home class="titleImage" />
        <div class="wave-svg">
          <svg class="wave-line-svg" style="width: 100%" width="464" height="77" viewBox="0 0 464 77" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <!-- Background Path -->
            <path
              d="M3.70929 38.282C3.04676 22.8081 17.5476 3.59668 40.0936 3.59668C65.2929 3.59668 77.7314 20.4692 79.5819 38.282C81.4325 56.0948 93.8709 72.9673 119.07 72.9673C141.616 72.9673 156.117 53.7558 155.455 38.282C154.792 22.8081 169.293 3.59668 191.839 3.59668C217.038 3.59668 229.477 20.4692 231.327 38.282C233.178 56.0948 245.616 72.9673 270.816 72.9673C293.362 72.9673 307.862 53.7558 307.2 38.282C306.537 22.8081 321.783 3.59668 344.329 3.59668C369.528 3.59668 381.967 20.4692 383.817 38.282C385.668 56.0948 398.106 72.9673 423.305 72.9673C445.851 72.9673 460.352 53.7558 459.69 38.282"
              stroke="#CAC5E8" stroke-width="7" stroke-linecap="round" />
            <!-- Path for Inner Shadow -->
            <path id="innerShadow"
              d="M3.70929 38.282C3.04676 22.8081 17.5476 3.59668 40.0936 3.59668C65.2929 3.59668 77.7314 20.4692 79.5819 38.282C81.4325 56.0948 93.8709 72.9673 119.07 72.9673C141.616 72.9673 156.117 53.7558 155.455 38.282C154.792 22.8081 169.293 3.59668 191.839 3.59668C217.038 3.59668 229.477 20.4692 231.327 38.282C233.178 56.0948 245.616 72.9673 270.816 72.9673C293.362 72.9673 307.862 53.7558 307.2 38.282C306.537 22.8081 321.783 3.59668 344.329 3.59668C369.528 3.59668 381.967 20.4692 383.817 38.282C385.668 56.0948 398.106 72.9673 423.305 72.9673C445.851 72.9673 460.352 53.7558 459.69 38.282"
              stroke="url(#innerShadowGradient)" stroke-width="7" stroke-linecap="round" fill="none"
              style="stroke-dasharray: 8000; stroke-dashoffset: 8000;">
              <animate attributeName="stroke-dashoffset" from="3000" to="0" dur="7s" repeatCount="indefinite" />
            </path>
            <!-- Define linear gradient for inner shadow -->
            <defs>
              <linearGradient id="innerShadowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop :offset="(currentActive - 5) + '%'" class="animated-wave-shadow-light"></stop>
                <stop :offset="currentActive + '%'" class="animated-wave-shadow-dark"></stop>
                <stop :offset="(currentActive + 5) + '%'" class="animated-wave-shadow-light"></stop>
              </linearGradient>
            </defs>
          </svg>
          <div v-for="(step, index) in steps" :key="index" class="steps "
            :class="`step-${index + 1} ${index + 1 === currentStep ? 'step-active' : currentStep > index + 1 ? 'step-passed' : ''}`">
            <inline-svg :src="step" />
          </div>
        </div>
        <Person class="sidebar-person-image" />
      </div>
      <!-- animated illustration end -->
      <NavigationButtons ButtonType="secondary" nextButtonText="Start" :hideProgressAndPrevious="true"
        :isProgressDot="false">
      </NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>

.greetingsContainer {
  width: 100%;
  margin-bottom: 5px;
  border-radius: 7px;
  width: 100%;
}

.sub-greet {
  border: 1px solid $background-light;
  padding: 24px;

  @media (max-width: $mobile-width) {
    padding: 24px;
  }
}

.titleText {
  font-weight: 500;
  font-size: 26px;
  line-height: 39px;
  margin: 0px 0px 16px 0px;
  max-width: 800px;
}

.main-content {
  text-align: left;
}

.titleSecondaryText {
  font-size: 14px;
  margin-bottom: 20px;
}

.titleImage {
  margin: 20px 0px;
  width: auto;
  height: auto;
  max-height: 375px;
  position: relative;
  z-index: 0;
  @media(max-width : $tablet-width){
      height:revert-layer;
      width: 100%;
  }
  @media (max-width: $mobile-width) {
    width: 100%;
    height: auto;
  }
}

.sidebar-person-image {
  position: absolute;
  left: 50%;
  top: 60px;
  width: 105px;
  z-index: 99;

  @media (max-width: $mobile-width) {
    width: 17%;
    top: -21px;
  }

  @media (max-width: $sm-width) {
    width: 15%;
    top: -13px;
  }

  @media (max-width: $xsm-width) {
    width: 40px;
    top: -35px;
  }

  @media (max-width: $xxsm-width) {
    width: 33px;
    top: -51px;
  }
}

.position-relative {
  position: relative;
}

.animated-wave-shadow-light {
  stop-color: $light-purpleV2;
  stop-opacity: 0;
}

.animated-wave-shadow-dark {
  stop-color: $dark-blueV2;
}

.wave-svg {
  position: absolute;
  bottom: 225px;

  @media (max-width: $mobile-width) {
    bottom: 44%;
  }

  @media (max-width: $sm-width) {
    bottom: 85px
  }

  @media (max-width: $xsm-width) {
    bottom: 85px
  }

  @media (max-width: $xxsm-width) {
    bottom: 62px
  }
}

.steps {
  width: $step-width;
  height: $step-height;
  background: $light-grayV2;
  color: $secondaryV2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;

  @media (max-width: $mobile-width) {
    width: $step-tablet-width;
    height: $step-tablet-height;
  }

  @media (max-width: $sm-width) {
    width: $step-mobile-width;
    height: $step-mobile-height;
  }

  @media (max-width: $xsm-width) {
    width: $step-xs-width;
    height: $step-xs-height;
  }

  @media (max-width: $xxsm-width) {
    width: 24px;
    height: 24px;
  }
}

.step {
  &-active {
    background: transparent !important;
    color: $primaryV2 !important;
    border: $step-border solid $primaryV2 !important;
    animation: fadeIn 1s linear forwards;
  }

  &-passed {
    background: $primaryV2 !important;
    color: $whiteV2 !important;
    animation: slideIn 1s linear forwards;
  }

  &-1 {
    top: 17%;
    left: 2.4%;

    @media (max-width: $mobile-width) {
      top: 26%;
      left: 3.8%;
    }

    @media (max-width: $sm-width) {
      top: 36%;
      left: 2%;
    }

    @media (max-width: $xsm-width) {
      top: 30%;
      left: 2.8%;
    }

    @media (max-width: $xxsm-width) {
      top: 33%;
      left: 3.5%;
    }

    svg {
      width: 7px;

      @media (max-width: $mobile-width) {
        width: 5px;
      }

      @media (max-width: $sm-width) {
        width: 4px;
      }
    }
  }

  &-2 {
    top: -15px;
    left: 18.6%;

    @media (max-width: $mobile-width) {
      top: 9px;
      left: 19.6%;
    }

    @media (max-width: $sm-width) {
      top: 15px;
      left: 18%;
    }

    @media (max-width: $xsm-width) {
      top: 11px;
      left: 19%;
    }

    @media (max-width: $xxsm-width) {
      top: 18px;
      left: 20%;
    }

    svg {
      width: 19px;

      @media (max-width: $mobile-width) {
        width: 13px;
      }

      @media (max-width: $sm-width) {
        width: 11px;
      }
    }
  }

  &-3 {
    top: 12px;
    left: 35%;

    @media (max-width: $mobile-width) {
      top: 23px;
      left: 36.4%;
    }

    @media (max-width: $sm-width) {
      top: 29px;
      left: 35%;
    }

    @media (max-width: $xsm-width) {
      top: 25px;
      left: 35.5%;
    }

    @media (max-width: $xxsm-width) {
      top: 28px;
      left: 36%;
    }

    svg {
      width: 14px;

      @media (max-width: $mobile-width) {
        width: 10px;
      }

      @media (max-width: $sm-width) {
        width: 8px;
      }
    }
  }

  &-4 {
    top: -58px;
    left: 45%;

    @media (max-width: $mobile-width) {
      top: -23px;
      left: 45%;
    }

    @media (max-width: $sm-width) {
      top: -14px;
      right: 43%;
    }

    @media (max-width: $xxsm-width) {
      top: -10px;
      right: 43%;
    }

    svg {
      width: 19px;

      @media (max-width: $mobile-width) {
        width: 14px;
      }

      @media (max-width: $sm-width) {
        width: 10px;
      }
    }
  }

  &-5 {
    top: 15px;
    right: 19%;
    z-index: 9;

    @media (max-width: $mobile-width) {
      top: 23px;
      right: 20%;
    }

    @media (max-width: $sm-width) {
      top: 25px;
      right: 19.4%;
    }

    @media (max-width: $xxsm-width) {
      top: 29px;
      right: 20%;
    }

    svg {
      width: 16px;

      @media (max-width: $mobile-width) {
        width: 11px;
      }

      @media (max-width: $sm-width) {
        width: 8px;
      }
    }
  }

  &-6 {
    top: 0px;
    right: 2.3%;

    @media (max-width: $mobile-width) {
      top: 17px;
      right: 3%;
    }

    @media (max-width: $sm-width) {
      top: 20px;
      right: 3%;
    }

    @media (max-width: $xxsm-width) {
      top: 24px;
      right: 3%;
    }

    svg {
      width: 17px;

      @media (max-width: $mobile-width) {
        width: 12px;
      }

      @media (max-width: $sm-width) {
        width: 9px;
      }
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.illustration-container {
  padding: 24px;
}

.navButtonsContianer {
  padding: 0 !important;
  justify-content: start !important;
}

.content-container {
  margin-top: 0 !important;
}

:deep(.home__container) {
  padding: 0 40px !important;
  margin-top: 32px !important;
}

.illustration {
  padding: 30px
}
</style>
