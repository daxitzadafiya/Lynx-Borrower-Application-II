import axiosInstance from '@/plugins/axios'
import { useBrandingStore } from '@/stores/brandingStore'
import { useGeneralStore } from '@/stores/generalStore'
import { useUserStore } from '@/stores/userStore'


export const saveLoan = async (loanPatches, id) => {
  const response = await axiosInstance.patch(`/loan/${id}/patch`, JSON.stringify(loanPatches))
  return response
}

export const getLoan = async (id) => {
  const response = await axiosInstance.get(`/loan/${id}`)
  return response
}

export const registerWebSync = (
  streamingServer,
  channel,
  onSubscriptionSuccess,
  onSubscriptionFailure,
  onReceive,
  onConnectionFailure,
  onStreamFailure
) => {
  const brandingStore = useBrandingStore()
  const generalStore = useGeneralStore()
  const userStore = useUserStore();
  const streamingClient = new fm.websync.client(streamingServer);
  streamingClient.connect({
    meta: {
      token: brandingStore.isHostedMode
        ? generalStore.hostedToken
        : userStore.currentUser.token
    },
    onSuccess: function () {
      streamingClient.subscribe({
        channel: channel,
        onSuccess: onSubscriptionSuccess,
        onFailure: onSubscriptionFailure,
        onReceive: onReceive
      });
    },
    onFailure: onConnectionFailure,
    onStreamFailure: onStreamFailure
  });

  return streamingClient;
};

export const disconnectStream = (streamingClient,
  onDisconnectComplete,
  onDisconnectFailure,
  onDisconnectSuccess) => {
  streamingClient.disconnect({
    onComplete: onDisconnectComplete,
    onFailure: onDisconnectFailure,
    onSuccess: onDisconnectSuccess
  });
}
export const underwriteLoan = async (data) => {
  const response = await axiosInstance.post(`/loan/${data}/underwrite`)
  return response
}

export const underwritingResult = async (data) => {
  const response = await axiosInstance.get(`/loan/${data}/underwriting-result`)
  return response
}
export const getLoanPatchesById = async (id) => {
  const response = await axiosInstance.get(`/loan/${id}/patches`)
  return response
}