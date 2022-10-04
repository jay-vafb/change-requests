<template>
  <q-page class="flex flex-center">
    <div class="column q-gutter-md">
      <div class="text-h5">Email verified</div>
      <q-btn no-caps underline color="primary" @click="$router.push('/auth')"
        >Return to sign in</q-btn
      >
    </div>
  </q-page>
</template>

<script>
import { auth } from "src/firebaseConfig";
import { applyActionCode } from "@firebase/auth";
import { useRoute } from "vue-router";
import { showErrorMessage, showSuccessMessage } from "src/logger";
import { useQuasar } from "quasar";

export default {
  name: "EmailVerificationPage",

  setup() {
    const $q = useQuasar();
    const route = useRoute();

    applyActionCode(auth, route.query.oobCode)
      .then((_) => {
        showSuccessMessage("Email account verified", $q);
      })
      .catch((error) => {
        showErrorMessage("Invalid or expired email verification token", $q);
      });
  },
};
</script>
