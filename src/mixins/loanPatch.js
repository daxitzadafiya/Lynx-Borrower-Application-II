import { useRoute, useRouter } from 'vue-router'
import { useGeneralStore } from '../stores/generalStore'
import { useBorrowersStore } from '../stores/borrowersStore'
import { computed } from 'vue'
import { useCreditStore } from '../stores/creditStore'

export function loanPatch() {
  const route = useRoute()
  const router = useRouter()
  const generalStore = useGeneralStore()
  const borrowerStore = useBorrowersStore()
  const creditStore = useCreditStore()

  const curBorrowerCurrentEmployment = computed(() => {
    return (
      borrowerStore.getBorrowerEmployment.find((item) => item.EmploymentStatusType === 'Current') ||
      null
    )
  })
  const curBorrowerPreviousEmployment = computed(() => {
    return this.borrowerEmployment.find((item) => item.EmploymentStatusType === 'Previous') || null
  })

  const saveAndAdvance = async (saveLoan, requestedNextPath, preventCompletionObjectAddition) => {
    let currentPath = route.path.replace(/\/$/, '')
    let nextPath = requestedNextPath
    let { sectionIndex, pageIndex } = findPageIndexAndSectionIndex(currentPath)
    if (generalStore.progressModelActive && !preventCompletionObjectAddition) {
      if (sectionIndex != -1 && pageIndex != -1) {
        addCompletion(
          generalStore.currentLoan.LoanProgress.Sections[sectionIndex].Pages[pageIndex],
          {
            BorrowerId: borrowerStore.Borrower.Id,
            CompletedWhen: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        )
      }
    }
    if (saveLoan) {
      await generalStore.saveLoanPatches()
    }
    if (sectionIndex == -1) sectionIndex = 0

    if (pageIndex == -1) pageIndex = 0
    //Advance to the next page
    else pageIndex++

    if (!nextPath) {
      nextPath = getNextPath(sectionIndex, pageIndex)
    }

    if (nextPath != null && route.path != nextPath) {
      await router.push(nextPath)
      return
    }
  }
  const getNextPath = (sectionIndex, pageIndex) => {
    let currentLoan = generalStore.getCurrentLoan();
    if (!currentLoan) currentLoan = generalStore.currentLoan
    let selectedBorrower = borrowerStore.Borrower
    if (!selectedBorrower) selectedBorrower = currentLoan.Borrowers[0]

    for (let i = sectionIndex; i < currentLoan?.LoanProgress.Sections.length; i++) {
      const section = currentLoan.LoanProgress.Sections[i]
      for (let j = pageIndex; j < section.Pages.length; j++) {
        const page = section.Pages[j]
        switch (page.RuleId) {
          //Always Show Rules
          case 3:
          case 4:
            return '/' + page.Route

          //Page Specific Rules
          case 5: //Borrower
          case 6: //Loan & Property
          case 7: //Credit
          case 8: //Accounts & Assets
          case 9: //Employment & Income
            switch (page.Route) {
              case 'employmentandincome/employedByPartyToTransaction':
                if (
                  curBorrowerCurrentEmployment &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
              case 'employmentandincome/employedByFamilyMember':
                if (
                  curBorrowerCurrentEmployment &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
              case 'employmentandincome/ownership-percentage':
                if (
                  curBorrowerCurrentEmployment &&
                  curBorrowerCurrentEmployment.EmploymentBorrowerSelfEmployedIndicator &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
              case 'employmentandincome/job-details':
                if (
                  curBorrowerCurrentEmployment &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
              case 'employmentandincome/compensation-types':
                if (
                  curBorrowerCurrentEmployment &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

              case 'employmentandincome/compensation-details':
                if (
                  curBorrowerCurrentEmployment &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

              case 'employmentandincome/previous-employment':
                if (
                  curBorrowerCurrentEmployment &&
                  curBorrowerCurrentEmployment.EmploymentStartDate &&
                  moment().diff(curBorrowerCurrentEmployment.EmploymentStartDate, 'years') < 2 &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

              case 'employmentandincome/previous-employment-details':
                if (
                  curBorrowerCurrentEmployment &&
                  curBorrowerCurrentEmployment.EmploymentStartDate &&
                  moment().diff(curBorrowerCurrentEmployment.EmploymentStartDate, 'years') < 2 &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

              case 'employmentandincome/additional-employment':
                if (
                  curBorrowerCurrentEmployment &&
                  curBorrowerCurrentEmployment.EmploymentStartDate &&
                  moment().diff(curBorrowerCurrentEmployment.EmploymentStartDate, 'years') < 2 &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
              //Accounts and Assets Section
              case 'accountsandassets/address':
                if (
                  borrowerStore.realEstateOwned &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/property-status':
                if (
                  borrowerStore.currentRealEstate &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/value':
                if (
                  borrowerStore.currentRealEstate &&
                  borrowerStore.currentRealEstate.PropertyDispositionStatusType != 'Sold' &&
                  borrowerStore.currentRealEstate.PropertyDispositionStatusType != 'PendingSale' &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/closing-date':
                if (
                  borrowerStore.currentRealEstate &&
                  (borrowerStore.currentRealEstate.PropertyDispositionStatusType == 'Sold' ||
                    borrowerStore.currentRealEstate.PropertyDispositionStatusType ===
                      'PendingSale') &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/expenses':
                if (
                  borrowerStore.currentRealEstate &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/expenses-details':
                if (
                  borrowerStore.currentRealEstate &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/rental-income':
                if (
                  borrowerStore.currentRealEstate &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/usage-types':
                if (
                  borrowerStore.currentRealEstate &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/mortgage-details':
                if (
                  borrowerStore.currentRealEstate &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/mortgage-details-review':
                if (
                  borrowerStore.realEstateOwnedMortgage &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/purchase-credit-types':
              case 'accountsandassets/purchase-credits-details':
                if (
                  currentLoan.ReceivingPurchaseCredits &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/loan-grants-details':
                if (
                  currentLoan.ReceivingGrants &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/loan-gifts-types':
              case 'accountsandassets/loan-gifts-details':
                if (
                  currentLoan.ReceivingGifts &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/parties-credit':
                if (
                  currentLoan.ReceivingSellerCredits &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/deposits-details':
                if (
                  (currentLoan.DepositRequirement == 'depositToBeMade' ||
                    currentLoan.DepositRequirement == 'depositMade') &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }

                break

              case 'accountsandassets/other-assets-details':
                if (
                  selectedBorrower.Assets.findIndex((x) => x.AssetTypeId === 1) !== -1 &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
                break

              //Credit Section
              case 'credit/order':
                let borrowerCreditOrder = null
                if (creditStore.creditOrders && creditStore.creditOrders.length) {
                  borrowerCreditOrder = creditStore.creditOrders.find(
                    (item) =>
                      item.BorrowerId === selectedBorrower.Id && item.StatusCode === 'COMPLETED'
                  )
                }

                if (!(borrowerCreditOrder && borrowerCreditOrder.StatusCode === 'COMPLETED')) {
                  return '/' + page.Route
                }
                break

              case 'credit/derogatory-items':
                if (
                  selectedBorrower.PublicRecords &&
                  selectedBorrower.PublicRecords.length > 0 &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
                break

              case 'credit/other-liabilities-details':
                if (
                  selectedBorrower.OtherLiabilitiesAndExpenses &&
                  selectedBorrower.OtherLiabilitiesAndExpenses.findIndex(
                    (x) =>
                      x.ExpenseType === 'Alimony' ||
                      x.ExpenseType === 'ChildSupport' ||
                      x.ExpenseType === 'JobRelatedExpenses'
                  ) !== -1 &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
                break

              //Loan And Property Section
              case 'loanandproperty/purchase-price':
                if (
                  currentLoan.LoanPurposeType === page.LoanType &&
                  currentLoan.SalesContract &&
                  !(page.Completions && page.Completions.length > 0)
                ) {
                  return '/' + page.Route
                }
                break

              case 'loanandproperty/estimated-value':
                if (
                  !currentLoan.SalesContract &&
                  !(page.Completions && page.Completions.length > 0)
                ) {
                  return '/' + page.Route
                }
                break

              case 'loanandproperty/additional-mortgage-details':
                if (
                  currentLoan.Property?.HasAdditionalMortgages &&
                  !(page.Completions && page.Completions.length > 0)
                ) {
                  return '/' + page.Route
                }
                break

              case 'loanandproperty/rental-income':
                if (
                  (currentLoan.Property?.PropertyType === 'Two-to-fourUnitProperty' ||
                    currentLoan.Property?.PropertyType === 'Investment') &&
                  !(page.Completions && page.Completions.length > 0)
                ) {
                  return '/' + page.Route
                }
                break

              //Borrower Section
              case 'borrowers/unmarried-addendum':
                //Add State Check once we figure ot if its property state or current residence state
                //const unmarriedAddIndicator = getStateIndicator(stateCode, "UnmarriedAddendumRequired" );
                if (
                  selectedBorrower.MaritalStatusType === 'Unmarried' &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
                break

              case 'borrowers/military-service-details':
                if (
                  selectedBorrower.SelfDeclaredMilitaryServiceIndicator &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
                break

              case 'borrowers/residency-rent-expense':
                if (
                  selectedBorrower.Residences &&
                  selectedBorrower.Residences[0].ResidencyBasisType === 'Rent' &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
                break

              case 'borrowers/prior-residence':
                if (
                  selectedBorrower.Residences &&
                  selectedBorrower.Residences[0].ResidencyDurationMonthsCount < 24 &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
                break

              case 'borrowers/prior-residency-length':
                {
                  let priorResidence = borrowerStore.getSpecificResidence('Prior')

                  if (
                    Object.keys(priorResidence).length != 0 &&
                    !(
                      page.Completions &&
                      page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                    )
                  ) {
                    return '/' + page.Route
                  }
                }

                break

              case 'borrowers/prior-living-status':
                {
                  let priorResidence = borrowerStore.getSpecificResidence('Prior')

                  if (
                    Object.keys(priorResidence).length != 0 &&
                    !(
                      page.Completions &&
                      page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                    )
                  ) {
                    return '/' + page.Route
                  }
                }
                break

              case 'borrowers/prior-rent-expense':
                {
                  let priorResidence = borrowerStore.getSpecificResidence('Prior')

                  if (
                    Object.keys(priorResidence).length != 0 &&
                    priorResidence.ResidencyBasisType === 'Rent' &&
                    !(
                      page.Completions &&
                      page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                    )
                  ) {
                    return '/' + page.Route
                  }
                }

                break

              case 'borrowers/invite-co-borrower':
                if (
                  !currentLoan.Borrowers.some((x) => x.CoBorrower === true) &&
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
                break
            }
            break
          default:
            if (
              page.LoanType === 'All' ||
              (currentLoan.LoanPurposeType === null || currentLoan.LoanPurposeType === undefined
                ? 'All'
                : currentLoan.LoanPurposeType) === page.LoanType
            ) {
              if (section.SectionType === 'Borrower') {
                if (
                  !(
                    page.Completions &&
                    page.Completions.some((x) => x.BorrowerId === selectedBorrower.Id)
                  )
                ) {
                  return '/' + page.Route
                }
              } else if (section.SectionType === 'BorrowerPair') {
                if (!(page.Completions && page.Completions.length > 0)) {
                  return '/' + page.Route
                }
              } else if (section.SectionType === 'Shared') {
                if (!(page.Completions && page.Completions.length > 0)) {
                  return '/' + page.Route
                }
              }
            }
          break;
        }
      }
      pageIndex = 0;
    }
  }
  const findPageIndexAndSectionIndex = (route) => {
    let sectionIndex = -1
    let pageIndex = -1

    // Find section index
    generalStore.currentLoan?.LoanProgress.Sections.find((section, index) => {
      const pageIndexInSection = section.Pages.findIndex((page) => '/' + page.Route === route)
      if (pageIndexInSection !== -1) {
        sectionIndex = index
        pageIndex = pageIndexInSection
        return true
      }
    })
    return { sectionIndex, pageIndex }
  }

  const addCompletion = (page, completion) => {
    if (!page.hasOwnProperty('Completions')) {
      page.Completions = []
    }
    const index = page.Completions.findIndex((ec) => ec.BorrowerId === completion.BorrowerId)

    if (index !== -1) {
      page.Completions[index] = completion
    } else {
      page.Completions.push(completion)
    }
  }

  return { saveAndAdvance }
}
