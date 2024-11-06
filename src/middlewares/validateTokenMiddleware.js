import { useUserStore } from '../stores/userStore'
import {validationToken} from "../api/signIn";
import { useGeneralStore } from '../stores/generalStore';

const validateTokenMiddleware = async (to, from, next, router) => {
  const userStore = useUserStore()
  const generalStore = useGeneralStore();
  const loginNames = ['sign-in-form', 'sign-up', 'recover-password', 'reset-password']
  if (loginNames.indexOf(from.name) !== -1) {
    next()
  } else {
    const token = localStorage.getItem('borrowerToken')
    if (userStore.getCurrentUser() == null) {
      try {
        var response = await validationToken()
        const userInfo = { ...response, token };
        userStore.saveUserInfo(userInfo);
        if (
          response && response.keyIdentifier
        ) {

          await generalStore.getLoanById(
            response.keyIdentifier
          );
          if (userStore.getCurrentUser().userTypeId != 1) {
            if (generalStore.getCurrentLoan.StatusId > 7) {
              next({ path: "/review" });
              return;
            }
            if (generalStore.getCurrentLoan.StatusId <= 6) {
              if (
                to.path.startsWith("/review") ||
                to.path.startsWith("/documents")
              ) {
                next({ path: "/application-complete" });
                return;
              }
            }
          }
        }
        if (to.name === "home") {
          let nextPath = router.methods.getNextPath(0, 0);
          next({ path: nextPath });
        } 
        else next();
      } catch (err) {
        localStorage.removeItem('borrowerToken')
        const redirect = to.path !== '/' && to.path !== '' ? to.path : null
        next({ path: '/sign-in', query: { redirect } })
      }
    } else if (to.name === 'home') next({ name: 'borrowers' })
    else {
      const redirect = to.path !== '/' && to.path !== '' ? to.path : null
      next({ path: '/sign-in', query: { redirect } })
    }
  }
}

export default validateTokenMiddleware
