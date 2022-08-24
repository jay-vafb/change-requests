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
        title="Sign out"
        caption="Sign out of your account"
        link="/auth"
        icon="logout"
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
import { store } from "../store";
import { supabase } from "../supabase";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  components: { EssentialLink },
};
</script>
