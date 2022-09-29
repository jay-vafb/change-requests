<template>
  <q-page padding>
    <div class="row q-mb-sm">
      <div class="col-12 col-md-3">
        <q-input
          filled
          v-model="emailInput"
          type="email"
          label="Email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
      </div>
    </div>

    <div class="row q-mb-sm">
      <div class="col-12 col-md-3">
        <q-select
          class="q-mb-sm"
          outlined
          v-model="userRoleDropdown"
          :options="userRoleOptions"
          label="Role"
          lazy-rules
          :rules="[
            (val) => {
              (val && val.length > 0) || 'Please make a selection';
              console.log('HI');
            },
          ]"
        />
      </div>
    </div>

    <div class="row q-gutter-md">
      <div class="col-3">
        <q-btn
          label="Set role"
          color="primary"
          style="width: 100%"
          @click="setUserRole()"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { logText } from "src/logger";
import { ref } from "vue";

export default {
  name: "UserAdministrationPage",

  setup() {
    const emailInput = ref(null);
    const userRoleDropdown = ref("");

    function setUserRole() {
      logText(emailInput.value);
      logText(userRoleDropdown.value);
    }

    return {
      emailInput,
      userRoleDropdown,

      userRoleOptions: [
        {
          label: "Reviewer",
          value: "reviewer",
          description: "reviewer role",
          category: "1",
        },
        {
          label: "Approving Manager",
          value: "approving_manager",
          description: "approving manager role",
          category: "1",
        },
        {
          label: "Board Approver",
          value: "board_approver",
          description: "board approver role",
          category: "1",
        },
      ],

      setUserRole,
    };
  },
};
</script>
