<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";
import Table from "@/components/credit/derogatoryItems/Table.vue";
import { ref } from "vue";
const editIcon = ref("");
let imageList = await Promise.all([import("@/assets/images/edit.svg")]);
editIcon.value = imageList[0].default;
</script>
<template>
  <div class="derogatory-items">
    <NewSummaryControl header="Derogatory Items" isReadOnly>
      <template v-slot:displayContent>
        <div class="body-2 pb-3 infoText" style="max-width: unset">
          <span
            >If you would like to provide us any additional information about a liability,
            please click the pencil </span
          ><span> <inline-svg :src="editIcon" class="tableInfoIcon"></inline-svg></span
          ><span>link.</span>
        </div>
        <Table></Table>
      </template>
    </NewSummaryControl>
  </div>
</template>
<style lang="scss" scoped>
.infoText {
  padding-bottom: 10px !important;
  span {
    color: $content-black !important;
    font-size: 14px !important;
    letter-spacing: 0.0178571429em !important;
    line-height: 1.25rem;
  }
}

:deep(.headerText) {
  line-height: 22.5px !important;
}

:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(1)) {
  width: 140.52px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(2)) {
  width: 160.31px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(3)) {
  width: 136.08px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(4)) {
  width: 176.91px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(5)) {
  width: 136.13px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(6)) {
  width: 194.64px !important;
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(7)) {
  width: 82.42px !important;
}
</style>
