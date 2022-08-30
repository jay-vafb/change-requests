<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          color="secondary"
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>{{ $route.meta.title }}</q-toolbar-title>

        {{ user.email }}
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <EssentialLink
        title="Home"
        caption="Visit home page"
        link="/"
        icon="home"
      ></EssentialLink>
      <EssentialLink
        title="View change requests"
        caption="List all open change requests"
        link="/changeRequests"
        icon="list"
      >
      </EssentialLink>
      <EssentialLink
        title="Change request form"
        caption="Enter details for making change requests"
        link="/changeRequestForm"
        icon="description"
      ></EssentialLink>
      <EssentialLink
        title="Statistics"
        caption="View monthly change request statistics"
        link="/statistics"
        icon="equalizer"
      >
      </EssentialLink>
      <EssentialLink
        title="Sign out"
        caption="Sign out of your account"
        icon="logout"
        :click="signOut"
      >
      </EssentialLink>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import EssentialLink from "src/components/EssentialLink.vue";
import { supabase } from "../supabase";
import { logText } from "../Logger";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const leftDrawerOpen = ref(false);
    const user = supabase.auth.user();

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    async function signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        router.push("/auth");
      } catch (error) {
        logText(error.message);
      }
    }

    return {
      leftDrawerOpen,
      user,
      toggleLeftDrawer,
      signOut,
    };
  },
  components: { EssentialLink },
};
</script>
