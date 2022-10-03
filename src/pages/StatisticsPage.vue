<template>
  <q-page class="q-pa-lg q-gutter-sm">
    <div class="row justify-center q-gutter-x-md">
      <div class="col-12 col-md-5 q-mb-sm">
        <StatisticsCard
          title="Monthly Change Requests"
          :value="monthlyChangeRequests"
          icon="calendar_month"
          color="brown-5"
        />
      </div>

      <div class="col-12 col-md-5">
        <StatisticsCard
          title="Yearly Change Requests"
          :value="yearlyChangeRequests"
          icon="calendar_month"
          color="blue-5"
        />
      </div>
    </div>

    <div class="row justify-center q-gutter-x-md">
      <div class="col-12 col-md-5 q-mb-sm">
        <StatisticsCard
          title="Total Approved"
          :value="totalApprovedChangeRequests"
          icon="done"
          color="green-5"
        />
      </div>

      <div class="col-12 col-md-5">
        <StatisticsCard
          title="Total Denied"
          :value="totalDeniedChangeRequests"
          icon="close"
          color="red-5"
        />
      </div>
    </div>

    <div class="row justify-center q-gutter-x-md">
      <div class="col-12 col-md-5 q-mb-sm">
        <StatisticsCard
          title="Average Approval Time (hours)"
          :value="averageApprovalTime"
          icon="timer"
          color="purple-5"
        />
      </div>

      <div class="col-12 col-md-5">
        <StatisticsCard
          title="Total Change Requests"
          :value="totalChangeRequests"
          icon="add"
          color="yellow-5"
        />
      </div>
    </div>
  </q-page>
</template>

<style lang="sass" scoped></style>

<script>
import { ref } from "vue";
import StatisticsCard from "src/components/StatisticsCard.vue";
import { supabase } from "src/supabase";
import { logText } from "src/logger";

export default {
  name: "StatisticsPage",

  setup() {
    const monthlyChangeRequests = ref(0);
    const yearlyChangeRequests = ref(0);
    const totalApprovedChangeRequests = ref(0);
    const totalDeniedChangeRequests = ref(0);
    const averageApprovalTime = ref(0);
    const totalChangeRequests = ref(0);

    getMonthlyChangeRequests();
    getYearlyChangeRequests();
    getTotalApprovedChangeRequests();
    getTotalDeniedChangeRequests();
    getAverageApprovalTime();
    getTotalChangeRequests();

    async function getMonthlyChangeRequests() {
      try {
        const { data, error } = await supabase
          .rpc("requests_per", {
            date_type: "month",
          })
          .select("requests");

        if (error) throw error;
        monthlyChangeRequests.value = data[0] ? data[0].requests : 0;
      } catch (error) {
        logText(error.message);
      }
    }

    async function getYearlyChangeRequests() {
      try {
        const { data, error } = await supabase
          .rpc("requests_per", {
            date_type: "year",
          })
          .select("requests");

        if (error) throw error;
        yearlyChangeRequests.value = data[0] ? data[0].requests : 0;
      } catch (error) {
        logText(error.message);
      }
    }

    async function getTotalApprovedChangeRequests() {
      try {
        const { data, error } = await supabase
          .from("change_requests")
          .select("id", { count: "exact" })
          .or("status.eq.Approved, status.eq.Board approved");

        if (error) throw error;
        totalApprovedChangeRequests.value = data ? data.length : 0;
      } catch (error) {
        logText(error.message);
      }
    }

    async function getTotalDeniedChangeRequests() {
      try {
        const { data, error } = await supabase
          .from("change_requests")
          .select("id", { count: "exact" })
          .or("status.eq.Denied, status.eq.Board denied");

        if (error) throw error;
        totalDeniedChangeRequests.value = data ? data.length : 0;
      } catch (error) {
        logText(error.message);
      }
    }

    async function getAverageApprovalTime() {
      try {
        const { data, error } = await supabase
          .from("change_requests")
          .select("id, inserted_at, updated_at")
          .or("status.eq.Approved, status.eq.Board approved");

        if (error) throw error;

        if (!data[0]) return;

        data.forEach((changeRequest) => {
          changeRequest.approvalTime = calculateApprovalTime(changeRequest);
        });
        logText(data);

        const average =
          data.reduce((a, b) => {
            return a + b.approvalTime;
          }, 0) / data.length;

        averageApprovalTime.value = Math.round(average * 10) / 10;
      } catch (error) {
        logText(error.message);
      }
    }

    function calculateApprovalTime(changeRequest) {
      const updatedDate = new Date(changeRequest.updated_at);
      const insertedDate = new Date(changeRequest.inserted_at);

      const utcUpdatedDate = Date.UTC(
        updatedDate.getFullYear(),
        updatedDate.getMonth(),
        updatedDate.getDate(),
        updatedDate.getHours(),
        updatedDate.getMinutes()
      );

      const utcInsertedDate = Date.UTC(
        insertedDate.getFullYear(),
        insertedDate.getMonth(),
        insertedDate.getDate(),
        insertedDate.getHours(),
        insertedDate.getMinutes()
      );

      return (utcUpdatedDate - utcInsertedDate) / 36e5;
    }

    async function getTotalChangeRequests() {
      try {
        const { data, error } = await supabase
          .from("change_requests")
          .select("id", { count: "exact" });

        if (error) throw error;
        totalChangeRequests.value = data ? data.length : 0;
      } catch (error) {
        logText(error.message);
      }
    }

    return {
      monthlyChangeRequests,
      yearlyChangeRequests,
      totalApprovedChangeRequests,
      totalDeniedChangeRequests,
      averageApprovalTime,
      totalChangeRequests,
    };
  },

  components: { StatisticsCard },
};
</script>
