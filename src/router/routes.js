import MainLayout from "../layouts/MainLayout.vue";
import HomePage from "../pages/HomePage.vue";
import ChangeRequestFormPage from "../pages/ChangeRequestFormPage.vue";
import ListChangeRequestsPage from "../pages/ListChangeRequestsPage.vue";
import ViewChangeRequestPage from "../pages/ViewChangeRequestPage.vue";
import StatisticsPage from "../pages/StatisticsPage.vue";
import UserAdministrationPage from "../pages/UserAdministrationPage.vue";
import BasicLayout from "../layouts/BasicLayout.vue";
import SignInPage from "../pages/auth/SignInPage.vue";
import RegisterPage from "../pages/auth/RegisterPage.vue";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.vue";
import EmailVerificationPage from "../pages/acctmgmt/EmailVerificationPage.vue";
import PasswordResetPage from "../pages/acctmgmt/PasswordResetPage.vue";
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
        component: UserAdministrationPage,
        meta: { title: "User administration" },
      },
    ],
  },

  {
    path: "/auth",
    component: BasicLayout,
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
        component: ForgotPasswordPage,
      },
      {
        path: "/verifyEmail",
        component: EmailVerificationPage,
      },
      {
        path: "/resetPassword",
        component: PasswordResetPage,
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
