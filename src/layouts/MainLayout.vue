<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="header bg-primary text-white">
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

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="sidebar"
    >
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
        :click="firebaseSignOut"
      >
      </EssentialLink>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, watch } from "vue";
import EssentialLink from "src/components/EssentialLink.vue";
import { logText } from "../logger";
import { useRouter } from "vue-router";
import { store } from "src/store";
import { signOut } from "@firebase/auth";
import { auth } from "src/firebaseConfig";

export default {
  setup() {
    const router = useRouter();
    const leftDrawerOpen = ref(false);
    //const user = supabase.auth.user();
    const user = store.user;

    watch(
      () => store.isLeftDrawerOpen,
      (newValue, oldValue) => {
        leftDrawerOpen.value = store.isLeftDrawerOpen;
      }
    );

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
      store.setLeftDrawerState(leftDrawerOpen.value);
    }

    async function firebaseSignOut() {
      signOut(auth)
        .then((_) => {
          store.user = {};
          router.push("/auth");
        })
        .catch((_) => {
          logText(error.message);
        });
    }

    return {
      leftDrawerOpen,
      user,
      toggleLeftDrawer,
      firebaseSignOut,
    };
  },
  components: { EssentialLink },
};
</script>
