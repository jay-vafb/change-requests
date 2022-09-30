<template>
  <router-view></router-view>
</template>

<script>
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "@firebase/auth";
import { supabase } from "./supabase";
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

    async function getUserRole(user) {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_role")
          .match({ username: user.email });

        if (error) throw error;
        store.userRole = data[0] ? data[0].user_role : "other";
        return data[0] ? data[0].user_role : "other";
      } catch (error) {
        console.log(error.message);
      }
    }

    router.beforeEach(async (to, from) => {
      const user = await getCurrentUser();
      const userRole = await getUserRole(user);

      // to.path must be checked to prevent infinite redirection
      if (
        !user &&
        to.path.includes("/viewChangeRequest") &&
        !from.path.includes("/viewChangeRequest")
      ) {
        // email link clicked
        return { path: "/auth", query: { redirect: to.path } };
      } else if (
        !user &&
        to.path !== "/auth" &&
        to.path !== "/register" &&
        to.path !== "/forgotPassword" &&
        to.path !== "/verifyEmail" &&
        to.path !== "/resetPassword"
      ) {
        return { path: "/auth" };
      } else if (
        user &&
        (to.path === "/auth" ||
          to.path === "/register" ||
          to.path === "/forgotPassword" ||
          to.path === "/verifyEmail" ||
          to.path === "/resetPassword")
      ) {
        return { path: "/" };
      } else if (user && userRole !== "admin" && to.path === "/admin") {
        return { path: "/" };
      }
    });
  },
};
</script>
