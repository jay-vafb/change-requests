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
              (val) => (val && val.length >= 0) || 'Please type something',
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
            label="Sign in"
          />

          <div class="flex" style="justify-content: center">
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
import { supabase } from "../supabase";
import { showErrorMessage } from "../logger";
import { useRouter } from "vue-router";

export default {
  name: "SignInPage",

  async mounted() {
    supabase.auth.user();
  },

  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const emailInput = ref(null);
    const passwordInput = ref(null);
    const isLoading = ref(false);
    const showPassword = ref(true);

    function onSubmit() {
      isLoading.value = true;
      handleLogin();
    }

    async function handleLogin() {
      try {
        const { user, error, session } = await supabase.auth.signIn({
          email: emailInput.value,
          password: passwordInput.value,
        });

        if (error || !session) throw error;

        // go to home page if login event successful
        if (user) router.push("/");
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
