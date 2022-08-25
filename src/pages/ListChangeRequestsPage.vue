<template>
  <q-page padding>
    <q-table
      title="Change requests"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :wrap-cells="true"
      :rows-per-page-options="[100]"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="secondary"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>

          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div
              style="
                width: 100%;
                overflow-wrap: break-word;
                white-space: pre-wrap;
              "
            >
              <h6>Description</h6>
              {{ props.row.description }}
            </div>

            <br />

            <div
              style="
                width: 100%;
                overflow-wrap: break-word;
                white-space: pre-wrap;
              "
            >
              <h6>Testing details</h6>
              {{ props.row.testing_details }}
            </div>

            <br />

            <div
              style="
                width: 100%;
                overflow-wrap: break-word;
                white-space: pre-wrap;
              "
            >
              <h6>Recovery plan</h6>
              {{ props.row.recovery_plan }}
            </div>

            <br />

            <div style="width: 400px">
              <q-btn
                class="q-mr-md"
                v-if="isApprovingManager || isReviewer"
                label="Approve"
                color="accent"
                style="width: 30%"
                @click="approveChangeRequest(props)"
              />
              <q-btn
                class="q-mr-md"
                v-if="isApprovingManager || isReviewer"
                label="Deny"
                color="secondary"
                style="width: 30%"
                @click="denyChangeRequest(props)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { supabase } from "../supabase";
import { logText, showErrorMessage, showSuccessMessage } from "src/logger";
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";

const columns = [
  {
    name: "id",
    required: true,
    label: "Change request ID",
    field: "id",
    align: "left",
    sortable: true,
  },
  {
    name: "status",
    align: "center",
    label: "Status",
    field: "status",
    sortable: true,
  },
  {
    name: "subject",
    align: "center",
    label: "Subject",
    field: "subject",
    sortable: true,
  },
  {
    name: "request_date",
    align: "center",
    label: "Request date",
    field: "request_date",
    sortable: true,
  },
  {
    name: "tracking_number",
    align: "center",
    label: "Tracking Number",
    field: "tracking_number",
    sortable: true,
  },
  {
    name: "requestor",
    align: "center",
    label: "IS requestor",
    field: "requestor",
    sortable: true,
  },
  {
    name: "change_date",
    align: "center",
    label: "Change date",
    field: "change_date",
    sortable: true,
  },
  {
    name: "processing_speed",
    align: "center",
    label: "Processing speed",
    field: "processing_speed",
    sortable: true,
  },
  {
    name: "risk_severity",
    align: "center",
    label: "Risk severity",
    field: "risk_severity",
    sortable: true,
  },
  {
    name: "impact_severity",
    align: "center",
    label: "Impact severity",
    field: "impact_severity",
    sortable: true,
  },
  {
    name: "approving_manager",
    label: "Approving manager",
    field: "approving_manager",
    sortable: true,
  },
  {
    name: "approval_date",
    align: "center",
    label: "Approval date",
    field: "approval_date",
    sortable: true,
  },
  {
    name: "board_date",
    align: "center",
    label: "Board date",
    field: "board_date",
    sortable: true,
  },
  {
    name: "board_recommendations",
    align: "center",
    label: "Board recommendations",
    field: "board_recommendations",
    sortable: true,
  },
];

export default {
  name: "ListChangeRequestsPage",

  setup() {
    const $q = useQuasar();
    const rows = ref([]);
    const isApprovingManager = ref(false);
    const isReviewer = ref(false);
    const user = supabase.auth.user();

    onMounted(() => {
      getAllChangeRequests();
      setUserRole();
    });

    async function getAllChangeRequests() {
      try {
        const { data, error } = await supabase.from("change_requests").select();
        if (error) throw error;

        if (data) {
          rows.value = data;
        }
      } catch (error) {
        logText(error.message);
      }
    }

    async function setUserRole() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_role")
          .match({ id: user.id });

        if (error) throw error;

        if (data[0].user_role === "approving_manager")
          isApprovingManager.value = true;
        else if (data[0].user_role === "reviewer") isReviewer.value = true;
      } catch (error) {
        logText(error.message);
      }
    }

    function approveChangeRequest(props) {
      if (
        isApprovingManager.value &&
        props.row.status !== "Under review" &&
        props.row.status !== "Needs changes"
      ) {
        updateChangeRequestApprovalDate(props);
        updateChangeRequestStatus(props, "Approved");
      } else if (
        isReviewer.value &&
        props.row.status !== "Approved" &&
        props.row.status !== "Denied"
      ) {
        updateChangeRequestStatus(props, "Pending approval");
      } else {
        showErrorMessage("You don't have the permissions to do this", $q);
      }
    }

    function denyChangeRequest(props) {
      if (
        isApprovingManager.value &&
        props.row.status !== "Under review" &&
        props.row.status !== "Needs changes"
      )
        updateChangeRequestStatus(props, "Denied");
      else if (
        isReviewer.value &&
        props.row.status !== "Approved" &&
        props.row.status !== "Denied"
      ) {
        updateChangeRequestStatus(props, "Needs changes");
      } else {
        showErrorMessage("You don't have the permissions to do this", $q);
      }
    }

    async function updateChangeRequestApprovalDate(props) {
      const today = new Date();
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({ approval_date: today })
          .match({ id: props.row.id });

        if (error) throw error;
        rows.value[props.pageIndex].approval_date = formatDate(today);
      } catch (error) {
        logText(error.message);
      }
    }

    function formatDate(date) {
      return (
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2)
      );
    }

    async function updateChangeRequestStatus(props, status) {
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({ status })
          .match({ id: props.row.id });

        if (error) throw error;
        rows.value[props.pageIndex].status = status;
        showSuccessMessage("Change request updated", $q);
      } catch (error) {
        logText(error.message);
      }
    }

    return {
      columns,
      rows,
      isApprovingManager,
      isReviewer,
      approveChangeRequest,
      denyChangeRequest,
    };
  },
};
</script>
