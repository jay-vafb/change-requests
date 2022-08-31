<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form @submit="onSubmit">
        <div class="q-gutter-y-md column" style="max-width: 300px">
          <div class="flex" style="justify-content: center">
            <h5>VAFB Change Requests</h5>
            <h5>Register</h5>
          </div>
          <q-input
            v-model="emailInput"
            type="email"
            prefix="Email:"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input
            v-model="passwordInput"
            :type="showPassword ? 'password' : 'text'"
            prefix="Password:"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length >= 8) ||
                'Password must be at least 8 characters',
              (val) =>
                /[a-z]/.test(val) ||
                'Password must include at least one lowercase letter',
              (val) =>
                /[A-Z]/.test(val) ||
                'Password must include at least one uppercase letter',
              (val) =>
                /[0-9]/.test(val) ||
                'Password must include at least one numerical digit',
              (val) =>
                /[!@#$&*]/.test(val) ||
                'Password must include at least one special character',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
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
import { showSuccessMessage, showErrorMessage } from "src/Logger";

export default {
  name: "RegisterPage",

  setup() {
    const $q = useQuasar();

    const emailInput = ref(null);
    const passwordInput = ref(null);
    const isLoading = ref(false);
    const showPassword = ref(true);

    function onSubmit() {
      isLoading.value = true;
      handleRegister();
    }

    async function handleRegister() {
      try {
        const { error } = await supabase.auth.signUp({
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
      showPassword,
      onSubmit,
    };
  },
};
</script>
