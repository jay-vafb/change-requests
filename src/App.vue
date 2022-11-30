<template>
  <router-view></router-view>
</template>

<script>
import { useRouter } from "vue-router";
import { supabase } from "./supabase";
import { store } from "./store";

export default {
  name: "App",

  setup() {
    const router = useRouter();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        const user = await supabase.auth.getUser();
        store.user = user.data.user;
      }
    });

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
      const user = store.user;
      const userRole = await getUserRole(user);

      const authenticated =
        store.user && sessionStorage.getItem("verified") === "true";

      // if user takes supabase action link to reset password
      if (to.path !== "/resetPassword/" && to.hash.includes("type=recovery")) {
        return {
          path: "/resetPassword/",
          hash: to.hash,
        };

        // if user takes supabase action link to verify email
      } else if (
        to.path !== "/verifyEmail/" &&
        to.hash.includes("type=signup")
      ) {
        return { path: "/verifyEmail/", hash: to.hash };

        // route to view change request page when email link is clicked
      } else if (
        !authenticated &&
        to.path.includes("/viewChangeRequest") &&
        !from.path.includes("/viewChangeRequest")
      ) {
        return { path: "/auth", query: { redirect: to.path } };

        // if user is not logged in, restrict access to any non-authentication page
      } else if (
        !authenticated &&
        to.path !== "/auth" &&
        to.path !== "/register" &&
        to.path !== "/forgotPassword" &&
        to.path !== "/verifyEmail/" &&
        to.path !== "/resetPassword/"
      ) {
        return { path: "/auth" };

        // if user is logged in, prevent auth / account management access
      } else if (
        authenticated &&
        (to.path === "/auth" ||
          to.path === "/register" ||
          to.path === "/forgotPassword")
      ) {
        return { path: from.path };

        // only let admin reach admin page
      } else if (
        authenticated &&
        userRole !== "admin" &&
        to.path === "/admin"
      ) {
        return { path: "/" };
      }
    });
  },
};
</script>
