import axiosInstance from '@/plugins/axios'
export const createToken = async (loanId) => {
  const response = await axiosInstance.post(`/document/createToken?loanId=`+loanId)
  return response.data
}
export const uploadDocument = async (req) => {
  const response = await axiosInstance.post(`/document/${req.loanId==null?`uploadDocumentsUsingToken?tokenId=${req.tokenId}`:`uploadDocuments?loanId=${req.loanId}`}`,req.data)
  return response.data
}
export const getDocuments = async (data) => {
  const response = await axiosInstance.get(`/document/getDocuments?loanId=${data.loanId}&lastDocumentId=${data.lastDocumentId==null?'':data.lastDocumentId}`)
  return response.data
}
export const getFile = async (loanId) => {
  const response = await axiosInstance.get(`/document/getFile?documentId=`+documentId)
  return response.data
}
export const deleteDocument = async (Id) => {
  const response = await axiosInstance.delete(`/document/deleteDocument?Id=`+Id)
  return response.data
}
export const getDocumentTypes = async () => {
  const response = await axiosInstance.get(`/document/getDocumentTypes`)
  return response.data
}
