import axiosInstance from '@/plugins/axios'

export const getLoan = async (id) => {
  const response = await axiosInstance.get(`/loan/${id}`)
  return response.data
}
