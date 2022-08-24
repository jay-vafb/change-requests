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
    ],
  },

  {
    path: "/auth",
    component: () => import("layouts/AuthenticationLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/AuthenticationPage.vue"),
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
