<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useGeneralStore } from "@/stores/generalStore";
import { useDocumentStore } from "@/stores/documentStore";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import config from "@/configs";

import moment from "moment";

const generalStore = useGeneralStore();
const documentStore = useDocumentStore();
const router = useRouter();

const props = defineProps({
  tokenId: {
    type: String,
  },
  loanId: {
    type: Number,
  },
  isUploadUsingToken: {
    type: Boolean,
  },
});

const editIcon = ref("");
const deleteIcon = ref("");
let imageList = await Promise.all([
  import("@/assets/images/edit.svg"),
  import("@/assets/images/delete.svg"),
]);
editIcon.value = imageList[0].default;
deleteIcon.value = imageList[1].default;

const headers = ref([
  {
    title: "Document",
    key: "FileName",
  },
  {
    title: "Date/Time",
    key: "formattedDate",
  },
  {
    title: "Size",
    key: "FileSizeInKB",
  },
  {
    title: "Comment",
    key: "Comments",
  },
  {
    title: "Status",
    key: "IsUploaded",
  },
  {
    title: "Action",
    key: "Action",
  },
]);

const documentList = ref([]);
const selectedDocumentIndex = ref(-1);
const deletePopupActive = ref(false);
const unmountModalActive = ref(false);
const documentsLoadIntervalObj = ref(null);

const navigateToReview = async () => {
  if (props.isUploadUsingToken) {
    // this.$parent.$parent.OnFilesUploadedSuccessfully()
  } else {
    await router.push("/review/");
  }
};

const tryNavigating = async () => {
  if (documentList.value.findIndex((x) => x.Id == null) != -1) {
    unmountModalActive.value = true;
  } else {
    await navigateToReview();
  }
};

const getFormattedName = (item) => {
  if (item == null) return "";
  if (documentStore.documentTypes.length == 0) return item.FileName;
  let documentType = documentStore.documentTypes.find(
    (x) => x.Id === item.DocumentTypeId
  );
  if (documentType == null || documentType.DocumentType === "Other") {
    return item.FileName;
  } else {
    return documentType.DocumentType;
  }
};

const addFile = async (file) => {
  file.isUploaded = false;
  file.UploadedDate = new Date();
  file.FileName = file.name;
  file.Comments = file.comment;
  file.DocumentTypeId = file.documentTypeId;
  file.formattedDate = moment(file.UploadedDate).format("MMMM DD, YYYY hh:mm:ss A");
  file.FileSizeInKB = parseInt(file.size / 1000);
  file.progressPercent = 0;

  const formData = new FormData();
  formData.append(
    "files[]",
    await fetch(file.obj).then((r) => r.blob()),
    `${file.name}${file.extension}`
  );

  let data = [
    {
      FileName: file.FileName,
      DocumentTypeId: file.DocumentTypeId,
      Comments: file.Comments,
    },
  ];

  formData.append("data", JSON.stringify(data));
  const curFileGUID = createUUID();
  file.GUID = curFileGUID;

  const fileIndex = documentList.value.push(file) - 1;

  documentList.value[fileIndex].uploadObj = documentStore.uploadDocuments({
    data: formData,
    tokenId: generalStore.currentLoan.value == null ? props.tokenId : null,
    loanId:
      generalStore.currentLoan.value == null ? null : generalStore.currentLoan.value.Id,
    progressEvent: (progressEvent) => {
      let fileIndexFromGUID = documentList.value.findIndex((x) => x.GUID === curFileGUID);
      documentList.value[fileIndexFromGUID].progressPercent = Math.min(
        Math.round((progressEvent.loaded * 100) / progressEvent.total),
        99
      );
    },
  });

  documentList.value[fileIndex].uploadObj
    .then((response) => {
      let fileIndexFromGUID = documentList.value.findIndex((x) => x.GUID === curFileGUID);
      if (documentList.value.findIndex((x) => x.Id === response[0].Id) === -1) {
        let newDocument = {
          formattedDate: moment(response[0].UploadedDate).format(
            "MMMM DD, YYYY hh:mm:ss A"
          ),
          IsUploaded: true,
          Comments: response[0].Comments,
          DocumentTypeId: response[0].DocumentTypeId,
          FileExtension: response[0].FileExtension,
          FileName: response[0].FileName,
          FileSizeInKB: response[0].FileSizeInKB,
          Id: response[0].Id,
          LoanId: response[0].LoanId,
          UploadedDate: response[0].UploadedDate,
          FileUploadCompleted: response[0].FileUploadCompleted,
        };
        documentList.value.splice(fileIndexFromGUID, 1, newDocument);
      } else {
        documentList.value.splice(fileIndexFromGUID, 1);
      }
    })
    .catch((error) => {
      toast.error(`Could not upload file ${documentList.value[fileIndex].FileName}`);
      documentList.value[fileIndex].errorUploading = true;
    });
};

const bytesToSize = (bytes) => {
  var sizes = ["KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

const downloadFile = async (documentId) => {
  let blob = await documentStore.getFiles(documentId);
  let url = URL.createObjectURL(blob);
  var a = window.document.createElement("a");
  a.setAttribute("target", "_blank");
  a.style = "display: none";
  window.document.body.appendChild(a);
  a.href = url;
  let document = documentList.value.find((x) => x.Id == documentId);
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    window.document.body.removeChild(a);
  }, 1000);
};

const createUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const tryLoadDocuments = async () => {
  if (generalStore.currentLoan != null && generalStore.currentLoan.Id != null) {
    if (documentsLoadIntervalObj.value == null) {
      documentsLoadIntervalObj.value = setInterval(
        tryLoadDocuments,
        config.filesPollingInterval ? config.filesPollingInterval : 5000
      );
    }
    let lastDocument = null;
    if (documentList.value != null && documentList.value.length > 0) {
      lastDocument = documentList.value.reduce((doc1, doc2) =>
        doc1.Id != null && doc1.Id < doc2.Id ? doc2 : doc1
      );
    }
    await documentStore
      .getDocument({
        loanId: generalStore.currentLoan.Id,
        lastDocumentId: lastDocument != null ? lastDocument.Id : null,
      })
      .then((res) => {
        mergeDocumentList(res);
      })
      .catch((err) => {
        clearInterval(documentsLoadIntervalObj.value);
      });
  }
};

const mergeDocumentList = (newDocumentList) => {
  newDocumentList.forEach((document) => {
    if (
      document.StatusId == 1 &&
      documentList.value.findIndex((x) => x.Id === document.Id) === -1
    ) {
      document.IsUploaded = true;
      document.formattedDate = moment(document.UploadedDate).format(
        "MMMM DD, YYYY hh:mm:ss A"
      );
      documentList.value.push(document);
    }
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

const showDeletePopup = (item) => {
  selectedDocumentIndex.value = documentList.value.findIndex((x) => x.Id === item.Id);
  deletePopupActive.value = true;
};

const deleteFile = async (Id) => {
  try {
    await documentStore.deleteDocuments(Id);
    documentList.value.splice(this.selectedDocumentIndex, 1);
    selectedDocumentIndex.value = -1;
  } catch (error) {
    toast.error(`Could not delete the file.`);
  }
};

const preventNav = (event) => {
  if (documentList.value.findIndex((x) => x.Id == null) != -1) {
    event.preventDefault();
    event.returnValue = "Some files are not uploaded completely. Please wait.";
  }
};
onMounted(() => {
  if (!props.isUploadUsingToken) {
    tryLoadDocuments();
  }
});

onBeforeMount(() => {
  window.addEventListener("beforeunload", preventNav);
});

onBeforeUnmount(() => {
  clearInterval(documentsLoadIntervalObj);
  window.removeEventListener("beforeunload", preventNav);
});

watch(
  generalStore.currentLoan,
  async (newVal) => {
    if (!props.isUploadUsingToken) {
      await tryLoadDocuments();
    }
  },
  { deep: true }
);

defineExpose({
  addFile,
  tryNavigating,
});
</script>
<template>
  <div
    class="outerContainer"
    v-if="documentList.length > 0"
    :style="isUploadUsingToken ? 'margin: 0 auto;' : ''"
  >
    <div class="innerContainer">
      <div class="documentList mb-3">
        <v-data-table
          class="content-table tripleActions elevation-1"
          :headers="headers"
          :items="documentList"
          style="width: 100%"
          :hide-default-footer="true"
          :sort-by="['UploadedDate']"
          :sort-desc="[true]"
        >
          <template v-slot:[`item.FileSizeInKB`]="{ item }">
            <span class="mw-220">{{ bytesToSize(item.FileSizeInKB) }}</span>
          </template>

          <template v-slot:[`item.FileName`]="{ item }">
            <span class="mw-220">{{ getFormattedName(item) }}</span>
          </template>

          <template v-slot:[`item.IsUploaded`]="{ item }">
            <v-progress-linear
              :model-value="item.progressPercent"
              height="25"
              v-if="!item.IsUploaded && !item.errorUploading"
            >
              <template v-slot:default="{ value }">
                <strong style="color: white">{{ Math.ceil(value) + "%" }}</strong>
              </template>
            </v-progress-linear>
            <div
              class="red--text font-weight-bold danger"
              v-else-if="item.errorUploading"
            >
              Error
            </div>
            <div class="d-flex" v-else>
              <span>Complete</span>
            </div>
          </template>

          <template v-slot:[`item.Action`]="{ item }">
            <div class="d-flex actionsContainer">
              <v-btn
                icon
                small
                @click="downloadFile(item.Id)"
                :disabled="!item.IsUploaded"
                class="downloadIcon"
                :elevation="0"
              >
                <v-icon>mdi-file-document-outline</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                @click="editItem(item)"
                :disabled="!item.IsUploaded"
                class="editIcon"
                :elevation="0"
              >
                <inline-svg :src="editIcon"></inline-svg>
              </v-btn>
              <v-btn
                icon
                small
                @click="showDeletePopup(item)"
                :disabled="!item.IsUploaded"
                class="deleteIcon"
                :elevation="0"
              >
                <inline-svg :src="deleteIcon"></inline-svg>
              </v-btn>
            </div>
          </template>
        </v-data-table>
        <div v-if="false">
          <div
            v-for="(document, index) in documentList"
            :key="index"
            :class="
              index === selectedDocumentIndex
                ? 'selected singleDocument'
                : 'singleDocument'
            "
            @click="
              selectedDocumentIndex = index;
              isDialogOpen = true;
            "
          >
            <div class="imageSection">
              <img :src="document.fileURL" v-if="document.isImage" />
              <v-icon v-if="!document.isImage">description</v-icon>
            </div>
            <div class="textSection">
              <div class="fileName">{{ document.FileName }}</div>
              <div class="fileExtension">{{ document.FileExtension }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="deletePopupActive" width="500">
      <v-card style="background: white">
        <v-card-title class="text-h5 grey lighten-2">Delete File?</v-card-title>
        <v-card-text class="delete-card-text">
          Are you sure you want to delete
          {{ getFormattedName(documentList[selectedDocumentIndex]) }}?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <CustomButton
            value="Cancel"
            customClass="button-no"
            isOutlined
            @onHandleClick="deletePopupActive = false"
            class="mr-2"
          />
          <CustomButton
            value="Delete"
            customClass="primary-button"
            @onHandleClick="
              deletePopupActive = false;
              deleteFile(documentList[selectedDocumentIndex].Id);
            "
          />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="unmountModalActive" width="500">
      <v-card style="background: white">
        <v-card-title class="text-h5 grey lighten-2">Alert</v-card-title>
        <v-card-text class="alert-card-text">
          Some files are not uploaded completely. Please wait.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <CustomButton
            value="Close"
            customClass="primary-button"
            @onHandleClick="unmountModalActive = false"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style lang="scss" scoped>
.iconButton {
  margin: 5px;
  border-radius: 50%;
  margin-top: 12px;
  min-width: unset !important;
  width: 36px;
}
.largeIcon {
  font-size: 48px;
}
:deep(.v-dialog) {
  max-height: unset !important;
}
.vuePdf {
  width: 100%;
  height: 100%;
}
.dialogBody {
  position: relative;
  width: 100%;
  height: calc(100vh - 110px);
  display: block;
  .dialogBodyInner {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      width: 100%;
      height: 100%;
    }
  }
}
.dialogImage {
  max-width: 100%;
  max-height: 100%;
}
.parentWidth {
  width: 100%;
}
.outerContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  width: 100%;
  .innerContainer {
    width: 100%;
    .documentList {
      width: 100%;
      display: flex;
      .singleDocument {
        width: 100px;
        height: 135px;
        margin: 5px;
        padding: 5px;
        &:hover,
        &:focus {
          background: adjust-color(#000000, $lightness: 80%);
        }
        &.selected {
          background: adjust-color($tile-selected-outline-color, $lightness: 40%);
        }
        .imageSection {
          height: 100px;
          display: flex;
          justify-content: center;
          overflow: hidden;
          img {
            display: inline-block;
            max-width: 100px;
            max-height: 100px;
            height: auto;
            width: auto;
          }
          i {
            font-size: 82px;
          }
        }
        .textSection {
          padding-top: 5px;
          display: flex;
          width: 100px;
          font-size: 14px;
          justify-content: center;
          .fileName {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 60px;
          }
          .fileExtension {
            width: 40px;
            flex-shrink: 0;
          }
        }
      }
    }
    .selectedDocumentInfo {
      width: 50vw;
      border-left: 1px solid adjust-color(#000000, $lightness: 80%);
      padding: 5px;
      .header {
        display: flex;
        i {
          padding-right: 10px;
        }
      }
      .documentImage {
        img {
          width: 100%;
          padding: 10px 0px;
        }
        i {
          font-size: 82px;
          padding: 10px 0px;
        }
      }
    }
  }
}
:deep(.secondary-button) {
  background: $red !important;
  margin-top: 5px;
}

.content-table {
  :deep(table) {
    min-width: 700px;
  }
}
.editIcon {
  height: 28px !important;
  width: 28px !important;
  :deep(path) {
    fill: $icon-color;
  }
}
.deleteIcon,
.downloadIcon {
  height: 28px !important;
  width: 28px !important;
}
:deep(.v-table--density-default) {
  --v-table-header-height: 49px !important;
  --v-table-row-height: 48px !important;
}
:deep(.v-data-table-header__content) {
  display: block;
  span{
    font-size: 12px !important;
  }
}
:deep(.v-table > .v-table__wrapper > table > thead > tr th:nth-child(6)::after) {
  color: $table-header-text-color !important;
  font-size: 12px !important;
}


:deep(.content-table.tripleActions
    tbody
    tr:not(.v-data-table__empty-wrapper)
    > :nth-last-child(2)::after) {
  background: $lightBlue2 !important;
}
:deep(.content-table.tripleActions
    tbody
    tr:not(.v-data-table__empty-wrapper)
    > :last-child) {
  background: $lightBlue2 !important;
}

:deep(.v-table > .v-table__wrapper > table > tbody > tr td:last-child) {
  border-bottom: 1px solid transparent;
}
:deep(.v-table__wrapper ){
  th{
    min-width: 110px !important;
    &:nth-child(2){
      min-width: 200px !important;
    }
  }
}
:deep(.v-btn__overlay) {
  display: none !important;
}

:deep(.red--text) {
  color: $red !important;
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
.delete-card-text, .alert-card-text{
  padding: 20px 24px !important;
}
</style>
