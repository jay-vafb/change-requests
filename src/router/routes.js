const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/HomePage.vue"),
        meta: { title: "Home" },
      },
      {
        path: "/changeRequestForm",
        component: () => import("pages/ChangeRequestFormPage.vue"),
        meta: { title: "Change request form" },
      },
      {
        path: "/changeRequests",
        component: () => import("pages/ListChangeRequestsPage.vue"),
        meta: { title: "Change requests" },
      },
      {
        path: "/viewChangeRequest/:id",
        component: () => import("pages/ViewChangeRequestPage.vue"),
        meta: { title: "View change request" },
      },
      {
        path: "/statistics",
        component: () => import("pages/StatisticsPage.vue"),
        meta: { title: "Statistics" },
      },
      {
        path: "/admin",
        component: () => import("pages/UserAdministrationPage.vue"),
        meta: { title: "User administration" },
      },
    ],
  },

  {
    path: "/auth",
    component: () => import("layouts/BasicLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/auth/SignInPage.vue"),
      },
      {
        path: "/register",
        component: () => import("pages/auth/RegisterPage.vue"),
      },
      {
        path: "/forgotPassword",
        component: () => import("pages/auth/ForgotPasswordPage.vue"),
      },
      {
        path: "/verifyEmail",
        component: () => import("pages/acctmgmt/EmailVerificationPage.vue"),
      },
      {
        path: "/resetPassword",
        component: () => import("pages/acctmgmt/PasswordResetPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
