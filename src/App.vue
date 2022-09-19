<template>
  <router-view></router-view>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { supabase } from "./supabase";

export default {
  name: "App",

  setup() {
    const router = useRouter();
    const route = useRoute();

    router.beforeEach(async (to, from) => {
      // to.path must be checked to prevent infinite redirection
      console.log(from.path);
      console.log(to.path);
      if (!supabase.auth.user() && to.path.includes("/viewChangeRequest")) {
        // email link clicked
        return { path: "/auth", query: { redirect: to.path } };
      } else if (
        !supabase.auth.user() &&
        to.path !== "/auth" &&
        to.path !== "/register"
      ) {
        return { path: "/auth" };
      } else if (
        supabase.auth.user() &&
        (to.path === "/auth" || to.path === "/register")
      ) {
        return { path: "/" };
      }
    });
  },
};
</script>
