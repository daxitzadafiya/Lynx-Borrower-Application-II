<script setup>
import UploadDocuments from "@/components/images/documents/UploadDocuments.vue";
import { onMounted, ref, defineProps, nextTick } from "vue";
import { useDocumentStore } from "@/stores/documentStore";
import ScanQRCode from "@/components/documents/ScanQRCode.vue";

const documentStore = useDocumentStore();
const props = defineProps({
  uploadFile: {
    type: Function,
  },
  tokenId: {
    type: String,
  },
  isUploadUsingToken: {
    type: Boolean,
  },
});

const isMobileDevice = ref(false);
const files = ref([]);
const isGridView = ref(false);
const mouseInsideInput = ref(false);
const isFileBeingDragged = ref(false);
const isDialogOpen = ref(false);
const openFileIndex = ref(-1);
const nameInputDisabled = ref(true);
const showErrorHighlight = ref(false);
const isAlertDialogOpen = ref(false);
const popupFile = ref({
  type: "",
});
const formRef = ref(null);
const uploadContainer = ref(null);
const form = ref(null);
const fileInput = ref(null);

const setDocumentType = (value) => {
  popupFile.value.documentTypeId = value;
  let documentType = documentStore.documentTypes.find((x) => x.Id === value);
  if (documentType != null) {
    if (documentType.DocumentType === "Other") {
      nameInputDisabled.value = false;
    } else {
      nameInputDisabled.value = true;
      popupFile.value.name = documentType.DefaultFileName;
    }
  }
};

const browseClicked = () => {
  fileInput.value.click();
};

const openDialog = (file, index) => {
  isDialogOpen.value = true;
  nameInputDisabled.value = true;
  openFileIndex.value = index;
  popupFile.value = {
    type: file.type,
    obj: file.obj,
    comment: file.comment,
    documentTypeId: file.documentTypeId,
    name: file.name,
    actualFileName: file.actualFileName,
  };
  nextTick(() => {
    form.value.reset();
  });
};

const getDocumentType = (documentTypeId) => {
  if (documentTypeId != null) {
    let documentTypeIndex = documentStore.documentTypes.findIndex(
      (x) => x.Id == documentTypeId
    );
    if (documentTypeIndex != -1) {
      return documentStore.documentTypes[documentTypeIndex].DocumentType;
    }
    return "";
  }
  return "";
};

const fileChanged = (e) => {
  files.value = [];
  for (var i = 0; i < e.target.files.length; i++) {
    let indexOfDot = e.target.files[i].name.lastIndexOf(".");
    files.value.push({
      actualFileName: e.target.files[i].name,
      name:
        indexOfDot == -1
          ? e.target.files[i].name
          : e.target.files[i].name.slice(0, indexOfDot),
      size: e.target.files[i].size,
      type: e.target.files[i].type,
      lastModifiedDate: e.target.files[i].lastModifiedDate,
      obj: URL.createObjectURL(e.target.files[i]),
      extension: indexOfDot == -1 ? "" : e.target.files[i].name.slice(indexOfDot),
      documentTypeId: null,
      comment: "",
    });
  }
  fileInput.value.value = "";
  mouseInsideInput.value = false;
  if (files.value.length > 0) {
    openDialog(files.value[0], 0);
  }
};

const getDataSize = (bytes) => {
  if (Math.abs(bytes) < 1024) {
    return bytes + " B";
  }

  const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  const r = 10;

  do {
    bytes /= 1024;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= 1024 && u < units.length - 1);
  return bytes.toFixed(1) + " " + units[u];
};

const getDate = (date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let exactDate = date.getDate();
  return (
    exactDate +
    (exactDate === 1 ? "st" : exactDate == 2 ? "nd" : exactDate == 3 ? "rd" : "th") +
    " " +
    monthNames[date.getMonth()] +
    " " +
    date.getFullYear()
  );
};

const removeItem = (index, e) => {
  files.value.splice(index, 1);
  e.stopPropagation();
  return false;
};

const dragOverEvent = (e) => {
  var dt = e.dataTransfer;
  if (
    dt.types &&
    (dt.types.indexOf ? dt.types.indexOf("Files") != -1 : dt.types.contains("Files"))
  ) {
    isFileBeingDragged.value = true;
    if (
      e.x > uploadContainer.value.getBoundingClientRect().left &&
      e.x < uploadContainer.value.getBoundingClientRect().right &&
      e.y > uploadContainer.value.getBoundingClientRect().top &&
      e.y < uploadContainer.value.getBoundingClientRect().bottom
    ) {
      mouseInsideInput.value = true;
    } else {
      mouseInsideInput.value = false;
    }
  } else {
    isFileBeingDragged.value = false;
  }
};

const dragLeaveEvent = () => {
  isFileBeingDragged.value = false;
};

const saveInfo = async () => {
  const isValid = form.value.validate();
  if (isValid) {
    files.value[openFileIndex.value].name = popupFile.value.name;
    files.value[openFileIndex.value].comment = popupFile.value.comment;
    files.value[openFileIndex.value].documentTypeId = popupFile.value.documentTypeId;

    await props.uploadFile(files.value[openFileIndex.value]);

    files.value.splice(0, 1);

    isDialogOpen.value = false;

    if (files.value.length !== 0) {
      await nextTick();
      setTimeout(() => {
        openDialog(files.value[0], 0);
      }, 500);
    }
  }
};

onMounted(async () => {
  if (documentStore.documentTypes?.length == 0) {
    await documentStore.getDocumentType();
  }
  const ua = navigator.userAgent;
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    isMobileDevice.value = true;
  }

  window.addEventListener("dragover", dragOverEvent);
  window.addEventListener("dragleave", dragLeaveEvent);
});
</script>
<template>
  <div class="uploadOuterContainer d-flex flex-column">
    <div class="titleText">Choose Files to Upload</div>
    <div
      class="flex-grow-1 px-5 py-5"
      :class="[
        files.length === 0 ? 'fullHeight' : '',
        isMobileDevice ? 'mobileDevice' : '',
        'uploadInnerContainer',
      ]"
    >
      <div class="uploadInputOuterContainer" ref="uploadContainer">
        <div class="d-flex flex-column flex-grow-1 inputContainer">
          <div class="flex-grow-1 mx-auto">
            <UploadDocuments />
          </div>
          <div
            v-if="!isMobileDevice"
            class="uploadText mt-3 content-black-text text-center font-weight-medium mx-auto"
          >
            <span v-if="!isFileBeingDragged">Drag & Drop your files here</span>
            <span v-else-if="!mouseInsideInput && isFileBeingDragged"
              >Drag & Drop your files over here to upload</span
            >
            <span v-else-if="mouseInsideInput && isFileBeingDragged"
              >Release the mouse to add your files</span
            >
            <span> or </span>
            <a
              class="px-0 text-decoration-underline primary-text bg-transparent cursor-pointer" 
              @click="browseClicked"
              >Browse</a
            >
          </div>
          <div class="browseMobileBtn mt-3 text-center">
            <CustomButton
              value="Browse"
              customClass="primary-button"
              @onHandleClick="browseClicked"
            />
          </div>
        </div>
        <ScanQRCode
          v-if="!isMobileDevice && !isUploadUsingToken"
          class="scanQRCodeContainer"
          :tokenId="tokenId"
        />
        <input type="file" @change="fileChanged" ref="fileInput" multiple hidden />
      </div>
    </div>
    <v-dialog v-model="isDialogOpen" max-width="550">
      <v-card>
        <v-card-title class="d-flex text-black--text grey lighten-2">
          Change Document Details
        </v-card-title>
        <v-card-text class="padding">
          <v-form ref="form" lazy-validation>
            <div class="primary-text bold font-weight-bold text-center">
              {{ popupFile.actualFileName }}
            </div>
            <SelectBox
              :sm="12"
              :value="popupFile.documentTypeId"
              :itemText="'DocumentType'"
              :itemValue="'Id'"
              :items="documentStore.documentTypes"
              placeholder="Document Type"
              isRequired
              @change="(val) => setDocumentType(val)"
            />
            <TextBox
              :sm="12"
              placeholder="File Name"
              :value="popupFile.name"
              isRequired
              :disabled="nameInputDisabled"
              @input="(e) => (popupFile.name = e.target.value)"
            />
            <TextBox
              :sm="12"
              placeholder="Comment"
              :value="popupFile.comment"
              @input="(e) => (popupFile.comment = e.target.value)"
            />
          </v-form>
        </v-card-text>
        <v-divider class="my-2"></v-divider>
        <v-row class="d-flex justify-center mt-2 mb-4 button-group">
          <CustomButton
            value="Close"
            customClass="button-no"
            :isOutlined="true"
            @onHandleClick="isDialogOpen = false"
            class="mr-2"
          />
          <CustomButton
            value="Upload"
            customClass="button-yes"
            @onHandleClick="saveInfo"
          />
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<style lang="scss" scoped>
.uploadOuterContainer {
  flex-direction: column;
  height: max-content;
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  .titleText {
    padding: 10px 0px;
    text-align: center;
    font-size: 24px;
    @media (max-width: $mobile-width) {
      margin: 0px;
      font-size: 14px;
      padding-bottom: 0px;
      padding-top: 20px;
      line-height: 20px;
    }
  }
  .uploadInnerContainer {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    &.fullHeight {
      height: 100%;
    }

    flex-direction: column;
  }
  .filesAddedContainer {
    padding: 10px;
    width: 100%;
    .addedFilesHeader {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid adjust-color(#000000, $lightness: 40%);
      margin-bottom: 10px;
    }
    .viewToggle {
      .active {
        color: #000000;
      }
      button {
        cursor: pointer;
        margin: 0px 5px;
      }
    }
    .fileInnerContainer {
      display: flex;
      flex-direction: column;
      .singleFileContainer {
        display: flex;
        flex-direction: row;
        height: 130px;
        width: 100%;
        padding: 10px;
        position: relative;
        &.redBackground {
          background-color: rgba(255, 0, 0, 0.3);
        }
        &:hover,
        &:focus {
          background-color: adjust-color(#000000, $lightness: 80%, $alpha: 0.3);
        }
        .imageContainer {
          position: relative;
          height: 100%;
          width: 130px;
          display: flex;
          justify-content: center;
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: 5px;
            box-shadow: 0px 0px 5px 1px rgba($color: #000000, $alpha: 0.2);
          }
          i {
            font-size: 82px;
            margin-left: -10px;
            margin-top: -10px;
            margin-bottom: -10px;
            margin-right: -10px;
          }
        }
        .detailsContainer {
          flex: 1;
          margin-left: 10px;
          div {
            .dataText {
              font-weight: bold;
            }
          }
          .fileType,
          .fileSize {
            font-size: 14px;
          }
          .fileName {
            width: 100%;
            display: flex;
            :not(:first-child) {
              font-weight: bold;
            }
          }
        }
        .deleteContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background: white;
          border-radius: 50%;
          padding: 5px;
          height: 34px;
          width: 34px;
          flex-shrink: 0;
          &:hover,
          &:focus {
            i {
              color: red;
            }
          }
        }
      }
      &.gridView {
        flex-flow: wrap;
        .singleFileContainer {
          flex-direction: column;
          height: auto;
          width: auto;
          align-items: center;
          justify-content: center;
          .imageContainer {
            i {
              font-size: 130px;
            }
          }
          .detailsContainer {
            margin-left: 0px;
            .fileName {
              width: 110px;
              font-weight: bold;
              font-size: 14px;
              justify-content: center;
              .ellipsedText {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 85px;
              }
              .nonellipsedText {
                width: 24px;
                flex-shrink: 0;
              }
            }
          }
          .deleteContainer {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
    }
  }
  .uploadButtonContainer {
    display: flex;
    padding: 20px 0px;
    justify-content: center;
    .uploadButton {
      height: 40px;
      width: 152px;
      min-width: 64px;
      padding: 0 16px;
      border-radius: 28px;
      margin: 0 auto;
      background: #000000;
      color: white;
      width: fit-content;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      i {
        color: white;
      }
    }
  }
}

.inputContainer {
  border-right: 1px solid $light-blue;
  padding-left: 0px;
  padding-right: 25px;
  svg,
  img {
    width: 100%;
    max-width: 220px;
    height: 100%;
    max-height: 220px;
  }
}

.scanQRCodeContainer {
  padding-left: 25px;
  padding-right: 0px;
}

.uploadInputOuterContainer {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  border: 2px dashed $light-blue;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  padding: 40px 25px;
  .uploadText {
    max-width: 220px;
    @media (max-width: $tablet-width) {
      display: none;
    }
  }
  @media (max-width: 550px) {
    display: block;
    .inputContainer {
      border-right: 0px;
      border-bottom: 1px solid $light-blue;
      padding-right: 0px;
      padding-bottom: 20px;
    }
    .scanOuterContainer {
      padding-left: 0px;
      padding-top: 20px;
    }
  }
  .browseMobileBtn {
    display: none;
    min-height: 38px;
    @media (max-width: $tablet-width) {
      display: block;
    }
  }
}

.lighten-2 {
  background: $primary;
  color: $white;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center;
  button {
    background: transparent !important;
    color: $white;
  }
}

.padding {
  padding: 16px 24px 16px !important;
}
:deep(.button-group) {
  flex-wrap: wrap !important;
  gap: 10px !important;
  .button-yes {
    background: $primary !important;
  }
  .button-no {
    .v-btn__content {
      color: $primary !important;
    }
  }
}
:deep(.v-select .v-field .v-field__input > input) {
  align-self: center;
}
</style>
