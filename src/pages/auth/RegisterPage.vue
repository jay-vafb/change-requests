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
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { showSuccessMessage, showErrorMessage, logText } from "src/logger";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "@firebase/auth";
import { auth } from "src/firebaseConfig";
import { supabase } from "src/supabase";

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
      createUserWithEmailAndPassword(
        auth,
        emailInput.value,
        passwordInput.value
      )
        .then((userCredential) => {
          const user = userCredential.user;

          sendEmailVerification(user)
            .then((_) => {
              saveUser();
              showSuccessMessage(
                "Please check your email to verify your account",
                $q
              );
            })
            .catch((error) => {
              logText(`FAuth - error: ${error.message}`);
            });
        })
        .catch((error) => {
          handleFirebaseErrors(error);
        })
        .finally((_) => {
          isLoading.value = false;
          signOut(auth)
            .then((_) => {
              logText("Success");
            })
            .catch((error) => {
              logText(error.message);
            });
        });
    }

    async function saveUser() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .insert({ username: emailInput.value });

        if (error) throw error;
      } catch (error) {
        logText(error.message);
      }
    }

    function handleFirebaseErrors(error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          showErrorMessage("This email is already in use by an account", $q);
          break;
        default:
          showErrorMessage(`FAuth - ${error.message}`);
          break;
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
