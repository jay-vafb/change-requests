<template>
  <q-page padding>
    <q-table
      title="Change requests"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :wrap-cells="true"
      :rows-per-page-options="[30]"
      :sort-method="sortByStatus"
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
        <q-tr v-show="props.expand" :props="props" :ref="(el) => {}">
          <q-td colspan="100%">
            <div class="q-gutter-md">
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

              <div
                style="
                  width: 100%;
                  overflow-wrap: break-word;
                  white-space: pre-wrap;
                "
              >
                <h6>Board comments</h6>
                {{ props.row.board_recommendations }}
              </div>

              <div>
                <q-btn
                  class="q-mr-md"
                  label="Make changes"
                  color="accent"
                  @click="openChangeRequest(props.row.id)"
                />
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { supabase } from "../supabase";
import { logText } from "../logger";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

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
];

export default {
  name: "ListChangeRequestsPage",

  setup() {
    const router = useRouter();
    const rows = ref([]);
    const states = {
      "Pending board approval": 0,
      "Pending approval": 1,
      "Under review": 2,
      "Needs changes": 3,
      "Board approved": 4,
      Approved: 5,
      "Board denied": 6,
      Denied: 7,
    };

    onMounted(() => {
      getAllChangeRequests();
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

    function openChangeRequest(id) {
      router.push({ path: "/viewChangeRequest/" + id });
    }

    function sortByStatus(rows, sortBy, descending) {
      const data = [...rows];

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a;
          const y = descending ? a : b;

          if (sortBy === "status") {
            return compareAB(x, y);
          } else {
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy]);
          }
        });
      }
      return data;
    }

    function compareAB(a, b) {
      const aStatus = a["status"];
      const bStatus = b["status"];

      if (states[aStatus] < states[bStatus]) {
        return -1;
      }
      if (states[aStatus] > states[bStatus]) {
        return 1;
      }
      return 0;
    }

    return {
      columns,
      rows,

      openChangeRequest,
      sortByStatus,
    };
  },
};
</script>
