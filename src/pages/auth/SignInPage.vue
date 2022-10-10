<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form @submit="onSubmit">
        <div class="q-gutter-y-md column" style="max-width: 300px">
          <div class="flex" style="justify-content: center">
            <h5>VAFB Change Requests</h5>
            <h5>Sign In</h5>
          </div>

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
            class="q-pb-xs"
            filled
            v-model="passwordInput"
            :type="showPassword ? 'password' : 'text'"
            label="Password"
            lazy-rules
            :rules="[
              (val) => (val && val.length >= 0) || 'Please type something',
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

          <div class="flex q-pa-none q-ma-none" style="justify-content: right">
            <q-btn
              flat
              no-caps
              padding="none"
              @click="$router.push('/forgotPassword')"
              >Forgot password</q-btn
            >
          </div>

          <q-btn
            :loading="isLoading"
            type="submit"
            color="primary"
            label="Sign in"
          />

          <div class="flex q-ma-xs" style="justify-content: center">
            <q-btn flat no-caps @click="$router.push('/register')"
              >Don't have an account? Register</q-btn
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
import { logText, showErrorMessage } from "src/logger";
import { useRouter, useRoute } from "vue-router";
import { store } from "src/store";
import { supabase } from "src/supabase";

export default {
  name: "SignInPage",

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();

    const emailInput = ref(null);
    const passwordInput = ref(null);
    const isLoading = ref(false);
    const showPassword = ref(true);

    const redirect = route.query.redirect;

    function onSubmit() {
      isLoading.value = true;
      handleLogin();
    }

    async function handleLogin() {
      try {
        const { user, session, error } = await supabase.auth.signIn({
          email: emailInput.value,
          password: passwordInput.value,
        });

        if (error || !session) throw error;

        // TODO: test this with email links
        store.user = supabase.auth.user();
        if (user && redirect) {
          router.push(redirect);
        } else if (user) {
          router.push("/");
        }
      } catch (error) {
        showErrorMessage(error.message || error.error_description, $q);
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
