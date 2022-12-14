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
            </div>

            <div class="text-body2">
              Enter the email address associated with your account and we'll
              send you a link to reset your password
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

            <q-btn
              :loading="isLoading"
              type="submit"
              color="primary"
              label="Reset password"
            />

            <div class="flex q-ma-xs" style="justify-content: center">
              <q-btn flat no-caps @click="$router.push('/auth')"
                >Return to sign in page</q-btn
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
import { showErrorMessage, showSuccessMessage } from "src/logger";
import { useRouter } from "vue-router";
import { supabase } from "src/supabase";

export default {
  name: "ForgotPasswordPage",

  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const isLoading = ref(false);
    const emailInput = ref(null);

    function onSubmit() {
      isLoading.value = true;
      resetPassword();
    }

    async function resetPassword() {
      try {
        const { data, error } = await supabase.auth.api.resetPasswordForEmail(
          emailInput.value,
          { redirectTo: `${import.meta.env.VITE_NETLIFY_URL}/resetPassword` }
        );
        if (error) throw error;

        setTimeout((_) => {
          router.push("/auth");
        }, 1000);

        showSuccessMessage(
          "Please check your email to reset your password",
          $q
        );
      } catch (error) {
        showErrorMessage(error.message, $q);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      isLoading,
      emailInput,

      onSubmit,
    };
  },
};
</script>
