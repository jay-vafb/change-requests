<template>
  <router-view></router-view>
</template>

<script>
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebaseConfig";
import { store } from "./store";

export default {
  name: "App",

  setup() {
    const router = useRouter();

    // refactored from: https://stackoverflow.com/questions/72734392/use-firebase-auth-with-vue-3-route-guard
    async function getCurrentUser() {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            store.user = user;
            unsubscribe();
            resolve(user);
          },
          reject
        );
      });
    }

    router.beforeEach(async (to, from) => {
      const user = await getCurrentUser();

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
