<script setup>
import NewSummaryControl from "@/components/core-components/NewSummaryControl.vue";

import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
// import { getFullCreditReport } from "@/api/creditScore";
import { useCreditStore } from "@/stores/creditStore";
import { useBorrowersStore } from "@/stores/borrowersStore";

const creditStore = useCreditStore();
const borrowerStore = useBorrowersStore();

const gaugeLevels = ref([
  {
    color: "#F61828",
    start: 300,
    end: 579,
  },
  {
    color: "#FAE045",
    start: 580,
    end: 669,
  },
  {
    color: "#9DDF9C",
    start: 670,
    end: 739,
  },
  {
    color: "#6BBE6A",
    start: 740,
    end: 799,
  },
  {
    color: "#2F9C1D",
    start: 800,
    end: 850,
  },
]);
const agencies = ref({});
let imageList = await Promise.all([
  import("@/assets/images/credit/experian_logo.png"),
  import("@/assets/images/credit/equifax_logo.png"),
  import("@/assets/images/credit/transunion.png"),
]);

agencies.value = {
  Experian: imageList[0].default,
  Equifax: imageList[1].default,
  TransUnion: imageList[2].default,
};
const { xs, sm } = useDisplay();


const evaluateSize = (isMiddle) => {
  let val = xs.value ? 130 : sm.value ? 200 : 220;
  return isMiddle ? val : val * 0.7;
};

// const getFullReportAndRedirect = async () => {
//   try {
//     const result = await getFullCreditReport(creditStore.getCreditOrderId());
//     const newBlob = new Blob([result], { type: "application/pdf" });
//     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
//       window.navigator.msSaveOrOpenBlob(newBlob);
//       return;
//     }
//     const data = window.URL.createObjectURL(newBlob);
//     var link = document.createElement("a");
//     link.href = data;
//     link.target = "_blank";
//     // link.download="file.pdf";
//     link.click();
//     setTimeout(function () {
//       // For Firefox it is necessary to delay revoking the ObjectURL
//       window.URL.revokeObjectURL(data);
//     }, 100);
//   } catch (err) {
//     console.log("err: ", err);
//   }
// };

const borrower = computed(() => {
  if (coBorrower.value && coBorrower.value.Id === borrowerStore.Borrower.Id) {
    return borrowerStore.Borrowers.find(
      (item) => item.LinkedBorrowerId === borrowerStore.Borrower.Id && !item.CoBorrower
    );
  }
  return borrowerStore.Borrower;
});

const coBorrower = computed(() => {
  if (borrowerStore.Borrowers.length) {
    return borrowerStore.Borrowers.find(
      (item) =>
        item.CoBorrower &&
        (borrowerStore.Borrower.Id === item.Id ||
          borrowerStore.Borrower.Id === item.LinkedBorrowerId)
    );
  }
  return null;
});

const borrowerScores = computed(() => {
  if (creditStore.getCreditReportDetails()) {
    const details = JSON.parse(
      JSON.stringify(creditStore.getCreditReportDetails().ApplicantDetails)
    );
    const borrowerScores = details.find(
      (item) =>
        item.FirstName === borrower.value.FirstName &&
        item.LastName === borrower.value.LastName
    );
    return borrowerScores
      ? borrowerScores.CreditScores.sort((a, b) => (a.Score < b.Score ? 1 : -1)).map(
          (item) => {
            item.image = agencies.value[item.Source];
            return item;
          }
        )
      : [];
  }
  return [];
});

const coBorrowerScores = computed(() => {
  if (creditStore.getCreditReportDetails()) {
    const details = JSON.parse(
      JSON.stringify(creditStore.getCreditReportDetails().ApplicantDetails)
    );
    if (coBorrower.value) {
      const coScores = details.find(
        (item) =>
          item.FirstName === coBorrower.value.FirstName &&
          item.LastName === coBorrower.value.LastName
      );
      return coScores
        ? coScores.CreditScores.sort((a, b) => (a.Score < b.Score ? 1 : -1)).map(
            (item) => {
              item.image = agencies.value[item.Source];
              return item;
            }
          )
        : [];
    }
  }
  return [];
});

const scoreValue = computed(() => {
  if (borrowerScores.value.length) {
    const midVal = borrowerScores.value.map((item) => item.Score).sort()[1];
    if (coBorrowerScores.value.length) {
      const coMidVal = coBorrowerScores.value.map((item) => item.Score).sort()[1];
      return Math.min(midVal, coMidVal);
    }
    return midVal;
  }
  return 0;
});
</script>
<template>
  <div class="decision-score">
    <NewSummaryControl :header="'Decision Score - ' + scoreValue" :isReadOnly="true">
      <template v-slot:displayContent>
        <v-row class="summary-content-container justify-center">
          <div class="inner-content-container" v-if="true">
            <div class="score-main">
              <v-row class="py-0 w-100">
                <v-col cols="12" class="text-center mb-sm-0 mb-5">
                  <div class="title">
                    Credit Scores for: {{ `${borrower.FirstName} ${borrower.LastName}` }}
                  </div>
                </v-col>
              </v-row>
              <v-row class="justify-center items-center w-100 gauge-container">
                <div
                  class="pb-0 pt-1 d-flex justify-center items-center flex-row-reverse gauageContainer col col-auto w-100"
                  style="position: relative"
                >
                  <v-col
                    v-for="(item, index) in borrowerScores"
                    :key="index"
                    class="pb-0 pt-0 px-5 d-flex justify-center gauageContainer"
                    cols="auto"
                    style="position: relative"
                  >
                    <div class="d-flex align-center" v-if="index <= 2">
                      <Gauge
                        :levels="gaugeLevels"
                        :value="item.Score"
                        :width="evaluateSize(index === 1)"
                        :height="evaluateSize(index === 1)"
                      >
                        <template #content>
                          <div
                            class="d-flex flex-column align-center"
                            :style="{
                              transform: index === 1 ? 'scale(1)' : 'scale(0.7)',
                            }"
                          >
                            <div class="headline mb-2">{{ item.Score }}</div>
                            <div
                              class="image"
                              :style="{ backgroundImage: 'url(' + item.image + ')' }"
                            ></div>
                          </div>
                        </template>
                      </Gauge>
                      <div class="overlay" v-if="index != 1"></div>
                    </div>
                  </v-col>
                  <div class="line" v-if="coBorrowerScores.length"></div>
                </div>
              </v-row>
              <v-row class="py-0 w-100" v-if="coBorrowerScores.length">
                <v-col cols="12" class="text-center mt-5 mb-sm-0 mb-5">
                  <div class="title">
                    Credit Scores for:
                    {{ `${coBorrower?.FirstName} ${coBorrower?.LastName}` }}
                  </div>
                </v-col>
              </v-row>
              <v-row
                class="justify-center items-center w-100 gauge-container"
                v-if="coBorrowerScores.length"
              >
                <div
                  class="pb-0 pt-1 d-flex justify-center items-center flex-row-reverse gauageContainer col col-auto w-100"
                  style="position: relative"
                >
                  <v-col
                    v-for="(item, index) in coBorrowerScores"
                    :key="index"
                    class="pb-0 pt-0 px-5 d-flex justify-center gauageContainer"
                    cols="auto"
                    style="position: relative"
                  >
                    <div class="d-flex align-center" v-if="index <= 2">
                      <Gauge
                        :levels="gaugeLevels"
                        :value="item.Score"
                        :width="evaluateSize(index === 1)"
                        :height="evaluateSize(index === 1)"
                      >
                        <template #content>
                          <div
                            class="d-flex flex-column align-center"
                            :style="{
                              transform: index === 1 ? 'scale(1)' : 'scale(0.7)',
                            }"
                          >
                            <div class="headline mb-2">{{ item.Score }}</div>
                            <div
                              class="image"
                              :style="{ backgroundImage: 'url(' + item.image + ')' }"
                            ></div>
                          </div>
                        </template>
                      </Gauge>
                      <div class="overlay" v-if="index != 1"></div>
                    </div>
                  </v-col>
                  <div class="line" v-if="borrowerStore.Borrowers.length > 2"></div>
                </div>
              </v-row>
            </div>
          </div>
        </v-row>
      </template>
    </NewSummaryControl>
  </div>
</template>
<style lang="scss" scoped>
.text-block {
  &__row {
    align-items: center;
  }
}
.w-100 {
  width: 100% !important;
}
.items-center {
  align-items: center;
}
.score-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
}

.text-center {
  padding: 0px !important;
  max-height: 52px !important;
  box-sizing: border-box;
}

.table-header-row {
  th {
    font-weight: bold;
  }
}

.image-cell {
  padding: 10px 0 0 0;
  width: 120px;
}

.image {
  height: 25px;
  width: 80px;
  background-repeat: no-repeat;
  background-position-y: bottom;
  background-size: contain;
  margin: 0 auto;
}

.score {
  width: 259px;
  height: 171px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  @media (max-width: $sm-tablet-width) {
    height: 120px;
    width: 100%;
    margin-top: 15px;
  }
}

@media (max-width: $sm-tablet-width) {
  tbody tr:last-child {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }
  .image-cell {
    width: 90px;
  }
  .image {
    width: 65px;
  }
}
.fullWidth {
  width: 100%;
}
.overlay {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.4);
  width: 100%;
  height: 100%;
}
.line {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: $primary;
  bottom: 0;
  position: absolute;
}
.gauageContainer {
  @media only screen and (max-width: $xl-mobile-width) {
    flex-direction: column;
    align-items: center;
  }
}

.credit-data {
  .v-divider {
    margin-top: 25px;
  }
  &__report-link {
    font-size: 18px;
    font-weight: 500;
    text-decoration: underline;
    margin-bottom: 15px;
    margin-left: 35px;
    cursor: pointer;
  }
}
.gauge-container {
  margin: auto !important;
  width: fit-content !important;
  margin-top: 12px !important;
  padding-bottom: 0px !important;
}
.title {
  font-size: 1.25rem !important;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em !important;
  white-space: normal !important;
  word-wrap: break-word !important;
}
:deep(.inner-content-container) {
 padding: 0px !important;
}
.flex-row-reverse {
  flex-direction: row-reverse !important;
}
:deep(.headline) {
  font-size: 24px !important;
}

:deep(.v-row) {
  margin: 0 !important;
}

:deep(.viewModeContent){
  overflow:  hidden !important;
}

.justify-center{
  justify-content: center;
}
@media (max-width: $desktop-width) {
  .inner-content-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 40px !important;
  }
  .gauageContainer {
    padding-top: 5px !important;
  }
}
@media (max-width: $tablet-width) {
  .gauageContainer {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .inner-content-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 20px !important;
  }
}
@media (max-width: $mobile-width) {
  .gauageContainer {
    padding-left: 0px !important;
    padding-right: 0px !important;
    padding-top: 0px !important;
    flex-direction: column-reverse !important;
  }
  .gauge-container {
    width: 100% !important;
  }
  .inner-content-container {
    overflow: hidden;
  }
}
</style>
