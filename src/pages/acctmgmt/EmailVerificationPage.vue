<template>
  <q-page class="flex flex-center">
    <div class="column q-gutter-md">
      <div class="text-h2">Email verified</div>
    </div>
  </q-page>
</template>

<script>
import { showSuccessMessage } from "src/logger";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  name: "EmailVerificationPage",

  setup() {
    const $q = useQuasar();
    const router = useRouter();

    showSuccessMessage("Account verified", $q);
    setTimeout((_) => {
      router.push("/");
    }, 1000);
  },
};
</script>
