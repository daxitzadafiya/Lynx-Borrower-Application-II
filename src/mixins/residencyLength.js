import { useBorrowersStore } from '@/stores/borrowersStore.js'
export function residencyLength() {

  const updatePeriod = (e, counter, type, period) => {
    const { updateResidenceProp } = useBorrowersStore()
    let ResidencyDurationMonthsCount = 0;
    if (e.target.value) {
      ResidencyDurationMonthsCount +=
        counter === "years"
          ? Math.round(+e.target.value * 12) + +period.months
          : Math.round(+period.years * 12) + +e.target.value;
    } else {
      ResidencyDurationMonthsCount =
        counter === "years"
          ? +period.months
          : Math.round(+period.years * 12);
    }
    updateResidenceProp({
      type: type,
      prop: "ResidencyDurationMonthsCount",
      value: ResidencyDurationMonthsCount
    });

  }
  return {
    updatePeriod
  }

}
