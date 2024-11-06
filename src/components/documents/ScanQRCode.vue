<script setup>
import QrcodeVue from "qrcode.vue";
import { computed, defineProps } from "vue";

const props = defineProps({
  tokenId: {
    type: String,
  },
});

const value = computed(() => {
  return window.location.origin + "?tokenId=" + props.tokenId;
});
</script>

<template>
  <div class="scanOuterContainer">
    <div class="d-flex scanInnerContainer">
      <div class="qr-box">
        <qrcode-vue
          :value="value"
          :size="150"
          class="flex-grow-1 d-flex align-center"
        ></qrcode-vue>
      </div>
      <div class="content-black-text font-weight-medium mt-3">
        Scan the QR code to upload with your mobile device
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scanOuterContainer {
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  .scanInnerContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // flex: 1;
    text-align: center;
    color: $text-black;
    font-weight: 600;
  }
}

.content-black-text {
  max-width: 220px;
}

.qr-box {
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3px;
}

@media (max-width: $mobile-width) {
  .qr-box {
    margin-bottom: 0px;
  }
}
</style>
