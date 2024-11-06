import axios from 'axios'
import config from '@/configs'
import { useGeneralStore } from "@/stores/generalStore";
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

const axiosInstance = axios.create({
  baseURL: config.apiPath,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const baseURL = axios.defaults.baseURL || window.location.origin;
    const fullURL = new URL(config.url, baseURL);
    const pathName = fullURL.pathname;
    const token = localStorage.getItem("borrowerToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (
      pathName !== "/LynxWebApi/document/uploadDocuments" &&
      pathName !== "/document/uploadDocuments" &&
      pathName !== "/LynxWebApi/document/getDocuments" &&
      pathName !== "/document/getDocuments" &&
      pathName !== "/LynxWebApi/document/uploadDocumentsUsingToken" &&
      pathName !== "/document/uploadDocumentsUsingToken" &&
      pathName !== "/LynxWebApi/financial-institution/search" &&
      pathName !== "/financial-institution/search"
    ) {
      useGeneralStore().increaseRequestCount()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
);

axiosInstance.interceptors.response.use(
  response => {
    useGeneralStore().decreaseRequestCount();
    return response;
  },
  error => {
    useGeneralStore().decreaseRequestCount();
    const loginNames = ["sign-in-form", "recover-password", "reset-password"];
    if (error.response && error.response.status === 401) {
      if (router.app._route.name !== "loan-tech-info") {
        const redirect =
        router.app._route.path !== "/" && router.app._route.path !== ""
          ? router.app._route.path
          : null;
        if (router.app._route.name !== "sign-in-form") {
         useUserStore().logOut()
        } 
        if (loginNames.indexOf(router.app._route.name) === -1) {
          router.push({ path: "/sign-in", query: { redirect } });
        }
        return Promise.resolve({ status: 401 });
      }
    }
    return Promise.reject(error);
  }
)

export default axiosInstance
