import { useUserStore } from "../stores/userStore";
import { useGeneralStore } from "../stores/generalStore";
import { useBrandingStore } from "../stores/brandingStore";

const authMiddleware = async (
  to,
  from,
  next
) => {
  const { hosted, loanId, token } = to.query;

  const userStore = useUserStore();
  const generalStore = useGeneralStore();
  const brandingStore = useBrandingStore();
  const loginNames = [
    "sign-in-form",
    "sign-up",
    "recover-password",
    "reset-password"
  ];
  let borrowerToken = localStorage.getItem("borrowerToken");

  var userTypeId = null;

  if (userStore.getCurrentUser && userStore.getCurrentUser.userTypeId) {
    userTypeId = userStore.getCurrentUser.userTypeId;
  }

  if (hosted) {
    generalStore.setHostedData({ token, loanId, isHostedMode: true })
    borrowerToken = token;
    localStorage.setItem("borrowerToken", borrowerToken);
  }

  if (
    brandingStore.getIsHostedMode() &&
    !generalStore.getIsTestingNav &&
    to.name !== "home"
  ) {
    return handleRouting(brandingStore.brandingSections, to.name, next);
  }
  if (loginNames.indexOf(to?.name) === -1 && !borrowerToken) {
    const redirect = to.path !== "/" && to.path !== "" ? to.path : null;
    parent.postMessage({ expired: true }, "*");
    (
    to.name === "sign-up" ||
    to.name === "recover-password" ||
    to.name === "reset-password" ||
    to.name === "mobile-upload")
      ? next()
      : next({ path: "/sign-in", query: { redirect }});
  }
  if (userTypeId != 1) {
    var parentRoute = to.matched[1];
    if (
      generalStore.currentLoan != null &&
      generalStore.currentLoan.StatusId > 7 &&
      (parentRoute == null ||
        (parentRoute.path !== "/application-complete" &&
          parentRoute.path !== "/approved" &&
          parentRoute.path !== "/error"))
    ) {
      return false;
    }
    if (
      parentRoute != null &&
      (parentRoute.path == "/application-complete" ||
        parentRoute.path == "/approved" ||
        parentRoute.path == "/error" ||
        to.name == "borrowers")
    ) {
      generalStore.setShowNavigation(false);
      generalStore.setShowAnimatedNavigation(false);
    } else if (parentRoute != null) {
      generalStore.setShowNavigation(true);
      generalStore.setShowAnimatedNavigation(false);

    }
  } else if (userTypeId == 1) {
    generalStore.setShowNavigation(true);
    generalStore.setShowAnimatedNavigation(false);
  }
  if (to.name == "borrowers"){
    generalStore.setShowAnimatedNavigation(true);
  }

  next();
}

export default authMiddleware
