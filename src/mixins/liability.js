import { ref } from 'vue'

export function liability() {
  const disputeReasons = ref([
    {
      text: 'Not My Acccount',
      value: 'NotMyAcccount'
    },
    {
      text: 'Fraud',
      value: 'Fraud'
    },
    {
      text: 'Incorrect Balance',
      value: 'IncorrectBalance'
    },
    {
      text: 'Account Closed',
      value: 'AccountClosed'
    },
    {
      text: 'Co-Signer Only',
      value: 'CoSignerOnly'
    },
    {
      text: 'Incorrect Payment',
      value: 'IncorrectPayment'
    },
    {
      text: 'Other',
      value: 'Other'
    }
  ])
  const liabilitiesAccountTypes = ref([
    {
      text: 'Collection/Judgements/Lien',
      value: 'CollectionsJudgmentsAndLiens'
    },
    {
      text: 'Installment',
      value: 'Installment'
    },
    {
      text: 'Lease Payment',
      value: 'LeasePayment'
    },
    {
      text: 'Revolving',
      value: 'Revolving'
    },
    {
      text: 'Taxes',
      value: 'Taxes'
    },
    {
      text: 'Other',
      value: 'Other'
    }
  ])
  const liabilitiesOwnershipTypes = ref([
    {
      text: 'Individual',
      value: 'Individual'
    },
    {
      text: 'Joint With Spouse',
      value: 'JointWithSpouse'
    },
    {
      text: 'Joint With Other',
      value: 'JointWithOther'
    }
  ])
  return { disputeReasons, liabilitiesAccountTypes, liabilitiesOwnershipTypes }
}
