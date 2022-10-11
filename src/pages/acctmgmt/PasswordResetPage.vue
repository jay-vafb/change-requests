<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form @submit="onSubmit">
        <div class="q-gutter-y-md column" style="max-width: 300px">
          <div class="flex" style="justify-content: center">
            <h5>VAFB Change Requests</h5>
            <h5>Reset Password</h5>
          </div>
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

          <q-input
            filled
            v-model="confirmPasswordInput"
            :type="showConfirmPassword ? 'password' : 'text'"
            label="Confirm password"
            lazy-rules
            :rules="[
              (val) => val === passwordInput || 'Passwords do not match',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>

          <q-btn
            :loading="isLoading"
            type="submit"
            color="primary"
            label="Update"
          />

          <div class="flex q-ma-xs" style="justify-content: center">
            <q-btn flat no-caps @click="$router.push('/auth')"
              >Back to sign in</q-btn
            >
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { logText, showErrorMessage, showSuccessMessage } from "src/logger";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { supabase } from "src/supabase";

export default {
  name: "PasswordResetPage",

  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();

    const passwordInput = ref(null);
    const confirmPasswordInput = ref(null);

    const showPassword = ref(true);
    const showConfirmPassword = ref(true);
    const isLoading = ref(false);

    onMounted(async () => {
      try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;
      } catch (error) {
        showErrorMessage(error.message, $q);
      }
    });

    router.push(window.location.origin + "?test=5432");

    function onSubmit() {
      isLoading.value = true;
      resetPassword();
    }

    function resetPassword() {
      isLoading.value = false;
    }

    return {
      passwordInput,
      confirmPasswordInput,
      showPassword,
      showConfirmPassword,
      isLoading,

      onSubmit,
    };
  },
};
</script>
