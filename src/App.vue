<template>
  <router-view></router-view>
</template>

<script>
import { useRouter } from "vue-router";
import { supabase } from "./supabase";

export default {
  name: "App",

  setup() {
    const router = useRouter();

    router.beforeEach(async (to, from) => {
      // to.path must be checked to prevent infinite redirection
      if (!supabase.auth.user() && to.path !== "/auth") {
        return { path: "/auth" };
      }
    });
  },
};
</script>
