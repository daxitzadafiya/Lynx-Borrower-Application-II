import { onMounted, ref } from 'vue'
import { useBorrowersStore } from '@/stores/borrowersStore'
import moment from 'moment'
export function military() {
  const borrowersStore = useBorrowersStore()
  const isServing = ref(false)
  const isRetired = ref(false)
  const isPeriod = ref(false)
  const date = new Date().toISOString().substr(0, 10)

  const updateExpirationDate = (date) => {
    const MilitaryServices = borrowersStore.getMilitaryServices().map((item) => {
      if (item.MilitaryStatusType === 'ActiveDuty') {
        if(date){
          item.MilitaryServiceExpectedCompletionDate = moment(new Date(date)).format('YYYY-MM-DD')
        }else{
          item.MilitaryServiceExpectedCompletionDate = null
        }
      }
      return item
    })
    borrowersStore.updateMilitary(MilitaryServices)
  }

  const cancelDate = () => {
    const MilitaryServices = borrowersStore.getMilitaryServices().map((item) => {
      if (item.MilitaryStatusType === 'ActiveDuty') {
        item.MilitaryServiceExpectedCompletionDate = ""
      }
      return item
    })
    borrowersStore.updateMilitary(MilitaryServices)
  }

  const toggleService = (bool, value) => {
    switch (bool) {
      case 'isSpouse':
        borrowersStore.updateBorrower({
          prop: 'SpousalVABenefitsEligibilityIndicator',
          value: !value
        })
        break
      default:
        handleMilitaryServiceType(bool)
    }
  }

  const handleMilitaryServiceType = (bool) => {
    switch (bool) {
      case 'isServing':
        isServing.value = !isServing.value
        break
      case 'isRetired':
        isRetired.value = !isRetired.value
        break
      case 'isPeriod':
        isPeriod.value = !isPeriod.value
        break
    }
    const values = [
      { title: 'ActiveDuty', bool: 'isServing' },
      { title: 'Veteran', bool: 'isRetired' },
      { title: 'ReserveNationalGuardNeverActivated', bool: 'isPeriod' }
    ]
    const selected = values.find((item) => item.bool === bool)
    let MilitaryServices = [...borrowersStore.getMilitaryServices()]
    if (eval(bool).value) {
      MilitaryServices.push({ MilitaryStatusType: selected.title })
    } else {
      MilitaryServices = MilitaryServices.filter(
        (item) => item.MilitaryStatusType !== selected.title
      )
    }
    borrowersStore.updateMilitary(MilitaryServices)
  }

  onMounted(() => {
    let MilitaryServices = borrowersStore.getMilitaryServices()
    isServing.value = !!MilitaryServices.find((item) => item.MilitaryStatusType === 'ActiveDuty')
    isRetired.value = !!MilitaryServices.find((item) => item.MilitaryStatusType === 'Veteran')
    isPeriod.value = !!MilitaryServices.find(
      (item) => item.MilitaryStatusType === 'ReserveNationalGuardNeverActivated'
    )
  })

  return {
    isServing,
    isRetired,
    isPeriod,
    date,
    updateExpirationDate,
    cancelDate,
    toggleService,
    handleMilitaryServiceType
  }
}
