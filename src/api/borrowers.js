import axiosInstance from '@/plugins/axios'

export const getLoanInvitations = async (id) => {
  const response = await axiosInstance.get(`/loan/${id}/invitations`)
  return response
}

export const resendLoanInvitation = async (data) => {
  const response = await axiosInstance.post(`/loan/invitation/resend`, data)
  return response
}

export const cancelLoanInvitation = async (invitationToken) => {
  const response = await axiosInstance.post(`/loan/invitation/${invitationToken}/cancel`)
  return response
}

export const sendInvitation = async (data) => {
  const response = await axiosInstance.post(`/loan/invitation/add`, data)
  return response
}
