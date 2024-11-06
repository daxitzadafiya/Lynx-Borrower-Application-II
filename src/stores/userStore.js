import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loginRequest } from '@/api/signIn'
import { registerRequest } from "@/api/register"
import { recoverPassRequest, resetPassRequest } from "@/api/recoverPassword"; 
import { toast } from 'vue3-toastify';
import { useGeneralStore } from './generalStore';
import { useBrandingStore } from './brandingStore'
import { useRouter } from 'vue-router';

export const useUserStore = defineStore('userStore', () => {
  const currentUser = ref(null)
  const router = useRouter()
  const brandingStore = useBrandingStore()
  const bearerToken = computed(() => {
    return currentUser.token
  })

  const isAuthenticated = computed(() => {
    return true
  })

  const saveUserInfo = async (userInfo) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo))
    currentUser.value = userInfo
  }

  const logIn = async (user) => {
    try {
      const response = await loginRequest(user)
      localStorage.setItem("borrowerToken", response?.token ?? "");
      await saveUserInfo(response);
      await useGeneralStore().getLoanById(currentUser.value?.keyIdentifier || '')
    } catch (error) {
      throw (
        error.response.data.Message || 'An error occurred while trying to login. Please try again.'
      )
    }
  }

  const signUpAccount = async (payload) => {
    try {
      const response = await registerRequest(payload);
      return response;
    } catch (err) {
      toast.error("An error occurred while trying to registration. Please try again.");
    }
  };

  const logOut = async () => {
    try {
      if(brandingStore.isHostedMode){
        parent.postMessage({ expired: true }, "*");s
      }
      localStorage.removeItem("borrowerToken");
      currentUser.value = null;
      useGeneralStore().setInitialData(null)
      window.location.href = "/sign-in";
    } catch (err) {
      console.log(err);
    }
  };

  const recoverPass = async (payload) => {
    try {
      const response = await recoverPassRequest(payload);
      return response;
    } catch (err) {
        return err.response;
    }
  };

  const getCurrentUser = () => {
    return currentUser.value;
  }

  const resetPass = async (payload) => {
    try {
      await resetPassRequest(payload);
      router.push("/login");
    } catch (err) {
      toast.error("An error occurred while reset password. Please try again.");
    }
  }

  return { currentUser, isAuthenticated, bearerToken, logIn, signUpAccount, recoverPass, logOut, getCurrentUser, saveUserInfo, resetPass }
})
