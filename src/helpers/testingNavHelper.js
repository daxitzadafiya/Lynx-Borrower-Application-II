import Progress from "@/models/progressModel";
import { BorrowerSections } from "@/models/borrowerSections";

const sharedSections = new Progress().getSharedSections();
const allSections = [...BorrowerSections, ...sharedSections].sort((a, b) =>
  a.Order > b.Order ? 1 : -1
);
const withoutSummary = [
  "Demographics",
  "DetailsOfTransaction",
  "Documents",
  "Review",
  "RatesAndOffers"
];

const navItems = getNavItems(allSections);

function getNavItems(arr) {
  return arr.reduce((acc, cur) => {
    let item = {
      title: cur.Name
    };
    if (cur.Pages) {
      item.items = getNavItems(cur.Pages);
      if (withoutSummary.indexOf(cur.Name) === -1) {
        item.items.push({
          route: `${cur.Name.toLowerCase()}-summary`,
          title: "Summary"
        });
      }
    } else {
      item.route = cur.RouteName;
    }
    acc.push(item);
    return acc;
  }, []);
}

export default navItems;
