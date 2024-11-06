<script setup>
import { reactive, ref, computed } from 'vue'
import { phone } from '@/mixins/phoneFormat'
import { number } from '@/mixins/onlyNum'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router'
import config from "@/configs";

const router = useRouter()
const isRequestSent= ref(false);
const userStore = useUserStore()
const recoverData = ref({
  applicationId: config.applicationId,
  emailAddress: '',
  cellPhoneNumber: ''
})

const { isOnlyNum } = number();
const { getFormattedPhone } = phone();


const validatePhone = (e) => {
  const target = e.target;
  if (target.value.length === 14 && e.keyCode !== 13) {
    e.preventDefault()
    return false
  }
  return isOnlyNum(e)
}

const onHandleRecoverPassword = () => {
  try {
        userStore.recoverPass(recoverData.value).then((res)=>{
          if(res.status === 200){
            toast.success('Password recovery link sent to your email');
            isRequestSent.value = !isRequestSent.value;
          }
          else if(res.status === 401){
            toast.error('User not found');
            setTimeout(()=>{
              router.push('/sign-in')
            },3000);
          }
          else if(res.status === 500){
            toast.error('Internal server error');
          }
        });
      } catch (err) {
        console.log("err---->",err);
      }
};
const emailRegex = reactive(/[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])[2,]?/);

const isDisabled = computed(() => {
  return (
    !recoverData.value.emailAddress ||
    !emailRegex.test(recoverData.value.emailAddress) ||
    !recoverData.value.cellPhoneNumber
  );
});

</script>
<template>
  <form class="loginForm">
    <h1 class="title text-center">Recover Password</h1>
    <template v-if="!isRequestSent">
      <v-row class="mx-0 mt-5">
        <TextBox
          :smVal="12"
          placeholder="Email"
          :isRequired="true"
          :value="recoverData.emailAddress"
          @onChange="(val) => (recoverData.emailAddress = val)"
          :isFixedTitle="false"
        ></TextBox>
      </v-row>
      <v-row class="mx-0 mt-3">
        <TextBox
          :smVal="12" 
          placeholder="Cell Phone"
          :isRequired="true"
          type="tel"
          :value="getFormattedPhone(recoverData.cellPhoneNumber)"
          @input="(e) => (recoverData.cellPhoneNumber = e.target.value ? e.target.value.replace(/[()]|-| /g, '') : '')"
          @keypress="(e) => validatePhone(e)"
          :isFixedTitle="false"
        ></TextBox>
      </v-row>
      <div class="submit-button pb-3">
        <CustomButton
          btnType="submit"
          :isDisabled="isDisabled"
          value="Recover Password"
          width="100%"
          height="45px"
          customClass="primary-button"
          @onHandleClick="onHandleRecoverPassword"
        ></CustomButton>
      </div>
    </template>
    <template
      v-else
    >
      <v-card-text class="text-center px-0"
        >Your request to recover your password was successfully processed. Please check your email
        to continue the recovery process.</v-card-text
      >
    </template>
  </form>
</template>
<style lang="scss" scoped>
:deep(.primary-button ){
  background: $primary !important;
}
</style>