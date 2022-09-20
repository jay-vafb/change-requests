<template>
  <router-view></router-view>
</template>

<script>
import { useRouter } from "vue-router";
import { store } from "./store";

export default {
  name: "App",

  setup() {
    const router = useRouter();

    router.beforeEach(async (to, from) => {
      const user = store.user.email;

      // to.path must be checked to prevent infinite redirection
      if (
        !user &&
        to.path.includes("/viewChangeRequest") &&
        !from.path.includes("/viewChangeRequest")
      ) {
        // email link clicked
        return { path: "/auth", query: { redirect: to.path } };
      } else if (!user && to.path !== "/auth" && to.path !== "/register") {
        return { path: "/auth" };
      } else if (user && (to.path === "/auth" || to.path === "/register")) {
        return { path: "/" };
      }
    });
  },
};
</script>
