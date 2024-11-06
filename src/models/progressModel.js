import { BorrowerSections } from "./borrowerSections";

const Sections = {
  Borrowers: [],
  SharedSections: [
    {
      Name: "LoanAndProperty",
      Status: "NotStarted",
      CompletionPercentage: 0,
      LastPage: "Main",
      Order: 2,
      Pages: [
        {
          Name: "Main",
          RouteName: "loanandproperty",
          Order: 1,
          IsCompleted: false,
          IsRequired: false
        },
        {
          Name: "FoundProperty",
          RouteName: "loanandproperty-found-property",
          Order: 2,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "PropertyAddress",
          RouteName: "loanandproperty-found-property-address",
          Order: 3,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "SalesContract",
          RouteName: "loanandproperty-sales-contract",
          Order: 4,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "PurchasePrice",
          RouteName: "loanandproperty-purchase-price",
          Order: 5,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "EstimatedValue",
          RouteName: "loanandproperty-estimated-value",
          Order: 6,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "PropertyDetails",
          RouteName: "loanandproperty-property-details",
          Order: 7,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "HousingExpenses",
          RouteName: "loanandproperty-housing-expenses",
          Order: 8,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "Occupancy",
          RouteName: "loanandproperty-occupancy",
          Order: 9,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "Downpayment",
          RouteName: "loanandproperty-downpayment",
          Order: 10,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "AdditionalMortgages",
          RouteName: "loanandproperty-additional-mortgages",
          Order: 11,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "AdditionalMortgageDetails",
          RouteName: "loanandproperty-additional-mortgage-details",
          Order: 12,
          IsCompleted: false,
          IsRequired: true
        },
        {
          Name: "RentalIncome",
          RouteName: "loanandproperty-rental-income",
          Order: 13,
          IsCompleted: false,
          IsRequired: true
        },
      ]
    },
    {
      Name: "Documents",
      Status: "NotStarted",
      CompletionPercentage: 0,
      LastPage: "Summary",
      Order: 8,
      Pages: [
        {
          Name: "Main",
          RouteName: "documents",
          Order: 1,
          IsCompleted: false,
          IsRequired: false
        },
        {
          Name: "Upload",
          RouteName: "documents-upload",
          Order: 2,
          IsCompleted: false,
          IsRequired: false
        }
      ]
    },
    {
      Name: "Review",
      Status: "NotStarted",
      CompletionPercentage: 0,
      LastPage: "Upload",
      Order: 9,
      Pages: [
        {
          Name: "Main",
          RouteName: "review",
          Order: 1,
          IsCompleted: false,
          IsRequired: false
        },
        {
          Name: "Details",
          RouteName: "review-details",
          Order: 2,
          IsCompleted: false,
          IsRequired: false
        }
      ]
    }
  ]
};

class Progress {
  constructor(borrowers) {
    this.borrowers = borrowers;
  }

  getDefaultModel() {
    const Borrowers = this.borrowers.map(item => {
      item = { Id: item.Id, BorrowerSections };
      return item;
    });
    return {
      ...Sections,
      Borrowers
    };
  }

  getSharedSections() {
    return JSON.parse(JSON.stringify(Sections.SharedSections));
  }
}

export default Progress;
