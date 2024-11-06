import axiosInstance from '@/plugins/axios'
export const getLoanProducts = async (data) => {
  const response = await axiosInstance.post(`loan-products-data/get-offers`,data)
  return response.data
}
