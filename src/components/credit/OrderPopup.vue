<script setup>
import { computed } from "vue";
import { useCreditStore } from "@/stores/creditStore";
import { useGeneralStore } from "@/stores/generalStore";

const creditStore = useCreditStore();
const generalStore = useGeneralStore();

const isShowModal = computed({
  get: () => creditStore.isVisible,
  set: (val) => {
    creditStore.isModalVisible = val;
  },
});

const onHandleClose = () => {
  creditStore.onToggle(false);
  generalStore.toggleIsOnlay({
    isOnlay: false,
  });
};

const closeAndSendOrder = async () => {
  creditStore.onToggle(false);
  generalStore.toggleIsOnlay({
    isOnlay: false,
  });
  creditStore.sendOrderRequest()
};

const isModelVisible = computed({
  get: () => isShowModal.value && generalStore.onlayComponent == "order",
  set: (val) => {
    creditStore.isModalVisible = val;
  },
});
</script>
<template>
  <v-dialog v-model="isModelVisible" activator="parent" max-width="350" persistent>
    <template v-slot:default="{}">
      <v-card  light max-width="350px">
        <v-card-title class="dialog-header-back dialog-header-text">
          <span class="">Order confirmation</span>
        </v-card-title>
        <v-card-text class=" text-black--text">
          <div class="">
            Please confirm that you are ready to order your credit report.
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-row class="justify-space-around mx-0 py-6 px-5 gap">
          <CustomButton value="Yes" customClass="primary-button" @onHandleClick="closeAndSendOrder()"></CustomButton>
          <CustomButton
            value="No"
            :isOutlined="true"
            customClass="button-no"
            @onHandleClick="onHandleClose()"
          ></CustomButton>
        </v-row>
      </v-card>
    </template>
  </v-dialog>
</template>
<style lang="scss" scoped>
:deep(.v-card-actions) {
  padding: 5px !important;
}
.gap{
    gap: 6px;
}
:deep(.v-row) {
  margin: 0 !important;
}
:deep(.v-card-text){
    padding: 30px !important;
    font-size: 20px !important;
    text-align: center !important;
    letter-spacing: normal !important;
    line-height: 22px !important;
}
:deep(.dialog-header-back){
    padding: 10px 20px 10px 30px !important;
}
</style>
