import axiosInstance from '@/plugins/axios'

const token = localStorage.getItem('token')

export const validateToken = async () => {
  console.log('token', token)
  const response = await axiosInstance.post(
    '/auth/validateToken',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data.Data
}
