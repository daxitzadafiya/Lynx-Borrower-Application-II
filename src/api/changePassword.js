import axiosInstance from '@/plugins/axios'

export const changePasswordRequest = async (auth) => {
  const response = await axiosInstance.post('/auth/change-password', auth)
  return response
}