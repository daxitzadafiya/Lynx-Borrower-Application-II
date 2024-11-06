<script setup>
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { useChangePasswordStore } from '@/stores/changePasswordStore';
import config from '@/configs' 

const password = ref('')
const passwordCopy = ref('')
const isShowPassword = ref(false)
const isShowPasswordCopy = ref(false)
const changePasswordStore = useChangePasswordStore();

const onHandleClose= ()=> {
    changePasswordStore.onToggle(false);
}

const check = async() => {
  if (password.value !== passwordCopy.value) {
    toast.error('Password and Password Copy should match!')
  } else if(password.value === "") {
    toast.error('Password is required!')
  } else {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const payload = {
      username: userInfo.userName,
      password: password.value,
      applicationId: config.applicationId
    }
    changePasswordStore.changeUserPassword(payload).then((res)=>{
      if(res.status === 200){
        toast.success('Password Changed Successfully!');
      }
    })
    onHandleClose();
  }
}

const isShowModal = computed({
  get: () => changePasswordStore.isVisible,
  set: (val) => {
    changePasswordStore.isModalVisible = val;
  }
});
</script>

<template>
    <v-dialog
      v-model="isShowModal"
      activator="parent"
      max-width="350"
      persistent
    >
      <template v-slot:default="{ }">
        <v-card rounded="lg">
          <v-card-title class="d-flex justify-space-between align-center popup__title">
            <span class="popup__title-text">Password Change</span>

            <v-btn
              icon="mdi-close"
              variant="text"
              class="popup__close_icon"
              @click="onHandleClose"
            ></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="text-block text-black--text">
            <v-row class="text-block__row">
              <TextBox
                :smVal="12"
                :type="isShowPassword ? 'text' : 'password'"
                :value="password"
                placeholder="New password"
                :isRequired="true"
                :isPassword="true"
                hint="Minimum length is 8 characters"
                class="eye-icon px-0"
                :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @onIconClick="isShowPassword = !isShowPassword"
                @onChange="(val) => (password = val)"
              ></TextBox>
              <TextBox
                :smVal="12"
                :type="isShowPasswordCopy ? 'text' : 'password'"
                :value="passwordCopy"
                placeholder="New password copy"
                :isRequired="true"
                :isPassword="true"
                :append-icon="isShowPasswordCopy ? 'mdi-eye' : 'mdi-eye-off'"
                hint="Minimum length is 8 characters"
                class="eye-icon px-0"
                @onIconClick="isShowPasswordCopy = !isShowPasswordCopy"
                @onChange="(val) => (passwordCopy = val)"
              ></TextBox>
            </v-row>
          </v-card-text>

          <v-divider class="mt-2"></v-divider>
          <div class="d-flex justify-center popup__buttons">
            <CustomButton
              value="Save"
              customClass="primary-button"
              @onHandleClick="check"
            />
            <CustomButton
              class="ml-4"
              value="Cancel"
              @onHandleClick="onHandleClose"
              isOutlined
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
  right: 15px;
  top: 21px;
}
.popup__title{
    background-color: $primary;
}
.popup__title-text,.popup__close_icon{
    color: $white;
}
.popup__buttons{
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
  padding-bottom: 15px !important;
}

</style>
