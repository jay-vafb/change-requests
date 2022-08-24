<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form @submit="onSubmit">
        <div class="q-gutter-y-md column" style="max-width: 300px">
          <div class="flex" style="justify-content: center">
            <h5>VAFB change requests</h5>
          </div>
          <q-input v-model="emailInput" type="email" prefix="Email:">
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input v-model="passwordInput" type="password" prefix="Password:">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-btn
            :loading="isLoading"
            type="submit"
            color="primary"
            label="Sign in"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { supabase } from "../supabase";
import { logText, showSuccessMessage } from "../logger";
import { store } from "../store";

export default {
  name: "AuthenticationPage",

  setup() {
    const $q = useQuasar();

    const emailInput = ref(null);
    const passwordInput = ref(null);
    const isLoading = ref(false);

    function onSubmit() {
      isLoading.value = true;
      handleLogin();
    }

    async function handleLogin() {
      try {
      } catch (error) {}
    }

    return {
      emailInput,
      passwordInput,
      isLoading,
      onSubmit,
    };
  },
};
</script>
