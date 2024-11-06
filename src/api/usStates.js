import axiosInstance from '@/plugins/axios'

export const getAllUsStates = async () => {
    const response = await axiosInstance.get('/loan/states/details')
    return response
  }