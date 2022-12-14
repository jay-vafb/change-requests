<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animtaed fadeOut"
  >
    <q-page class="flex flex-center">
      <div class="q-pa-md">
        <q-form @submit="onSubmit">
          <div class="q-gutter-y-md column" style="max-width: 300px">
            <div class="flex" style="justify-content: center">
              <h5>VAFB Change Requests</h5>
              <h5>Register</h5>
            </div>
            <q-input
              filled
              v-model="firstName"
              label="First name"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            >
            </q-input>

            <q-input
              filled
              v-model="lastName"
              label="Last name"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            >
            </q-input>

            <q-input
              filled
              v-model="emailInput"
              type="email"
              label="Email"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            >
            </q-input>

            <q-input
              filled
              v-model="passwordInput"
              :type="showPassword ? 'password' : 'text'"
              label="Password"
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

            <div class="flex q-ma-xs" style="justify-content: center">
              <q-btn flat no-caps @click="$router.push('/auth')"
                >Already have an account? Sign in</q-btn
              >
            </div>
          </div>
        </q-form>
      </div>
    </q-page>
  </transition>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { showSuccessMessage, showErrorMessage, logText } from "src/logger";
import { supabase } from "src/supabase";
import { useRouter } from "vue-router";

export default {
  name: "RegisterPage",

  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const firstName = ref(null);
    const lastName = ref(null);
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
        const { data, error } = await supabase.auth.signUp(
          {
            email: emailInput.value,
            password: passwordInput.value,
          },
          { redirectTo: `${import.meta.env.VITE_NETLIFY_URL}/verifyEmail` }
        );

        if (error) throw error;

        saveUser();
        await supabase.auth.signOut();
        setTimeout((_) => {
          router.push("/auth");
        }, 1000);

        showSuccessMessage(
          "Please check your email to verify your account",
          $q
        );
      } catch (error) {
        showErrorMessage(error.message || error.error_description, $q);
      } finally {
        isLoading.value = false;
      }
    }

    async function saveUser() {
      try {
        const { data, error } = await supabase.from("profiles").insert({
          username: emailInput.value,
          full_name: getFullName(),
          user_role: "default",
        });

        if (error) throw error;
      } catch (error) {
        logText(error.message);
      }
    }

    function getFullName() {
      const formattedFirstName =
        firstName.value.toLowerCase().charAt(0).toUpperCase() +
        firstName.value.toLowerCase().slice(1);
      const formattedLastName =
        lastName.value.toLowerCase().charAt(0).toUpperCase() +
        lastName.value.toLowerCase().slice(1);

      return `${formattedFirstName} ${formattedLastName}`;
    }

    return {
      firstName,
      lastName,
      emailInput,
      passwordInput,
      isLoading,
      showPassword,
      onSubmit,
    };
  },
};
</script>
