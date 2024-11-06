import axiosInstance from '@/plugins/axios'

export const recoverPassRequest = async (userInfo) => {
  const response = await axiosInstance.post('/auth/recover-password', userInfo)
  return response
}
export const resetPassRequest = async (data) => {
  const response = await axiosInstance.post('/auth/reset-password', data)
  return response
}