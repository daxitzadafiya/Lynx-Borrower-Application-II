import axiosInstance from '@/plugins/axios'

export const registerRequest = async (userInfo) => {
  const response = await axiosInstance.post('/auth/signup', userInfo)
  return response
}