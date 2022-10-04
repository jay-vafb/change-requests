<template>
  <router-view></router-view>
</template>

<script>
import { useRouter } from "vue-router";
import { onAuthStateChanged, verifyPasswordResetCode } from "@firebase/auth";
import { supabase } from "./supabase";
import { auth } from "./firebaseConfig";
import { store } from "./store";
import { useQuasar } from "quasar";
import { showErrorMessage } from "./logger";

export default {
  name: "App",

  setup() {
    const $q = useQuasar();
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

      // if user takes firebase action link to reset password
      if (
        !user &&
        to.query.mode === "resetPassword" &&
        to.path !== "/resetPassword"
      ) {
        return { path: "/resetPassword", query: to.query };

        // if user takes firebase action link to verify email
      } else if (
        to.query.mode === "verifyEmail" &&
        to.path !== "/verifyEmail"
      ) {
        return { path: "/verifyEmail", query: to.query };

        // route to view change request page when email link is clicked
      } else if (
        !user &&
        to.path.includes("/viewChangeRequest") &&
        !from.path.includes("/viewChangeRequest")
      ) {
        return { path: "/auth", query: { redirect: to.path } };

        // if user is not logged in, restrict access to any non-authentication page
      } else if (
        !user &&
        to.path !== "/auth" &&
        to.path !== "/register" &&
        to.path !== "/forgotPassword" &&
        to.path !== "/verifyEmail" &&
        to.path !== "/resetPassword"
      ) {
        return { path: "/auth" };

        // if user is not logged in, prevent auth / account management access
      } else if (
        user &&
        (to.path === "/auth" ||
          to.path === "/register" ||
          to.path === "/forgotPassword" ||
          to.path === "/verifyEmail" ||
          to.path === "/resetPassword")
      ) {
        return { path: "/" };

        // only let admin reach admin page
      } else if (user && userRole !== "admin" && to.path === "/admin") {
        return { path: "/" };
      }
    });
  },
};
</script>
