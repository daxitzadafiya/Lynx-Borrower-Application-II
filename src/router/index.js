import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Borrowers from '@/views/Borrowers.vue'
import LoanProperty from '@/views/LoanProperty.vue'
import Accounts from '@/views/Accounts.vue'
import authMiddleware from '@/middlewares/authMiddleware'
import validateTokenMiddleware from '@/middlewares/validateTokenMiddleware'
import { useGeneralStore } from '@/stores/generalStore'
import Credit from '@/views/Credit.vue'
import Employment from '@/views/Employment.vue'
import Declarations from '@/views/Declarations.vue'
import Documents from '@/views/Documents.vue'
import RatesOffers from '@/views/RatesOffers.vue'
import Review from '@/views/Review.vue'
import Approved from '@/views/Approved.vue'
import LenderLoanInfo from '@/views/LenderLoanInfo.vue'
import LoanDetails from '@/views/LoanDetails.vue'
import ApplicationComplete from '@/views/ApplicationComplete.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/borrowers',
          component: Borrowers,
          children: [
            {
              path: "e-consent",
              name: "e-consent",
              component: () => import("../components/borrowers/EConsent.vue")
            },
            {
              path: '',
              name: 'borrowers',
              component: () => import('../components/borrowers/Intro.vue')
            },
            {
              path: 'start',
              name: 'borrowers-start',
              component: () => import('../components/borrowers/Start.vue')
            },
            {
              path: "name",
              name: "borrowers-name",
              component: () => import("../components/borrowers/Name.vue")
            },
            {
              path: "alias",
              name: "borrowers-alias",
              component: () => import("../components/borrowers/Alias.vue")
            },
            {
              path: "email",
              name: "borrowers-email",
              component: () => import("../components/borrowers/Email.vue")
            },
            {
              path: "birth-date",
              name: "borrowers-birth-date",
              component: () => import("../components/borrowers/BirthDate.vue")
            },
            {
              path: "contact",
              name: "borrowers-contact",
              component: () => import("../components/borrowers/Contact.vue")
            },
            {
              path: "citizenship",
              name: "borrowers-citizenship",
              component: () => import("../components/borrowers/Citizenship.vue")
            },
            {
              path: "marital-status",
              name: "borrowers-marital-status",
              component: () => import("../components/borrowers/MaritalStatus.vue")
            },
            {
              path: "unmarried-addendum",
              name: "borrowers-unmarried-addendum",
              component: () => import("../components/borrowers/UnmarriedAddendum.vue")
            },
            {
              path: "dependents",
              name: "borrowers-dependents",
              component: () => import("../components/borrowers/Dependents.vue")
            },
            {
              path: "military-service",
              name: "borrowers-military-service",
              component: () => import("../components/borrowers/MilitaryService.vue")
            },
            {
              path: "military-service-details",
              name: "borrowers-military-service-details",
              component: () => import("../components/borrowers/MilitaryServiceDetails.vue")
            },
            {
              path: "residency-address",
              name: "borrowers-residency-address",
              component: () => import("../components/borrowers/ResidencyAddress.vue")
            },
            {
              path: "residency-mailing",
              name: "borrowers-residency-mailing",
              component: () => import("../components/borrowers/ResidencyMailing.vue")
            },
            {
              path: "residency-length",
              name: "borrowers-residency-length",
              component: () => import("../components/borrowers/ResidencyLength.vue")
            },
            {
              path: "residency-living-status",
              name: "borrowers-living-status",
              component: () => import("../components/borrowers/ResidencyLivingStatus.vue")
            },
            {
              path: "residency-rent-expense",
              name: "borrowers-rent-expense",
              component: () => import("../components/borrowers/ResidencyRentExpense.vue")
            },
            {
              path: "prior-residence",
              name: "borrowers-prior-residence",
              component: () => import("../components/borrowers/PriorResidence.vue")
            },
            {
              path: "prior-residency-length",
              name: "borrowers-prior-residency-length",
              component: () => import("../components/borrowers/PriorResidencyLength.vue")
            },
            {
              path: "prior-living-status",
              name: "borrowers-prior-living-status",
              component: () => import("../components/borrowers/PriorLivingStatus.vue")
            },
            {
              path: "prior-rent-expense",
              name: "borrowers-prior-rent-expense",
              component: () => import("../components/borrowers/PriorRentExpense.vue")
            },
            {
              path: "invite-co-borrower",
              name: "invite-co-borrower",
              component: () => import("../components/borrowers/InviteCoBorrower.vue")
            },
            {
              path: "review",
              name: "borrowers-review",
              component: () => import("../components/borrowers/Review.vue")
            },
            {
              path: "summary",
              name: "borrowers-summary",
              component: () => import("../components/borrowers/Summary.vue")
            }
          ]
        },
        {
          path: "/loanandproperty",
          component: LoanProperty,
          children: [
            {
              path: "",
              name: "loanandproperty",
              component: () => import("../components/loan-property/Main.vue")
            },
            {
              path: "loan-purpose",
              name: "loanandproperty-purpose",
              component: () => import("../components/loan-property/LoanPurpose.vue")
            },
            {
              path: "found-property",
              name: "loanandproperty-found-property",
              component: () =>
                import("../components/loan-property/FoundProperty.vue")
            },
            {
              path: "property-address",
              name: "loanandproperty-found-property-address",
              component: () =>
                import("../components/loan-property/PropertyAddress.vue")
            },
            {
              path: "sales-contract",
              name: "loanandproperty-sales-contract",
              component: () =>
                import("../components/loan-property/SalesContract.vue")
            },
            {
              path: "purchase-price",
              name: "loanandproperty-purchase-price",
              component: () =>
                import("../components/loan-property/PurchasePrice.vue")
            },
            {
              path: "estimated-value",
              name: "loanandproperty-estimated-value",
              component: () =>
                import("../components/loan-property/EstimatedValue.vue")
            },
            {
              path: "property-details",
              name: "loanandproperty-property-details",
              component: () =>
                import("../components/loan-property/PropertyDetails.vue")
            },
            {
              path: "housing-expenses",
              name: "loanandproperty-housing-expenses",
              component: () =>
                import("../components/loan-property/HousingExpenses.vue")
            },
            {
              path: "occupancy",
              name: "loanandproperty-occupancy",
              component: () =>
                import("../components/loan-property/Occupancy.vue")
            },
            {
              path: "downpayment",
              name: "loanandproperty-downpayment",
              component: () =>
                import("../components/loan-property/Downpayment.vue")
            },
            {
              path: "additional-mortgages",
              name: "loanandproperty-additional-mortgages",
              component: () =>
                import("../components/loan-property/AdditionalMortgages.vue")
            },
            {
              path: "additional-mortgage-details",
              name: "loanandproperty-additional-mortgage-details",
              meta: { sideInfo: "loan" },
              component: () =>
                import(
                  "../components/loan-property/AdditionalMortgageDetails.vue"
                )
            },
            {
              path: "rental-income",
              name: "loanandproperty-rental-income",
              meta: { sideInfo: "loan" },
              component: () =>
                import("../components/loan-property/RentalIncome.vue")
            },
            {
              path: "review",
              name: "loanandproperty-review",
              meta: { sideInfo: "loan" },
              component: () => import("../components/loan-property/Review.vue")
            },
            {
              path: "summary",
              name: "loanandproperty-summary",
              meta: { sideInfo: "loan" },
              component: () => import("../components/loan-property/Summary.vue")
            }
          ]
        },
        {
          path: "/credit",
          component: Credit,
          children: [
            {
              path: "",
              name: "credit",
              meta: { title: "", hasImage: false },
              component: () => import("../components/credit/Main.vue")
            },
            {
              path: "order",
              name: "credit-order",
              meta: { title: "Order Credit Report", isCard: true },
              component: () => import("../components/credit/Order.vue")
            },
            {
              path: "response",
              name: "credit-response",
              meta: { title: "Order Credit Report", isCard: true },
              component: () => import("../components/credit/Response.vue")
            },
            {
              path: "score-and-accounts-review",
              name: "credit-score-and-accounts",
              meta: {
                title: "Credit Scores Summary",
                sideInfo: "credit"
              },
              component: () =>
                import("../components/credit/ScoreAndAccounts.vue")
            },
            {
              path: "liabilities-review",
              name: "credit-liabilities-review",
              meta: { sideInfo: "credit" },
              component: () =>
                import("../components/credit/LiabilitiesReview.vue")
            },
            {
              path: "derogatory-items",
              name: "credit-derogatory-items",
              component: () => import("../components/credit/DerogatoryItems.vue")
            },
            {
              path: "other-liabilities",
              name: "credit-other-liabilities",
              meta: { title: "" },
              component: () =>
                import("../components/credit/OtherLiabilities.vue")
            },
            {
              path: "other-liabilities-details",
              name: "credit-other-liabilities-details",
              meta: { title: "Other Liability Details" },
              component: () =>
                import("../components/credit/OtherLiabilityDetails.vue")
            },
            {
              path: "review",
              name: "credit-review",
              meta: { isCard: false },
              component: () => import("../components/credit/Review.vue")
            },
            {
              path: "summary",
              name: "credit-summary",
              meta: {
                isUserInfo: true,
                sideInfo: "credit"
              },
              component: () => import("../components/credit/Summary.vue")
            }
          ]
        },
        {
          path: '/accountsandassets',
          component: Accounts,
          children: [
            {
              path: "",
              name: "accountsandassets",
              meta: { title: "", hasImage: true },
              component: () => import("../components/accounts/Main.vue")
            },
            {
              path: "account-types",
              name: "accountsandassets-account-types",
              meta: { title: "" },
              component: () => import("../components/accounts/AccountTypes.vue")
            },
            {
              path: "account-details",
              name: "accountsandassets-account-details",
              meta: { title: "" },
              component: () =>
                import("../components/accounts/AccountDetails.vue")
            },
            {
              path: "required-deposit",
              name: "accountsandassets-required-deposit",
              meta: { title: "" },
              component: () =>
                import("../components/accounts/RequiredDeposit.vue")
            },
            {
              path: "deposits-details",
              name: "accountsandassets-deposits-details",
              meta: { title: "" },
              component: () =>
                import(
                  "../components/accounts/purchaseCredits/DepositsDetails.vue"
                )
            },
            {
              path: "closing-costs",
              name: "accountsandassets-closing-costs",
              meta: { title: "", hasImage: false },
              component: () =>
                import(
                  "../components/accounts/sellerCredits/ClosingCostsCredits.vue"
                )
            },
            {
              path: "parties-credit",
              name: "accountsandassets-parties-credit",
              meta: { title: "", hasImage: false },
              component: () =>
                import(
                  "../components/accounts/sellerCredits/CreditFromParties.vue"
                )
            },
            {
              path: "other-assets",
              name: "accountsandassets-other-assets",
              meta: { title: "" },
              component: () => import("../components/accounts/OtherAssets.vue")
            },
            {
              path: "other-assets-details",
              name: "accountsandassets-other-asset-details",
              meta: { title: "" },
              component: () =>
                import("../components/accounts/OtherAssetDetails.vue")
            },
            {
              path: "loan-gifts",
              name: "accountsandassets-loan-gifts",
              meta: {
                hasImage: false
              },
              component: () =>
                import("../components/accounts/gifts/LoanGifts.vue")
            },
            {
              path: "loan-gifts-types",
              name: "accountsandassets-loan-gifts-types",
              meta: {
                hasImage: false
              },
              component: () =>
                import("../components/accounts/gifts/LoanGiftsTypes.vue")
            },
            {
              path: "loan-gifts-details",
              name: "accountsandassets-loan-gifts-details",
              meta: {
                hasImage: false
              },
              component: () =>
                import("../components/accounts/gifts/LoanGiftsDetails.vue")
            },
            {
              path: "loan-grants",
              name: "accountsandassets-loan-grants",
              meta: {
                hasImage: false
              },
              component: () =>
                import("../components/accounts/grants/LoanGrants.vue")
            },
            {
              path: "loan-grants-details",
              name: "accountsandassets-loan-grants-details",
              meta: {},
              component: () =>
                import("../components/accounts/grants/LoanGrantsDetails.vue")
            },
            {
              path: "purchase-credits",
              name: "accountsandassets-purchase-credits",
              meta: {},
              component: () =>
                import(
                  "../components/accounts/purchaseCredits/PurchaseCreditsAsk.vue"
                )
            },
            {
              path: "purchase-credit-types",
              name: "accountsandassets-purchase-credit-types",
              meta: { title: "Borrower’s Purchase Credits" },
              component: () =>
                import(
                  "../components/accounts/purchaseCredits/PurchaseCreditTypes.vue"
                )
            },
            {
              path: "purchase-credits-details",
              name: "accountsandassets-purchase-credits-details",
              meta: { title: "Borrower’s Purchase Credits" },
              component: () =>
                import(
                  "../components/accounts/purchaseCredits/PurchaseCreditsDetails.vue"
                )
            },
            {
              path: "real-estate",
              name: "accountsandassets-real-estate",
              meta: { title: "", hasImage: false },
              component: () => import("../components/real-estate/Main.vue")
            },
            {
              path: "address",
              name: "accountsandassets-address",
              meta: { title: "" },
              component: () => import("../components/real-estate/Address.vue")
            },
            {
              path: "property-status",
              name: "accountsandassets-property-status",
              meta: { title: "" },
              component: () =>
                import("../components/real-estate/PropertyStatus.vue")
            },
            {
              path: "value",
              name: "accountsandassets-value",
              meta: { title: "" },
              component: () => import("../components/real-estate/Value.vue")
            },
            {
              path: "closing-date",
              name: "accountsandassets-closing-date",
              meta: { title: "" },
              component: () =>
                import("../components/real-estate/ClosingDate.vue")
            },
            {
              path: "expenses",
              name: "accountsandassets-expenses",
              meta: { title: "" },
              component: () => import("../components/real-estate/Expenses.vue")
            },
            {
              path: "expenses-details",
              name: "accountsandassets-expenses-details",
              meta: { title: "" },
              component: () =>
                import("../components/real-estate/ExpensesDetails.vue")
            },
            {
              path: "rental-income",
              name: "accountsandassets-rental-income",
              meta: { title: "" },
              component: () =>
                import("../components/real-estate/RentalIncome.vue")
            },
            {
              path: "usage-types",
              name: "accountsandassets-usage-types",
              meta: { title: "" },
              component: () => import("../components/real-estate/UsageTypes.vue")
            },
            {
              path: "property-mortgage",
              name: "accountsandassets-property-mortgage",
              meta: { title: "" },
              component: () =>
                import("../components/real-estate/PropertyMortgage.vue")
            },
            {
              path: "mortgage-details",
              name: "accountsandassets-mortgage-details",
              meta: { title: "" },
              component: () =>
                import("../components/real-estate/MortgageDetails.vue")
            },
            {
              path: "mortgage-details-review",
              name: "accountsandassets-mortgage-details-review",
              meta: { title: "" },
              component: () =>
                import("../components/real-estate/MortgageDetailsReview.vue")
            },
            {
              path: "additional-real-estate",
              name: "accountsandassets-additional-real-estate",
              meta: { title: "" },
              component: () => import("../components/real-estate/Additional.vue")
            },
            {
              path: "review",
              name: "accountsandassets-review",
              meta: { title: "Accounts & Assets" },
              component: () => import("../components/accounts/Review.vue")
            },
            {
              path: "summary",
              name: "accountsandassets-summary",
              meta: {
                title: "",
                sideInfo: "accounts"
              },
              component: () => import("../components/accounts/Summary.vue")
            }
          ]
        },
        {
          path: "employmentandincome",
          component: Employment,
          children: [
            {
              path: "",
              name: "employmentandincome",
              meta: { title: "Employment & Income" },
              component: () => import("../components/employment/Main.vue")
            },
            {
              path: "employment-type",
              name: "employmentandincome-employment-type",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Primary"
              },
              component: () =>
                import("../components/employment/EmploymentType.vue")
            },
            {
              path: "worknumber",
              name: "employmentandincome-worknumber",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Primary"
              },
              component: () => import("../components/employment/WorkNumber.vue")
            },
            {
              path: "ownership-percentage",
              name: "employmentandincome-ownership-percentage",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Primary"
              },
              component: () =>
                import("../components/employment/OwnershipPercentage.vue")
            },
            {
              path: "employedByFamilyMember",
              name: "employmentandincome-employedByFamilyMember",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Primary"
              },
              component: () =>
                import("../components/employment/EmployedByFamilyMember.vue")
            },
            {
              path: "employedByPartyToTransaction",
              name: "employmentandincome-employedByPartyToTransaction",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Primary"
              },
              component: () =>
                import(
                  "../components/employment/EmployedByPartyToTransaction.vue"
                )
            },
            {
              path: "job-details",
              name: "employmentandincome-job-details",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Primary"
              },
              component: () => import("../components/employment/JobDetails.vue")
            },
            {
              path: "compensation-types",
              name: "employmentandincome-compensation-types",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Primary"
              },
              component: () =>
                import("../components/employment/CompensationTypes.vue")
            },
            {
              path: "compensation-details",
              name: "employmentandincome-compensation-details",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Primary"
              },
              component: () =>
                import("../components/employment/CompensationDetails.vue")
            },
            {
              path: "previous-employment",
              name: "employmentandincome-previous-employment",
              meta: { title: "Employment & Income" },
              component: () =>
                import("../components/employment/PrevEmployment.vue")
            },
            {
              path: "previous-position-title",
              name: "employmentandincome-previous-position-title",
              meta: {
                title: "Employment & Income",
                status: "Previous",
                classification: "Primary"
              },
              component: () =>
                import("../components/employment/PositionTitle.vue")
            },
            {
              path: "previous-compensation-details",
              name: "employmentandincome-previous-compensation-details",
              meta: {
                title: "Employment & Income",
                status: "Previous",
                classification: "Primary"
              },
              component: () =>
                import("../components/employment/PreviousCompensation.vue")
            },
            {
              path: "previous-employment-details",
              name: "employmentandincome-previous-employment-details",
              meta: { title: "Employment & Income" },
              component: () =>
                import("../components/employment/PrevEmploymentDetails.vue")
            },
            {
              path: "additional-employment",
              name: "employmentandincome-additional-employment",
              meta: { title: "Employment & Income" },
              component: () =>
                import("../components/employment/AdditionalEmployment.vue")
            },
            {
              path: "additional-employment-type",
              name: "employmentandincome-additional-employment-type",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Secondary"
              },
              component: () =>
                import("../components/employment/EmploymentType.vue")
            },
            {
              path: "additional-employment-details",
              name: "employmentandincome-additional-employment-details",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Secondary"
              },
              component: () => import("../components/employment/JobDetails.vue")
            },
            {
              path: "additional-worknumber",
              name: "employmentandincome-additional-worknumber",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Secondary"
              },
              component: () => import("../components/employment/WorkNumber.vue")
            },
            {
              path: "additional-partytotransaction",
              name: "employmentandincome-additional-partytotransaction",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Secondary"
              },
              component: () => import("../components/employment/PartyToTransaction.vue")
            },
            {
              path: "additional-ownership-percentage",
              name: "employmentandincome-additional-ownership-percentage",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Secondary"
              },
              component: () =>
                import("../components/employment/OwnershipPercentage.vue")
            },
            {
              path: "additional-position-title",
              name: "employmentandincome-additional-position-title",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Secondary"
              },
              component: () =>
                import("../components/employment/PositionTitle.vue")
            },
            {
              path: "additional-contact-details",
              name: "employmentandincome-additional-contact-details",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Secondary"
              },
              component: () =>
                import("../components/employment/ContactDetails.vue")
            },
            {
              path: "additional-compensation-types",
              name: "employmentandincome-additional-compensation-types",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Secondary"
              },
              component: () =>
                import("../components/employment/CompensationTypes.vue")
            },
            {
              path: "additional-compensation-details",
              name: "employmentandincome-additional-compensation-details",
              meta: {
                title: "Employment & Income",
                status: "Current",
                classification: "Secondary"
              },
              component: () =>
                import("../components/employment/CompensationDetails.vue")
            },
            {
              path: "other-income",
              name: "employmentandincome-other-income",
              meta: { title: "Employment & Income" },
              component: () =>
                import("../components/employment/OtherIncomeSources.vue")
            },
            {
              path: "other-income-details",
              name: "employmentandincome-other-income-details",
              meta: { title: "Employment & Income" },
              component: () => import("../components/employment/OtherIncome.vue")
            },
            {
              path: "review",
              name: "employmentandincome-review",
              meta: { title: "Employment & Income" },
              component: () => import("../components/employment/Review.vue")
            },
            {
              path: "summary",
              name: "employmentandincome-summary",
              meta: {
                title: "Employment & Income",
                isUserInfo: true,
                sideInfo: "employment"
              },
              component: () => import("../components/employment/Summary.vue")
            }
          ]
        },
        {
          path: "/declarations",
          component: Declarations,
          children: [
            {
              path: "",
              name: "declarations",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/Main.vue")
            },
            {
              path: "_1",
              name: "declarations-1",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_1.vue")
            },
            {
              path: "_2",
              name: "declarations-2",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_2.vue")
            },
            {
              path: "_3",
              name: "declarations-3",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_3.vue")
            },
            {
              path: "_4",
              name: "declarations-4",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_4.vue")
            },
            {
              path: "_5",
              name: "declarations-5",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_5.vue")
            },
            {
              path: "_6",
              name: "declarations-6",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_6.vue")
            },
            {
              path: "_7",
              name: "declarations-7",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_7.vue")
            },
            {
              path: "_8",
              name: "declarations-8",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_8.vue")
            },
            {
              path: "_9",
              name: "declarations-9",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_9.vue")
            },
            {
              path: "_10",
              name: "declarations-10",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_10.vue")
            },
            {
              path: "_11",
              name: "declarations-11",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_11.vue")
            },
            {
              path: "_12",
              name: "declarations-12",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_12.vue")
            },
            {
              path: "_13",
              name: "declarations-13",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_13.vue")
            },
            {
              path: "_14",
              name: "declarations-14",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_14.vue")
            },
            {
              path: "_15",
              name: "declarations-15",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_15.vue")
            },
            {
              path: "_16",
              name: "declarations-16",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_16.vue")
            },
            {
              path: "_17",
              name: "declarations-17",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_17.vue")
            },
            {
              path: "_18",
              name: "declarations-18",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/_18.vue")
            },
            {
              path: "review",
              name: "declarations-review",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/Review.vue")
            },
            {
              path: "summary",
              name: "declarations-summary",
              meta: { title: "Declarations" },
              component: () => import("../components/declarations/Summary.vue")
            },
            {
              path: "demographics",
              component: () =>
                import("../components/declarations/demographics/Main.vue"),
              meta: { title: "Declarations" },
              name: "declarations-demographics"
            }
          ]
        },
        {
          path: "documents",
          component: Documents,
          children: [
            {
              path: "",
              name: "documents",
              meta: { title: "Documents" },
              component: () => import("../components/documents/Main.vue")
            },
            {
              path: "upload",
              name: "documents-upload",
              meta: { title: "Documents" },
              component: () => import("../components/documents/Documents.vue")
            }
          ]
        },
        {
          path: "ratesandoffers",
          component: RatesOffers,
          children: [
            {
              path: "",
              name: "ratesandoffers",
              component: () => import("../components/rates-offers/Main.vue")
            },
             {
              path: "rate-type",
              name: "ratesandoffers-rate-type",
              component: () => import("../components/rates-offers/RateType.vue")
            },
            {
              path: "fixed-repayment-terms",
              name: "ratesandoffers-fixed-repayment-terms",
              component: () => import("../components/rates-offers/FixedRepaymentTerms.vue")
            },
            {
              path: "arm-repayment-terms",
              name: "ratesandoffers-arm-repayment-terms",
              component: () => import("../components/rates-offers/ArmRepaymentTerms.vue")
            },
            {
              path: "monthly-payment",
              name: "ratesandoffers-monthly-payment",
              component: () => import("../components/rates-offers/MonthlyPayment.vue")
            },
            {
              path: "product-list",
              name: "ratesandoffers-product-list",
              component: () => import("../components/rates-offers/ProductList.vue")
            },
            {
              path: "desired-rate",
              name: "ratesandoffers-desired-rate",
              component: () => import("../components/rates-offers/DesiredRate.vue")
            },
            {
              path: "review",
              name: "ratesandoffers-review",
              component: () => import("../components/rates-offers/Review.vue")
            },
          ],
        },
        {
          path: "review",
          component: Review,
          children: [
            {
              path: "",
              name: "review",
              meta: {
                title: "Review your Loan Details"
              },
              component: () => import("../components/review/Main.vue")
            },
            {
              path: "details",
              name: "review-details",
              meta: {
                title: "Review your Loan Details"
              },
              component: () => import("../components/review/Details.vue")
            }
          ]
        },
        {
          path: "underwriting",
          component: Approved,
          children: [
            {
              path: "",
              name: "underwriting",
              meta: {
                title: "Underwriting Decision",
                sideInfo: "underwriting"
              },
              component: () => import("../components/Underwriting.vue")
            }
          ]
        },
        {
          path: "approved",
          component: Approved,
          children: [
            {
              path: "",
              name: "approved",
              meta: { title: "Underwriting Decision", sideInfo: "approved" },
              component: () => import("../components/ApprovedMain.vue")
            }
          ]
        },
        {
          path: "error",
          component: Approved,
          children: [
            {
              path: "",
              name: "error",
              meta: { title: "Underwriting Decision", sideInfo: "error" },
              component: () => import("../components/ApproveErrorMain.vue")
            }
          ]
        },
        {
          path: "lenderloaninfo",
          name: "lenderloaninfo",
          component: LenderLoanInfo
        },
        {
          path: "loandetails",
          name: "loandetails",
          component: LoanDetails
        },
        {
          path: "application-complete",
          name: "application-complete",
          component: ApplicationComplete
        },
      ],
      beforeEnter: async (to, from, next) => {
        await validateTokenMiddleware(to, from, next, router)
      }
    },
    {
      path: "/loan-tech-info/:loanId",
      name: "loan-tech-info",
      component: () => import("../components/LoanTechInfo.vue")
    },
    {
      path: '/sign-in',
      component: () => import('../views/Auth.vue'),
      meta: {
        requiresAuth: false
      },
      children: [
        {
          path: '',
          name: 'sign-in-form',
          component: () => import('../components/auth/SignIn.vue')
        },
        {
          path: '/sign-up',
          name: 'sign-up',
          component: () => import('../components/auth/SignUp.vue')
        },
        {
          path: '/recover-password',
          name: 'recover-password',
          component: () => import('../components/auth/RecoverPassword.vue')
        },
        {
          path: "/reset-password",
          name: "reset-password",
          component: () => import("../components/auth/ResetPassword.vue")
        }
      ]
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/'
    }
  ]
})

router.beforeEach(authMiddleware)

router.afterEach((to) => {
  const { updateSectionAndPageData, setAppHistoryLength, getAppHistoryLength } = useGeneralStore()
  setAppHistoryLength(getAppHistoryLength() + 1);
  updateSectionAndPageData(to.path)
})

export default router
