<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form @submit="onSubmit">
        <div class="q-gutter-y-md column" style="max-width: 300px">
          <div class="flex" style="justify-content: center">
            <h5>VAFB change requests</h5>
            <h5>Register</h5>
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
            label="Register"
          />

          <div class="flex" style="justify-content: center">
            <q-btn flat no-caps @click="$router.push('/auth')"
              >Already have an account? Sign in</q-btn
            >
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { supabase } from "../supabase";
import { logText, showSuccessMessage, showErrorMessage } from "../logger";

export default {
  name: "RegisterPage",

  setup() {
    const $q = useQuasar();

    const emailInput = ref(null);
    const passwordInput = ref(null);
    const isLoading = ref(false);

    function onSubmit() {
      isLoading.value = true;
      handleRegister();
    }

    async function handleRegister() {
      try {
        const { user, error } = await supabase.auth.signUp({
          email: emailInput.value,
          password: passwordInput.value,
        });

        if (error) throw error;
        showSuccessMessage(
          "Please check your email to verify your account",
          $q
        );
      } catch (error) {
        showErrorMessage(error.message, $q);
      } finally {
        isLoading.value = false;
      }
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
