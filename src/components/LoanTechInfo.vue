<script setup>
import { useGeneralStore } from "@/stores/generalStore";
import { useRoute } from "vue-router";
import progressModelHandler from "@/helpers/progressModelHandler";
import { computed, onMounted, ref, watch } from "vue";
import CustomButton from "./core-components/CustomButton.vue";

const generalStore = useGeneralStore();

const route = useRoute();
const progressModel = ref("");
const isLoan = ref(true);
const loanPatches = ref(generalStore.loanPatches)
onMounted(() => {
  getLoan();
  getPatches();
  getProgressModel();
});

const getLoan = () => {
  const channelId = 111;
  generalStore.setBroadcast(channelId);
  generalStore.broadcast.postMessage("getLoan");
};

const getPatches = async () => {
  const loanId = route.params.loanId;
  await generalStore.getPatchesById(loanId);
};

const beautifyJson = (obj) => {
  return JSON.stringify(
    obj,
    (key, value) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          return value;
        } else {
          return undefined;
        }
      } else if (value != null && typeof value === "object") {
        return value;
      } else if (value !== null) return value;
      return undefined;
    },
    "\t"
  );
};

const closeBc = () => {
  generalStore.broadcast?.postMessage("close");
};

const saveProgressModel = () => {
  progressModelHandler.setCurrentProgressModel(progressModel.value);
};

const getProgressModel = () => {
  const storageModel = localStorage.getItem("progressModel");
  progressModel.value = storageModel ? beautifyJson(JSON.parse(storageModel)) : "";
};

const jsonViewLoan = computed(() => {
  return generalStore.currentLoan ? beautifyJson(generalStore.currentLoan) : "";
});

const lastAppliedPatches = computed(() => {
  return generalStore.getCurrentLoanPatches()
  ? beautifyJson(generalStore.getCurrentLoanPatches())
  : "";
});

const progressModelJsonView = computed(() => {
  return progressModel.value ? beautifyJson(progressModel.value) : "";
});

const aceEditorInit = (editor) => {
  console.log("Ace Editor initialized");
};

window.addEventListener("beforeunload", closeBc);

watch(
  () => generalStore.progressModel,
  (val) => {
    progressModel.value = beautifyJson(JSON.parse(val));
  },
  { deep: true }
);
</script>

<template>
  <div v-if="generalStore.currentLoan" class="d-flex w-100 ga-6 mb-4">
    <div class="item w-50 loan">
      <div class="item__title mb-2
      ">
        <span
          class="item__switcher"
          :class="{ 'opacity-05': !isLoan }"
          @click="isLoan = true"
        >
          Loan {{ generalStore.currentLoan.Id }}
        </span>
        <span
          class="item__switcher"
          :class="{ 'opacity-05': isLoan }"
          @click="isLoan = false"
        >
          Progress Model
        </span>
        <CustomButton v-if="!isLoan" class="item__button" @click="saveProgressModel">
          Save
        </CustomButton>
      </div>
      <AceEditor
        v-if="isLoan"
        v-model:value="jsonViewLoan"
        :theme="'github'"
        lang="json"
        @init="aceEditorInit"
        :readonly="true"
      />
      <AceEditor
        v-else
        v-model="progressModel"
        @init="aceEditorInit"
        width="100%"
        height="96%"
        lang="json"
        theme="github"
        :options="{ readOnly: false }"
        style="flex-grow: 1"
      />
    </div>
    <div class="item w-50 loan-patch" v-if="loanPatches">
      <div class="item__title mb-2 d-flex justify-space-between align-center">

        <span>
          Last Patches for Loan {{ generalStore.currentLoan.Id }}
          </span>
        <!-- <CustomButton class="item__button" value="Refresh" @click="getPatches"></CustomButton> -->
        <v-icon class="mx-4" @click="getPatches">mdi-refresh</v-icon>
      </div>
      <AceEditor
        :value="lastAppliedPatches"
        @init="aceEditorInit"
        width="100%"
        height="94%"
        lang="json"
        theme="github"
        :options="{ readOnly: true }"
        style="flex-grow: 1"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.d-flex {
  max-height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.item {
  height: 100%;
  box-sizing: border-box;
  &__title {
    color: black;
    padding-left: 50px;
    font-weight: 600;
  }
  &__switcher {
    padding: 0 10px;
    cursor: pointer;
    &:first-child {
      border-right: 1px solid;
    }
  }
}

.opacity-05 {
  opacity: 0.5;
}

:deep(.loan .ace_editor ) {
  height: calc(100% - 32px) !important;
    width: 100% !important;
  .ace_text-input {
    position: relative !important;
  }
}
:deep(.loan-patch .ace_editor ) {
  height: calc(100% - 32px) !important;
  width: 100% !important;
  .ace_text-input {
    position: relative !important;
  }
}
</style>
