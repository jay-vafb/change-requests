import MainLayout from "../layouts/MainLayout.vue";
import HomePage from "../pages/HomePage.vue";
import ChangeRequestFormPage from "../pages/ChangeRequestFormPage.vue";
import ListChangeRequestsPage from "../pages/ListChangeRequestsPage.vue";
import ViewChangeRequestPage from "../pages/ViewChangeRequestPage.vue";
import StatisticsPage from "../pages/StatisticsPage.vue";
import RoleAdministrationPage from "../pages/RoleAdministrationPage.vue";
import AuthenticationLayout from "../layouts/AuthenticationLayout.vue";
import SignInPage from "../pages/SignInPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import ResetPasswordPage from "../pages/ResetPasswordPage.vue";
import ErrorNotFound from "../pages/ErrorNotFound.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: HomePage,
        meta: { title: "Home" },
      },
      {
        path: "/changeRequestForm",
        component: ChangeRequestFormPage,
        meta: { title: "Change request form" },
      },
      {
        path: "/changeRequests",
        component: ListChangeRequestsPage,
        meta: { title: "Change requests" },
      },
      {
        path: "/viewChangeRequest/:id",
        component: ViewChangeRequestPage,
        meta: { title: "View change request" },
      },
      {
        path: "/statistics",
        component: StatisticsPage,
        meta: { title: "Statistics" },
      },
      {
        path: "/admin",
        component: RoleAdministrationPage,
        meta: { title: "Role administration" },
      },
    ],
  },

  {
    path: "/auth",
    component: AuthenticationLayout,
    children: [
      {
        path: "",
        component: SignInPage,
      },
      {
        path: "/register",
        component: RegisterPage,
      },
      {
        path: "/forgotPassword",
        component: ResetPasswordPage,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: ErrorNotFound,
  },
];

export default routes;
