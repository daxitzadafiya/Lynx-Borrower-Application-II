import axiosInstance from '@/plugins/axios'

export const loginRequest = async (auth) => {
  const response = await axiosInstance.post('/auth/authenticate', auth)
  return response.data.Data
}

export const validationToken = async () => {
  const response = await axiosInstance.post('/auth/validateToken')
  return response.data.Data
}
