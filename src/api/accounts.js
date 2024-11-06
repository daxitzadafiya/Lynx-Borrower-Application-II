import axiosInstance from '@/plugins/axios'

export const getLinkToken = async (loanId) => {
    const response = await axiosInstance.get(`/assets/${loanId}/link-token`)
    return response
}

export const addLinkItem = async (loanId, linkToken, publicToken) => {
    const response = await axiosInstance.get(`/assets/${loanId}/link-item-add/${linkToken}/${publicToken}`)
    return response
}

export const searchText = async (searchText) => {
    const response = await axiosInstance.get(`/financial-institution/search?searchText=${searchText}`)
    return response
}
