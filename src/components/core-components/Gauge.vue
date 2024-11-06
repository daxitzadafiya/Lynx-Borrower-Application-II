<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  strokeWidth: {
    type: Number,
    default: 10,
  },
  levels: {
    type: Array,
    required: true,
  },
  totalAngle: {
    type: Number,
    default: 270,
  },
  width: {
    type: Number,
    default: 200,
  },
  height: {
    type: Number,
    default: 200,
  },
  levelAngleGap: {
    type: Number,
    default: 8,
  },
  value: {
    type: Number,
    default: null,
  },
  valueCircleRadius: {
    type: Number,
    default: 10,
  },
  valueCircleThickness: {
    type: Number,
    default: 4,
  },
});
const getSin = (angleInDegree) => Math.sin((angleInDegree * Math.PI) / 180);
const getCos = (angleInDegree) => Math.cos((angleInDegree * Math.PI) / 180);

const getStartAngle = computed(() => {
  return 270 - (360 - props.totalAngle) / 2;
});

const getSingleSectionAngle = computed(() => {
  return (
    (props.totalAngle - props.levelAngleGap * (props.levels.length - 1)) /
    props.levels.length
  );
});

const computedXRadius = computed(() => {
  return props.width / 2 - getTotalPadding.value;
});

const computedYRadius = computed(() => {
  return props.height / 2 - getTotalPadding.value;
});

const getTotalPadding = computed(() => {
  if(props.strokeWidth == null && props.valueCircleRadius == null && props.valueCircleThickness == null) return 0;
  let valueCircleThicknessAndRadius =
    (props.valueCircleRadius == null ? 0 : props.valueCircleRadius) +
    (props.valueCircleThickness == null ? 0 : props.valueCircleThickness);
  if (props.strokeWidth < valueCircleThicknessAndRadius) {
    return valueCircleThicknessAndRadius;
  } else {
    return props.strokeWidth;
  }
});

const getLevelStartAndEndAngles = (index) => {
  let calculatedStartAngle =
    getStartAngle.value - (getSingleSectionAngle.value + props.levelAngleGap) * index;
  return {
    startAngle: calculatedStartAngle,
    endAngle: calculatedStartAngle - getSingleSectionAngle.value,
  };
};

const convertAngleToPosition = (angle) => {
  return `${
    getTotalPadding.value + computedXRadius.value + computedXRadius.value * getCos(angle)
  } ${
    getTotalPadding.value + computedYRadius.value - computedYRadius.value * getSin(angle)
  }`;
};

const getPath = (index) => {
  let curLevelStartAndEndAngles = getLevelStartAndEndAngles(index);
  return `M ${convertAngleToPosition(curLevelStartAndEndAngles.startAngle)} A ${
    computedXRadius.value
  } ${computedYRadius.value} 0 ${
    curLevelStartAndEndAngles.endAngle - curLevelStartAndEndAngles.startAngle > 90
      ? "1"
      : "0"
  } 1 ${convertAngleToPosition(curLevelStartAndEndAngles.endAngle)}`;
};

const valueSectionIndex = computed(() => {
  return props.levels.findIndex((x) => x.start <= props.value && x.end >= props.value);
});

const getAngleFromValue = computed(() => {
  return (
    getStartAngle.value -
    (getSingleSectionAngle.value + props.levelAngleGap) * valueSectionIndex.value -
    ((props.value - props.levels[valueSectionIndex.value]?.start) /
      (props.levels[valueSectionIndex.value]?.end -
        props.levels[valueSectionIndex.value]?.start)) *
      getSingleSectionAngle.value
  );
});

const valueCirclePositionX = computed(() => {
  return (
    getTotalPadding.value +
    computedXRadius.value +
    computedXRadius.value * getCos(getAngleFromValue.value)
  );
});

const valueCirclePositionY = computed(() => {
  return (
    getTotalPadding.value +
    computedYRadius.value -
    computedYRadius.value * getSin(getAngleFromValue.value)
  );
});

const valueCircleStroke = computed(() => {
  return props.levels[valueSectionIndex.value]?.color;
});
</script>
<template>
  <div class="svgWrapper">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
      <path
        v-for="(level, index) in levels"
        :key="index"
        :d="getPath(index)"
        :stroke="level.color"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
      ></path>
      <circle
      v-if="value !== null"
        :cx="valueCirclePositionX"
        :cy="valueCirclePositionY"
        :r="valueCircleRadius"
        :stroke="valueCircleStroke"
        :stroke-width="valueCircleThickness"
        fill="white"
      />
    </svg>
    <div class="contentWrapper mt-5">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.svgWrapper {
  position: relative;
  width: fit-content;
}
.contentWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  flex-direction: column;
}
</style>
