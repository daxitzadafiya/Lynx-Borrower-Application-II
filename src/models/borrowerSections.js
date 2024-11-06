export const BorrowerSections = [
  {
    Name: "Borrowers",
    Status: "NotStarted",
    CompletionPercentage: 0,
    LastPage: "Main",
    Order: 1,
    Pages: [
      {
        Name: "Main",
        RouteName: "borrowers",
        Order: 1,
        IsCompleted: false,
        IsRequired: false
      },
      {
        Name: "Start",
        RouteName: "borrowers-start",
        Order: 2,
        IsCompleted: false,
        IsRequired: false
      },
      {
        Name: "Name",
        RouteName: "borrowers-name",
        Order: 3,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Alias",
        RouteName: "borrowers-alias",
        Order: 4,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Email",
        RouteName: "borrowers-email",
        Order: 5,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "BirthDate",
        RouteName: "borrowers-birth-date",
        Order: 6,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Contact",
        RouteName: "borrowers-contact",
        Order: 7,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Citizenship",
        RouteName: "borrowers-citizenship",
        Order: 8,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "MaritalStatus",
        RouteName: "borrowers-marital-status",
        Order: 9,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "UnmarriedAddendum",
        RouteName: "borrowers-unmarried-addendum",
        Order: 10,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Dependents",
        RouteName: "borrowers-dependents",
        Order: 11,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "MilitaryService",
        RouteName: "borrowers-military-service",
        Order: 12,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "MilitaryServiceDetails",
        RouteName: "borrowers-military-service-details",
        Order: 13,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ResidencyAddress",
        RouteName: "borrowers-residency-address",
        Order: 14,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ResidencyMailing",
        RouteName: "borrowers-residency-mailing",
        Order: 15,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ResidencyLength",
        RouteName: "borrowers-residency-length",
        Order: 16,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ResidencyLivingStatus",
        RouteName: "borrowers-living-status",
        Order: 17,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ResidencyRentExpense",
        RouteName: "borrowers-rent-expense",
        Order: 18,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PriorResidence",
        RouteName: "borrowers-prior-residence",
        Order: 19,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PriorLivingStatus",
        RouteName: "borrowers-prior-living-status",
        Order: 20,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PriorRentExpense",
        RouteName: "borrowers-prior-rent-expense",
        Order: 21,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "InviteCoBorrower",
        RouteName: "invite-co-borrower",
        Order: 22,
        IsCompleted: false,
        IsRequired: true
      }
    ]
  },
  {
    Name: "Credit",
    Status: "NotStarted",
    CompletionPercentage: 0,
    LastPage: "Main",
    Order: 3,
    Pages: [
      {
        Name: "Main",
        RouteName: "credit",
        Order: 1,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Order",
        RouteName: "credit-order",
        Order: 2,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Response",
        RouteName: "credit-response",
        Order: 3,
        IsCompleted: false,
        IsRequired: false
      },
      {
        Name: "ScoreAndAccounts",
        RouteName: "credit-score-and-accounts",
        Order: 4,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "LiabilitiesReview",
        RouteName: "credit-liabilities-review",
        Order: 5,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "DerogatoryItems",
        RouteName: "credit-derogatory-items",
        Order: 6,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "OtherLiabilities",
        RouteName: "credit-other-liabilities",
        Order: 7,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "OtherLiabilityDetails",
        RouteName: "credit-other-liabilities-details",
        Order: 8,
        IsCompleted: false,
        IsRequired: true
      }
    ]
  },
  {
    Name: "AccountsAndAssets",
    Status: "NotStarted",
    CompletionPercentage: 0,
    LastPage: "Main",
    Order: 4,
    Pages: [
      {
        Name: "Main",
        RouteName: "accountsandassets",
        Order: 1,
        IsCompleted: false,
        IsRequired: false
      },
      {
        Name: "AccountsTypes",
        RouteName: "accountsandassets-account-types",
        Order: 2,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AccountDetails",
        RouteName: "accountsandassets-account-details",
        Order: 3,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "OtherAssets",
        RouteName: "accountsandassets-other-assets",
        Order: 4,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "OtherAssetDetails",
        RouteName: "accountsandassets-other-asset-details",
        Order: 5,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "RequiredDeposit",
        RouteName: "accountsandassets-required-deposit",
        Order: 6,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "DepositsDetails",
        RouteName: "accountsandassets-deposits-details",
        Order: 7,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ClosingCosts",
        RouteName: "accountsandassets-closing-costs",
        Order: 8,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PartiesCredit",
        RouteName: "accountsandassets-parties-credit",
        Order: 9,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "LoanGifts",
        RouteName: "accountsandassets-loan-gifts",
        Order: 10,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "LoanGiftsTypes",
        RouteName: "accountsandassets-loan-gifts-types",
        Order: 11,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "LoanGiftsDetails",
        RouteName: "accountsandassets-loan-gifts-details",
        Order: 12,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "LoanGrants",
        RouteName: "accountsandassets-loan-grants",
        Order: 13,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "LoanGrantsDetails",
        RouteName: "accountsandassets-loan-grants-details",
        Order: 14,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PurchaseCredits",
        RouteName: "accountsandassets-purchase-credits",
        Order: 15,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PurchaseCreditTypes",
        RouteName: "accountsandassets-purchase-credit-types",
        Order: 16,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PurchaseCreditsDetails",
        RouteName: "accountsandassets-purchase-credits-details",
        Order: 17,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "RealEstate",
        RouteName: "accountsandassets-real-estate",
        Order: 18,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Address",
        RouteName: "accountsandassets-address",
        Order: 19,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PropertyStatus",
        RouteName: "accountsandassets-property-status",
        Order: 20,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Value",
        RouteName: "accountsandassets-value",
        Order: 21,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ClosingDate",
        RouteName: "accountsandassets-closing-date",
        Order: 22,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Expenses",
        RouteName: "accountsandassets-expenses",
        Order: 23,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ExpenseDetails",
        RouteName: "accountsandassets-expenses-details",
        Order: 24,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "RentalIncome",
        RouteName: "accountsandassets-rental-income",
        Order: 25,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "UsageTypes",
        RouteName: "accountsandassets-usage-types",
        Order: 26,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PropertyMortgage",
        RouteName: "accountsandassets-property-mortgage",
        Order: 27,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "MortgageDetails",
        RouteName: "accountsandassets-mortgage-details",
        Order: 28,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "MortgageDetailsReview",
        RouteName: "accountsandassets-mortgage-details-review",
        Order: 29,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Additional",
        RouteName: "accountsandassets-additional-real-estate",
        Order: 30,
        IsCompleted: false,
        IsRequired: true
      }
    ]
  },
  {
    Name: "EmploymentAndIncome",
    Status: "NotStarted",
    CompletionPercentage: 0,
    LastPage: "Main",
    Order: 5,
    Pages: [
      {
        Name: "Main",
        RouteName: "employmentandincome",
        Order: 1,
        IsCompleted: false,
        IsRequired: false
      },
      {
        Name: "EmploymentType",
        RouteName: "employmentandincome-employment-type",
        Order: 2,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "WorkNumber",
        RouteName: "employmentandincome-worknumber",
        Order: 3,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "OwnershipPercentage",
        RouteName: "employmentandincome-ownership-percentage",
        Order: 4,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "EmployedByFamilyMember",
        RouteName: "employmentandincome-employedByFamilyMember",
        Order: 5,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "EmployedByPartyToTransaction",
        RouteName: "employmentandincome-employedByPartyToTransaction",
        Order: 6,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "JobDetails",
        RouteName: "employmentandincome-job-details",
        Order: 7,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "CompensationTypes",
        RouteName: "employmentandincome-compensation-types",
        Order: 8,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "CompensationDetails",
        RouteName: "employmentandincome-compensation-details",
        Order: 9,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PrevEmployment",
        RouteName: "employmentandincome-previous-employment",
        Order: 10,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PrevEmploymentPosition",
        RouteName: "employmentandincome-previous-position-title",
        Order: 11,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "PrevEmploymentCompensation",
        RouteName: "employmentandincome-previous-compensation-details",
        Order: 12,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AdditionalEmployment",
        RouteName: "employmentandincome-additional-employment",
        Order: 13,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AdditionalEmploymenType",
        RouteName: "employmentandincome-additional-employment-type",
        Order: 14,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AdditionalEmploymentDetails",
        RouteName: "employmentandincome-additional-employment-details",
        Order: 15,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AdditionalPartyToTransaction",
        RouteName: "employmentandincome-additional-partytotransaction",
        Order: 16,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AdditionalOwnershipPercentage",
        RouteName: "employmentandincome-additional-ownership-percentage",
        Order: 17,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AdditionalPositionTitle",
        RouteName: "employmentandincome-additional-position-title",
        Order: 18,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AdditionalContactDetails",
        RouteName: "employmentandincome-additional-contact-details",
        Order: 19,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AdditionalCompensationTypes",
        RouteName: "employmentandincome-additional-compensation-types",
        Order: 20,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "AdditionalCompensationDetails",
        RouteName: "employmentandincome-additional-compensation-details",
        Order: 21,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "OtherIncomeSources",
        RouteName: "employmentandincome-other-income",
        Order: 22,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "OtherIncome",
        RouteName: "employmentandincome-other-income-details",
        Order: 23,
        IsCompleted: false,
        IsRequired: true
      }
    ]
  },
  {
    Name: "Declarations",
    Status: "NotStarted",
    CompletionPercentage: 0,
    LastPage: "Main",
    Order: 6,
    Pages: [
      {
        Name: "Main",
        RouteName: "declarations",
        Order: 1,
        IsCompleted: false,
        IsRequired: false
      },
      {
        Name: "Declarations1",
        RouteName: "declarations-1",
        Order: 2,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations2",
        RouteName: "declarations-2",
        Order: 3,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations3",
        RouteName: "declarations-3",
        Order: 4,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations4",
        RouteName: "declarations-4",
        Order: 5,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations5",
        RouteName: "declarations-5",
        Order: 6,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations6",
        RouteName: "declarations-6",
        Order: 7,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations7",
        RouteName: "declarations-7",
        Order: 8,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations8",
        RouteName: "declarations-8",
        Order: 9,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations9",
        RouteName: "declarations-9",
        Order: 10,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations10",
        RouteName: "declarations-10",
        Order: 11,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations11",
        RouteName: "declarations-11",
        Order: 12,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations12",
        RouteName: "declarations-12",
        Order: 13,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations13",
        RouteName: "declarations-13",
        Order: 14,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations14",
        RouteName: "declarations-14",
        Order: 15,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations15",
        RouteName: "declarations-15",
        Order: 16,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations16",
        RouteName: "declarations-16",
        Order: 17,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations17",
        RouteName: "declarations-17",
        Order: 18,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Declarations18",
        RouteName: "declarations-18",
        Order: 19,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Demographics",
        RouteName: "declarations-demographics",
        Order: 21,
        IsCompleted: false,
        IsRequired: true
      }
    ]
  },
  {
    Name: "RatesAndOffers",
    Status: "NotStarted",
    CompletionPercentage: 0,
    LastPage: "Main",
    Order: 8,
    Pages: [
      {
        Name: "Main",
        RouteName: "ratesandoffers",
        Order: 1,
        IsCompleted: false,
        IsRequired: false
      },
      {
        Name: "RateType",
        RouteName: "ratesandoffers-rate-type",
        Order: 2,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "FixedRepaymentTerms",
        RouteName: "ratesandoffers-fixed-repayment-terms",
        Order: 3,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ArmRepaymentTerms",
        RouteName: "ratesandoffers-arm-repayment-terms",
        Order: 3,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "MonthlyPayment",
        RouteName: "ratesandoffers-monthly-payment",
        Order: 4,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "ProductList",
        RouteName: "ratesandoffers-product-list",
        Order: 5,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "DesiredRate",
        RouteName: "ratesandoffers-desired-rate",
        Order: 6,
        IsCompleted: false,
        IsRequired: true
      },
      {
        Name: "Review",
        RouteName: "ratesandoffers-review",
        Order: 7,
        IsCompleted: false,
        IsRequired: true
      }
    ]
  }
];
