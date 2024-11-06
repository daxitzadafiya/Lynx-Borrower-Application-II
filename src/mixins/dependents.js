import { useBorrowersStore } from '../stores/borrowersStore'

export function dependents() {
  const { updateDependents, getDependents } = useBorrowersStore()

  const updateCount = (e) => {
    const regex = /^[1-9]{1}$/
    if (!regex.test(e)) { 
      return updateDependents({ prop: 'Count', value: 0 })
    }
    updateDependents({ prop: 'Count', value: +e })
  }

  const tabToNext = (e) => {
    const elem = e.srcElement
    const tidx = +elem.getAttribute('tabindex') + 1
    const elems = document.getElementsByTagName('input')
    const maxLength = +elem.getAttribute('maxlength')
    const curLength = elem.value.length ? elem.value.length : 0
    if (curLength >= maxLength) {
      for (let i = elems.length; i--; ) {
        const tidx2 = +elems[i].getAttribute('tabindex')
        if (tidx2 == tidx) elems[i].focus()
      }
    }
  }

  const updateAges = (e, index) => {
    const regex = /^[0-9]*$/
    let Ages = getDependents().Ages || []
    if (regex.test(e)) {
      Ages[index] = e
      updateDependents({ prop: 'Ages', value: Ages })
    }
    if (!e) {
      Ages = Ages.filter((item) => item)
      updateDependents({ prop: 'Ages', value: Ages })
    }
  }
  return {
    updateAges,
    updateCount,
    tabToNext
  }
}
