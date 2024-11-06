<script setup>
import Table from "@/components/credit/derogatoryItems/Table.vue";
import { ref } from "vue";
const editIcon = ref("");
let imageList = await Promise.all([
  import("@/assets/images/edit.svg"),
]);
editIcon.value = imageList[0].default;
</script>
<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">
        Please take a moment to review the derogatory items we have found on your credit
        report, which may include Collections, Bankruptices, and Foreclosures
      </div>
    </div>
    <div class="inner-content-container">
      <div class="body-2  infoText" style="max-width: unset">
        <span
          >If you would like to provide us any additional information about a liability,
          please click the pencil </span
        ><span> <inline-svg :src="editIcon" class="tableInfoIcon"></inline-svg></span
        ><span>link.</span>
      </div>
      <Table></Table>
    </div>
    <div class="navigation-container">
      <NavigationButtons></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.infoText {
  color: $gray3;
  padding-bottom: 10px !important;
  span {
    font-size: 14px !important;
    letter-spacing: 0.0178571429em !important;
    line-height: 1.25rem;
  }
}
</style>
