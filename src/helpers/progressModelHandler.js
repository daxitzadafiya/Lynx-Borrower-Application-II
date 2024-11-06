import Progress from "@/models/progressModel";

const generalSections = ["loanandproperty", "detailsoftransaction", "review"];
const withoutSummary = ["demographics", "detailsoftransaction"];

function getCompletionPercentage(pages) {
  const filtered = pages.filter(item => item.IsCompleted);
  return Math.floor((filtered.length / pages.length) * 100);
}

function getCompletedPages(pages, lastPage) {
  const lastPageIndex = pages.findIndex(item => item.Name === lastPage);
  return pages.map(item => {
    item.IsCompleted =
      lastPage.toLowerCase() === "review" ||
      lastPage.toLowerCase() === "summary"
        ? true
        : item.Order < pages[lastPageIndex].Order;
    return item;
  });
}

function updatedReviewSection(section) {
  const Pages = section.Pages.map(item => {
    if (item.Name === "Details") {
      item.IsCompleted = true;
    }
    return item;
  });
  return {
    ...section,
    Status: "Completed",
    CompletionPercentage: 100,
    LastPage: "Details",
    Pages
  };
}

function updateUnshared(progressModel, routeName, borrowerId) {
  let copy = JSON.parse(JSON.stringify(progressModel));

  const borrowerIndex = copy.Borrowers.findIndex(
    item => item.Id === borrowerId
  );
  let { BorrowerSections } = copy.Borrowers[borrowerIndex];

  const [routeBase, pageName] = routeName.split("-");
  const sectionIndex = BorrowerSections.findIndex(
    item => item.Name.toLowerCase() === routeBase
  );

  let section = BorrowerSections[sectionIndex];

  const LastPage = section.Pages.find(item => item.RouteName === routeName);
  section.Pages = LastPage
    ? getCompletedPages(section.Pages, LastPage.Name)
    : getCompletedPages(section.Pages, pageName);

  const CompletionPercentage = getCompletionPercentage(section.Pages);

  BorrowerSections[sectionIndex] = {
    ...section,
    Status: CompletionPercentage == 100 ? "Completed" : "Started",
    CompletionPercentage,
    LastPage: LastPage ? LastPage.Name : section.LastPage
  };
  copy.Borrowers[borrowerIndex].BorrowerSections = BorrowerSections;

  localStorage.setItem("progressModel", JSON.stringify(copy));
}

function updateShared(progressModel, routeName, routeBase) {
  let copy = JSON.parse(JSON.stringify(progressModel));

  if (routeName !== "review-details") {
    const sectionIndex = copy.SharedSections.findIndex(
      item => item.Name.toLowerCase() === routeBase
    );
    let section = copy.SharedSections[sectionIndex];

    const pageName = routeName.split("-")[1];
    const LastPage = section.Pages.find(item => item.RouteName === routeName);
    section.Pages = LastPage
      ? getCompletedPages(section.Pages, LastPage.Name)
      : getCompletedPages(section.Pages, pageName);

    const CompletionPercentage = getCompletionPercentage(section.Pages);
    copy.SharedSections[sectionIndex] = {
      ...section,
      Status: CompletionPercentage == 100 ? "Completed" : "Started",
      CompletionPercentage,
      LastPage: LastPage ? LastPage.Name : section.LastPage
    };
  } else {
    copy.SharedSections = copy.SharedSections.map(item => {
      if (item.Name === "Review") {
        return updatedReviewSection(item);
      }
      return item;
    });
  }

  localStorage.setItem("progressModel", JSON.stringify(copy));
}

function getSplittedSections(progressModel, borrowerId) {
  let { Borrowers, SharedSections } = progressModel;
  Borrowers = Array.from(Borrowers);
  const individualSections = Borrowers.find(item => item.Id === borrowerId);
  const { BorrowerSections } = individualSections;
  return { BorrowerSections, SharedSections };
}

function getDestination(sections, routeName) {
  const routeBase = routeName.split("-")[0];
  const currentSection = sections.find(
    item => item.Name.toLowerCase() === routeBase
  );
  const sortedByOrder = currentSection.Pages.sort((a, b) =>
    a.Order > b.Order ? 1 : -1
  );
  const page = sortedByOrder.find(item => item.IsRequired && !item.IsCompleted);
  if (page) {
    return page.RouteName;
  }
  return withoutSummary.indexOf(routeBase) !== -1 || routeBase === "review"
    ? routeBase
    : `${routeBase}-summary`;
}

export default {
  setDefaultProgressModel(borrowers) {
    const pr = new Progress(borrowers);
    localStorage.setItem("progressModel", JSON.stringify(pr.getDefaultModel()));
  },
  setCurrentProgressModel(progressModel) {
    localStorage.setItem("progressModel", progressModel);
  },
  updateModel(progressModel, routeName, borrowerId) {
    const routeBase = routeName.split("-")[0];
    if (generalSections.indexOf(routeBase) === -1) {
      return updateUnshared(progressModel, routeName, borrowerId);
    }
    updateShared(progressModel, routeName, routeBase);
  },
  getRouteName(progressModel, borrowerId) {
    const { BorrowerSections, SharedSections } = getSplittedSections(
      progressModel,
      borrowerId
    );

    const allSections = [...BorrowerSections, ...SharedSections];
    const sortedByOrder = allSections.sort((a, b) =>
      a.Order > b.Order ? 1 : -1
    );

    const incompleted = sortedByOrder.find(
      item => item.CompletionPercentage < 100
    );
    if (incompleted) {
      const { Pages, LastPage } = incompleted;
      const maxOrder = Math.max(...Pages.map(item => item.Order));
      const lastPageIndex = Pages.findIndex(item => item.Name === LastPage);
      const routeBase = Pages[lastPageIndex].RouteName.split("-")[0];
      return maxOrder === Pages[lastPageIndex].Order &&
        maxOrder > 1 &&
        routeBase !== "review"
        ? `${routeBase.toLowerCase()}-summary`
        : Pages[lastPageIndex].RouteName;
    }
    return "underwriting";
  },
  getSectionRouteName(progressModel, routeName, borrowerId) {
    const { BorrowerSections, SharedSections } = getSplittedSections(
      progressModel,
      borrowerId
    );
    if (
      SharedSections.map(item => item.Name.toLowerCase()).indexOf(
        routeName.split("-")[0]
      ) === -1
    ) {
      return getDestination(BorrowerSections, routeName);
    }
    return getDestination(SharedSections, routeName);
  }
};
