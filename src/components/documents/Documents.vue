<script setup>
import UploadDocument from "@/components/documents/UploadDocument.vue";
import ManageDocuments from "@/components/documents/ManageDocuments.vue";
import { ref, defineProps, watch, onMounted } from "vue";
import { useGeneralStore } from "@/stores/generalStore";
import { useDocumentStore } from "@/stores/documentStore";

const generalStore = useGeneralStore();
const documentStore = useDocumentStore();

const tokenId = ref("");
const isMobileDevice = ref(false);
const manageDocument = ref(false);
const props = defineProps({
  isUploadUsingToken: {
    type: Boolean,
  },
});
const tryCreateToken = async () => {
  if (props.isUploadUsingToken) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    tokenId.value = urlParams.get("tokenId");
  } else {
    try {
      if (generalStore.currentLoan != null && generalStore.currentLoan.Id != null) {
        if (tokenId.value === "") {
          tokenId.value = (
            await documentStore.createTokens(generalStore.currentLoan.Id)
          ).Data.token;
        }
      }
    } catch (err) {}
  }
};

const nextBtnClicked = () => {
  manageDocument.value.tryNavigating();
};
const uploadFile = (file) => {
  manageDocument.value.addFile(file);
};

watch(
  generalStore.currentLoan,
  async (newVal) => {
    if (!props.isUploadUsingToken) {
      await tryCreateToken();
    }
  },
  { deep: true }
);

onMounted(async () => {
  const ua = navigator.userAgent;
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    isMobileDevice.value = true;
  }
  await tryCreateToken();
});
</script>
<template>
  <div class="content-container image-content-type">
    <div class="image-container">
      <UploadDocument
        :uploadFile="uploadFile"
        :tokenId="tokenId"
        :isUploadUsingToken="isUploadUsingToken"
      >
      </UploadDocument>
      <ManageDocuments
        ref="manageDocument"
        :tokenId="tokenId"
        :isUploadUsingToken="isUploadUsingToken"
      ></ManageDocuments>
    </div>
    <div class="navigation-container">
      <NavigationButtons
        :HasDefaultNavigation="false"
        :NextClicked="nextBtnClicked"
      ></NavigationButtons>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.image-container{
  width: 100%;
}
</style>