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
import { showErrorMessage, showSuccessMessage } from "src/logger";
import { useQuasar } from "quasar";
import { supabase } from "src/supabase";
import { onMounted } from "vue";

export default {
  name: "EmailVerificationPage",

  setup() {
    const $q = useQuasar();

    onMounted(async () => {
      try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;
        showSuccessMessage("Your account has been verified");
      } catch (error) {
        showErrorMessage(error.message, $q);
      }
    });
  },
};
</script>
