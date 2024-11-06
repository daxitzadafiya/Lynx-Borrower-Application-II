import { useCurrentLoanStore } from '@/stores/currentLoanStore'

export function useProgressNavigation() {
  const { currentLoan, currentBorrower, currentSectionAndPageData, loanProgress } =
    useCurrentLoanStore()

  const getNextNavigablePage = (sectionIndex, pageIndex) => {
    for (let i = sectionIndex; i < loanProgress.Sections.length; i++) {
      const section = loanProgress.Sections[i]

      for (let j = pageIndex; j < section.Pages.length; j++) {
        const page = section.Pages[j]

        // const fakePageRuleId = 1 // Fake rule ID for testing purposes

        // switch (fakePageRuleId) {
        switch (page.RuleId) {
          //Always Show Rules
          case 1:
          case 3:
          case 4:
            console.log('Always Show Rule')
            return '/' + page.Route
          default:
            console.log('default')
            if (
              (currentLoan.LoanPurposeType ? currentLoan.LoanPurposeType : 'All') ===
                page.LoanType &&
              !(
                page.Completions &&
                page.Completions.some((x) => x.BorrowerId === currentBorrower.Id)
              )
            ) {
              const pageRules = [
                { condition: 'user.Id === 2', next: 'borrowers/name' },
                { condition: 'loan.Id === 209', next: 'borrowers/alias' }
              ]

              if (pageRules && pageRules.length) {
                for (const rule of pageRules) {
                  // Whitelist allowed operators
                  const allowedOperators = ['===', '==', '!==', '>=', '<=', '>', '<']

                  // Check for existence of operators
                  const hasOperators = rule.condition
                    .split(/\s+/)
                    .some((part) => allowedOperators.includes(part))

                  if (!hasOperators) {
                    console.warn('Rule does not contain any allowed operators:', rule.condition)
                    // Skip to the next rule if no operators
                    continue
                  }

                  // Sanitize rule
                  const sanitizedRule = sanitizeRule(rule.condition, allowedOperators)

                  if (!sanitizedRule) {
                    console.error('Invalid rule format detected for rule:', rule.condition)
                    // Skip to the next rule if invalid
                    continue
                  }

                  const evaluateRule = new Function(
                    'user',
                    'loan',
                    'console.log(user, loan); return (' + sanitizedRule + ')'
                  )(currentBorrower, currentLoan)

                  if (evaluateRule) {
                    console.log('Rule matched:', rule.condition)
                    console.log('Rule next:', rule.next)
                    return rule.next
                  } else {
                    console.log('Rule did not match:', rule.condition)
                  }
                }
              }
              console.log('Borrower default Rule')
              // Only return default route if no rule matches
              return '/' + page.Route
            }
        }
      }
    }
  }

  const sanitizeRule = (rule, allowedOperators) => {
    const ruleParts = rule.split(/\s+/)
    const filteredParts = ruleParts.filter(
      (part) => allowedOperators.includes(part) || !part.match(/[^\w.]/)
    )

    return filteredParts.join(' ')
  }

  const navigateToNextStep = () => {
    console.log(currentSectionAndPageData)
    let { sectionIndex, pageIndex } = currentSectionAndPageData

    //Get the next route
    if (sectionIndex == -1) {
      sectionIndex = 0
    }
    if (pageIndex == -1) pageIndex = 0
    else pageIndex++

    const nextPage = getNextNavigablePage(sectionIndex, pageIndex)
    console.log(nextPage)
    // router.push(nextPage as RouteLocationRaw) // Add type assertion here
  }

  return {
    navigateToNextStep
  }
}
