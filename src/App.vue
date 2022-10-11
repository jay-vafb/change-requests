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
      const user = supabase.auth.user();
      const userRole = await getUserRole(user);
      store.user = user;

      console.log(window.location);

      // if user takes supabase action link to reset password
      if (
        !user &&
        to.path.includes("type=recovery") &&
        to.path !== "/resetPassword"
      ) {
        console.log("in 1");
        return { path: "/resetPassword" };

        // if user takes supabase action link to verify email
      } else if (
        to.path.includes("type=signup") &&
        to.path !== "/verifyEmail"
      ) {
        console.log("in 2");
        return { path: "/verifyEmail" };

        // route to view change request page when email link is clicked
      } else if (
        !user &&
        to.path.includes("/viewChangeRequest") &&
        !from.path.includes("/viewChangeRequest")
      ) {
        console.log("in 3");
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
        console.log("in 4");
        return { path: "/auth" };

        // if user is logged in, prevent auth / account management access
      } else if (
        user &&
        (to.path === "/auth" ||
          to.path === "/register" ||
          to.path === "/forgotPassword" ||
          to.path === "/verifyEmail" ||
          to.path === "/resetPassword")
      ) {
        console.log(to.path);
        console.log("in 5");
        return { path: from.path };

        // only let admin reach admin page
      } else if (user && userRole !== "admin" && to.path === "/admin") {
        console.log("in 6");
        return { path: "/" };
      }
    });
  },
};
</script>
