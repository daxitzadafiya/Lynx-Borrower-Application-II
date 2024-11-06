<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import config from '@/configs'
import { toast } from 'vue3-toastify';

const router = useRouter()
const userStore = useUserStore()
const isDisabled = ref(false)
const isRemember = ref(false)


const loginForm = ref({
  userName: '',
  password: '',
  applicationId: config.applicationId
})

const toggle = (value) => {
  isRemember.value = value
}
const errorMessage = ref(null)

const logIn = async () => {;
  errorMessage.value = null
  try {
    isDisabled.value = true
    await userStore.logIn(loginForm.value)
  } catch (error) {
    errorMessage.value = error
  } finally {
    isDisabled.value = false
  }
  if (!errorMessage.value) {
    // toast.success('Welcome back! You have successfully logged in.'); 
    // setTimeout(()=>{
      router.push('/borrowers')
    // },2000)
  }
  else {
    toast.error("Internal Server Error.");
  }
};
</script>
<template>
  <h1 class="title">Please enter your login details</h1>
  <br> 
  <div
    class="error-message"
    v-if="errorMessage"
  >
    {{ errorMessage }}
  </div>
  <v-form>
    <TextBox
      class="px-0"
      :smVal="12"
      :value="loginForm.userName"
      placeholder="Email/Username"
      :isRequired="true"
      @onChange="(val) => loginForm.userName = val"
      :isFixedTitle="false"
    ></TextBox>
    <TextBox
      :smVal="12"
      class="px-0"
      type="password"
      :value="loginForm.password"
      placeholder="Password"
      :isRequired="true"
      @onChange="(val) => loginForm.password = val"
      :isFixedTitle="false"
    ></TextBox>
    <v-row
      class="mr-0 mt-0"
      justify="space-between"
      align="center"
    >
      <div class="d-flex align-center">
        <CheckBox
          :isChecked="isRemember"
          label="Remember me"
          @toggle="toggle"
          hide-details
        ></CheckBox>
      </div>
      <RouterLink to="/recover-password">Forgot password?</RouterLink>
    </v-row>
    <CustomButton
      :isDisabled="isDisabled"
      :value="isDisabled ? 'Please wait' : 'Login'"
      width="100%"
      height="45px"
      :customClass="isDisabled ? 'default-button' : 'primary-button'"
      @onHandleClick="logIn"
    ></CustomButton>
  </v-form>
  <div class="bottom-info">
    Need an account?
    <RouterLink to="/sign-up">Sign up</RouterLink>
  </div>
</template>

<style lang="scss" scoped>
:deep(.form-wrapper .v-row) {
  margin-top: 4px !important;
}
:deep(.v-checkbox ) {
  margin-bottom: 0px !important;
  .v-selection-control{
    color: $primary !important;
    margin-left: 0px;
    .v-label{
      font-size: 16px;
    }
  }
}
:deep(.primary-button ){
  background: $primary !important;
}
</style>
