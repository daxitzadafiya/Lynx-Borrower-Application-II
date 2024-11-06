import axiosInstance from '@/plugins/axios'

export const getLoanCreditOrders = async (id) => {
  const response = await axiosInstance.get(`/credit/loan/${id}/orders`)
  return response
}
export const getLoanCreditOrderReportDetails = async (id) => {
  const response = await axiosInstance.get(`credit/${id}/report-details`)
  return response
}
export const createCreditOrder = async (data) => {
  const response = await axiosInstance.post(`credit/order`,data)
  return response
}
export const getFullCreditReport = async (id) => {
  const response = await axiosInstance.get(`credit/${id}/report`)
  return response
}
