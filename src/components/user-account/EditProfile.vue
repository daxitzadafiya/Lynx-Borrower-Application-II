<script setup>
import { computed, ref } from 'vue'
import { useUpdateProfileStore } from '@/stores/updateProfileStore'
import { phone } from '@/mixins/phoneFormat'
import { number } from '@/mixins/onlyNum'
import { useUserStore } from '@/stores/userStore'
import config from "@/configs";

const updateProfileStore = useUpdateProfileStore()

const { isOnlyNum } = number()
const { getFormattedPhone } = phone()

const userStore = useUserStore();

const user = ref(userStore.currentUser || JSON.parse(localStorage.getItem("userInfo")));

const onHandleClose = () => {
  updateProfileStore.onToggle(false)
}

const validatePhone = (e) => {
  if (e.target.value.length === 14 && e.keyCode !== 13) {
    e.preventDefault()
    return false
  }
  return isOnlyNum(e)
}

const versionText = computed(() => {
      return "(v" + config.versionNumber + ")";
    });

const isShowModal = computed({
  get: () => updateProfileStore.isVisible,
  set: (val) => {
    updateProfileStore.isModalVisible = val;
  }
});

</script>
<template>
  <v-dialog
    v-model="isShowModal"
    activator="parent"
    max-width="704"
    persistent
  >
    <template v-slot:default="{ }">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center popup__title">
          <span class="popup__title-text">Profile {{ versionText }}</span>

          <v-btn
            icon="mdi-close"
            variant="text"
            class="popup__close_icon"
            @click="onHandleClose"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="text-block text-black--text">
          <v-row class="text-block__row my-0 px-4">         
              <TextBox
                :value="user.firstName"
                placeholder="First Name"
                :isRequired="true"
                @onChange="(val) => (user.firstName = val)"
              ></TextBox>
              <TextBox
                :value="user.lastName"
                placeholder="Last Name"
                :isRequired="true"
                @onChange="(val) => (user.lastName = val)"
              ></TextBox>
              <TextBox
                :value="user.emailAddress"
                placeholder="Email"
                :isRequired="true"
                :isEmail="true"
                @onChange="(val) => (user.emailAddress = val)"
              ></TextBox>
              <TextBox
                :value="getFormattedPhone(user.phoneNumber)"
                placeholder="Cell Phone"
                :isRequired="true"
                @onChange="(val) => (user.phoneNumber = val)"
                @keypress="(val) => validatePhone(val)"
              ></TextBox>
          </v-row>
        </v-card-text>

        <v-divider class="mt-2"></v-divider>
        <div class="d-flex justify-center popup__buttons">
          <CustomButton
            value="Save"
            customClass="primary-button"
            @onHandleClick="onHandleClose"
          />
          <CustomButton
            class="ml-4"
            value="Cancel"
            isOutlined
            @onHandleClick="onHandleClose"
          />
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<style lang="scss" scoped>
.eye-icon {
  position: relative;
}
:deep(.eye-icon .v-input__append) {
  position: absolute;
  right: 12px;
  top: 23px;
}
.popup__title {
  background-color: $primary;
}
.popup__title-text,
.popup__close_icon {
  color: $white;
}
.popup__buttons {
  width: 100%;
  padding: 15px 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
:deep(.v-card-text){
  padding-bottom: 0px !important;
}
</style>