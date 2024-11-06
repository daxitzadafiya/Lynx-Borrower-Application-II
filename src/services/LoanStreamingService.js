import { registerWebSync } from '@/api/general'
import configs from '../configs'
import { useUserStore } from '@/stores/userStore'
import { useGeneralStore } from '@/stores/generalStore'
import { disconnectStream } from '@/api/general'

const LoanPatchChannelPrefix = '/LoanPatchChannel/'


class LoanStreamingService {
  constructor() {
    this.streamingClient = undefined
    this.streamedLoanId = undefined
  }

  onSubscriptionSuccess(event) {
  }

  onSubscriptionFailure(event) {
    console.log(`Subscribed failed for Loan: ${this.streamedLoanId}`);
    console.log(event);
  }
  unSubscribeAndSubscribe(loanId) {
    const self = this
    if (self.streamingClient) {
      if (self.streamedLoanId) {
        this.unsubscribe(() => this.subscribe(loanId))
      } else {
        this.subscribe(loanId)
      }
    } else {
      let subscribeChannel
      if (loanId) {
        subscribeChannel = LoanPatchChannelPrefix + loanId
      }
      self.streamedLoanId = loanId
      self.streamingClient = registerWebSync(
        configs.streamingServerPath,
        subscribeChannel,
        (model) => this.onSubscriptionSuccess(model),
        (model) => this.onSubscriptionFailure(model),
        (model) => this.onReceive(model),
        (model) => this.onConnectionFailure(model),
        (model) => this.onStreamFailure(model)
      )
    }
  }
  onConnectionFailure(event) {
  }

  onStreamFailure(event) {
    console.log("Stream failure ", event);
  }
  subscribe(loanId) {
    let subscribeChannel
    if (loanId) {
      subscribeChannel = LoanPatchChannelPrefix + loanId
    }
    this.streamedLoanId = loanId
    this.streamingClient.subscribe({
      channel: subscribeChannel,
      onSuccess: (model) => this.onSubscriptionSuccess(model),
      onFailure: (model) => this.onSubscriptionFailure(model),
      onReceive: (model) => this.onReceive(model)
    })
  }

  unsubscribe(onComplete) {
    if (this.streamedLoanId) {
      const loanId = this.streamedLoanId
      let onCompleteCallback = onComplete || (() => this.onUnsubscribeOnlyCompleted())
      let unSubscribeChannel = LoanPatchChannelPrefix + loanId
      this.streamingClient.unsubscribe({
        channel: unSubscribeChannel,
        onComplete: onCompleteCallback,
        onFailure: function (event) {
          console.log(`Failure on unsubscribe from Loan ${loanId}`, event)
        },
        onSuccess: function (event) {
          console.log(`Successfully unsibscribed from Loan ${loanId}`, event)
        }
      })
    }
  }

  onReceive(event) {
    const { currentUser } = useUserStore()
    const generalStore = useGeneralStore()
    const loanPatch = event.getData();
    if (
      loanPatch.ByUserId &&
      currentUser.userId != loanPatch.ByUserId
    ) {
      generalStore.applyPatchesFromStream(loanPatch.Operations)
    }
  }
  onUnsubscribeOnlyCompleted() {
    console.log("Unsubscribe completed");
    this.streamedLoanId = undefined;
  }

  onDisconnectComplete(model) {
    console.log("Disconnected from stream");
    this.streamingClient = undefined;
  }
  onDisconnectFailure(model) {
    // console.log(model)
  }
  onDisconnectSuccess(model) {
    // console.log(model)
  }

  disconnect() {
    const self = this;
    disconnectStream(
      self.streamingClient,
      model => self.onDisconnectComplete(model),
      model => self.onDisconnectFailure(model),
      model => self.onDisconnectSuccess(model)
    );
  }
}

export const loanStreamingService = new LoanStreamingService()
