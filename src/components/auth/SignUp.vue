<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify';
import config from "@/configs";

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const signupData = ref({
  firstName: '',
  lastName: '',
  emailAddress: '',
  userName: '',
  password: '',
  applicationId: config.applicationId,
  campaignId: '',
  campaignType: 0
})
const isShow = ref(false)

const setDefaultsFormQuery = () => {
  const { applicationId, firstName, lastName, email, userName, campaignId, campaignType } =
    route.query

  signupData.value.applicationId = applicationId || 2
  signupData.value.firstName = firstName || ""
  signupData.value.lastName = lastName || ''
  signupData.value.emailAddress = email || ''
  signupData.value.userName = userName || ''
  signupData.value.campaignId = campaignId || ''
  signupData.value.campaignType = campaignType || 0
}

setDefaultsFormQuery();

const emailRegex = ref(
  /[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/
)
const isDisabled = computed(() => {
  return (
    !signupData.value.firstName ||
    !signupData.value.lastName ||
    !signupData.value.userName ||
    !signupData.value.emailAddress ||
    !emailRegex.value.test(signupData.value.emailAddress) ||
    signupData.value.password.length < 8
  )
})

const signUp = async () => {
  await userStore.signUpAccount(signupData.value).then((res)=>{
    if(res.status === 200){
      toast.success("Congratulations! You have successfully registered.");
      setTimeout(()=>{
        router.push("/sign-in");
      }, 2000)
    }
    else{
      toast.error("Internal Server Error.");
    }
  });
}
</script>

<template>
  <form
    class="loginForm"
  >
    <h1 class="title text-center">Account Signup</h1>
    <h4 class="subtitle gray3-text text-center">Please enter your information</h4>
    <TextBox
      :smVal="12"
      class="px-0"
      :value="signupData.firstName"
      placeholder="First Name"
      :isRequired="true"
      @onChange="(val) => (signupData.firstName = val)"
      :isFixedTitle="false"
    ></TextBox>
    <TextBox
      :smVal="12"
      class="px-0"
      :value="signupData.lastName"
      placeholder="Last Name"
      :isRequired="true"
      @onChange="(val) => (signupData.lastName = val)"
      :isFixedTitle="false"
    ></TextBox>
    <TextBox
      :smVal="12"
      class="px-0"
      :value="signupData.emailAddress"
      placeholder="Email"
      :isRequired="true"
      @onChange="(val) => (signupData.emailAddress = val)"
      :isFixedTitle="false"
    ></TextBox>
    <TextBox
      :smVal="12"
      class="px-0"
      :value="signupData.userName"
      placeholder="Username"
      :isRequired="true"
      @onChange="(val) => (signupData.userName = val)"
      :isFixedTitle="false"
    ></TextBox>
    <TextBox
      :smVal="12"
      :type="isShow ? 'text' : 'password'"
      :value="signupData.password"
      placeholder="Create password"
      :appendIcon="isShow ? 'mdi-eye' : 'mdi-eye-off'"
      @onIconClick="isShow = !isShow"
      :isRequired="true"
      @onChange="(val) => (signupData.password = val)"
      hint="Minimum length is 8 characters"
      class="eye-icon px-0"
      :isFixedTitle="false"
    ></TextBox>
    <CustomButton
      btnType="submit"
      :isDisabled="isDisabled"
      value="Sign Up"
      width="100%"
      height="45px"
      customClass="primary-button"
      @onHandleClick="signUp"
    ></CustomButton>
    <div class="form-link d-flex flex-column justify-center align-center mt-5">
      <div class="gray2-text">
        Have an account?
        <router-link
          class="link primary-text"
          to="/sign-in"
          >Log in</router-link
        >
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.eye-icon {
  position: relative;
}
:deep(.eye-icon .v-input__append) {
  position: absolute;
  right: 12px;
  top: 21px;
}
:deep(.primary-button ){
  background: $primary !important;
}
</style>
