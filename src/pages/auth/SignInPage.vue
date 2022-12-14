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

            <div
              class="flex q-pa-none q-ma-none"
              style="justify-content: right"
            >
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

            <q-btn
              class="typingdna-verify"
              color="primary"
              :data-typingdna-client-id="typingDnaClientId"
              :data-typingdna-application-id="typingDnaApplicationId"
              :data-typingdna-payload="typingDnaPayload"
              data-typingdna-callback-fn="typeDNACallback"
              label="Verify 2FA with TypingDNA"
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
  </transition>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { logText, showErrorMessage, showSuccessMessage } from "src/logger";
import { useRouter, useRoute } from "vue-router";
import { store } from "src/store";
import { supabase } from "src/supabase";
import axios from "axios";

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

    const typingDnaClientId = ref(null);
    const typingDnaApplicationId = ref(null);
    const typingDnaPayload = ref(null);

    // TODO: revert links back to the original heroku test email server
    function typeDNAVerify() {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_PRODUCTION}/verifyAccount?email=${
            emailInput.value
          }`
        )
        .then((res) => {
          typingDnaClientId.value = res.data.clientId;
          typingDnaApplicationId.value = res.data.applicationId;
          typingDnaPayload.value = res.data.payload;

          emailAddress = emailInput.value;

          TypingDNAVerify2FA({
            ...res.data,
            callbackFn: "typeDNACallback",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function onSubmit() {
      isLoading.value = true;
      typeDNAVerify();
      handleLogin();
    }

    async function handleLogin() {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailInput.value,
          password: passwordInput.value,
        });

        const user = await supabase.auth.getUser();
        if (error) throw error;

        // TODO: test this with email links
        if (user && redirect) {
          router.push(redirect);
        } else if (user) {
          //router.push("/");
          sessionStorage.setItem("verified", false);
          showSuccessMessage(
            "Logged in. Please authenticate with TypingDNA",
            $q
          );
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

      typingDnaClientId,
      typingDnaApplicationId,
      typingDnaPayload,
    };
  },
};
</script>
