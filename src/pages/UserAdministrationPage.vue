<template>
  <q-page padding>
    <q-form @submit="onSubmit">
      <div class="row q-mb-sm">
        <div class="col-12 col-md-5">
          <q-select
            outlined
            v-model="userEmailDropdown"
            :options="userEmailOptions"
            label="Email"
            lazy-rules
            emit-value
            map-options
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col-12 col-md-5">
          <q-select
            class="q-mb-sm"
            outlined
            v-model="userRoleDropdown"
            :options="userRoleOptions"
            label="Role"
            lazy-rules
            emit-value
            map-options
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-5">
          <q-btn
            type="submit"
            label="Set role"
            color="primary"
            style="width: 100%"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { logText, showSuccessMessage } from "src/logger";
import { ref } from "vue";
import { useQuasar } from "quasar";
import { supabase } from "src/supabase";

export default {
  name: "UserAdministrationPage",

  setup() {
    const $q = useQuasar();

    const userRoleDropdown = ref(null);
    const userEmailDropdown = ref(null);
    const userEmailOptions = ref([]);

    getAllUsers().then((emailData) => {
      userEmailOptions.value = emailData;
    });

    async function getAllUsers() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .neq("user_role", "admin");

        if (error) throw error;

        const emailData = storeUsernamesInArray(data);
        return emailData;
      } catch (error) {
        logText(error.message);
      }
    }

    function storeUsernamesInArray(data) {
      const emailArray = [];
      data.forEach((email) => {
        emailArray.push(email.username);
      });
      return emailArray;
    }

    function onSubmit() {
      setUserRole();
    }

    async function setUserRole() {
      try {
        const { error } = await supabase.from("profiles").update({
          username: userEmailDropdown.value,
          user_role: userRoleDropdown.value,
        });

        if (error) throw error;
        showSuccessMessage("User role set", $q);
      } catch (error) {
        logText(error.message);
      }
    }

    return {
      userRoleDropdown,
      userEmailDropdown,
      userEmailOptions,

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

      onSubmit,
      setUserRole,
    };
  },
};
</script>
