<template>
  <q-page class="q-pa-lg q-gutter-sm">
    <div class="row justify-center q-gutter-x-md">
      <div class="col-12 col-md-5 q-mb-sm">
        <StatisticsCard
          title="Monthly Change Requests"
          :value="monthlyChangeRequests"
          icon="calendar_month"
          color="positive"
        />
      </div>

      <div class="col-12 col-md-5">
        <StatisticsCard
          title="Yearly Change Requests"
          :value="yearlyChangeRequests"
          icon="calendar_month"
          color="info"
        />
      </div>
    </div>

    <div class="row justify-center q-gutter-x-md">
      <div class="col-12 col-md-5 q-mb-sm">
        <StatisticsCard
          title="Total Approved"
          :value="totalApprovedChangeRequests"
          icon="done"
          color="accent"
        />
      </div>

      <div class="col-12 col-md-5">
        <StatisticsCard
          title="Total Denied"
          :value="totalDeniedChangeRequests"
          icon="close"
        />
      </div>
    </div>

    <div class="row justify-center q-gutter-x-md">
      <div class="col-12 col-md-5 q-mb-sm">
        <StatisticsCard
          title="Average Approval Time"
          :value="averageApprovalTime"
          icon="timer"
          color="negative"
        />
      </div>

      <div class="col-12 col-md-5">
        <StatisticsCard
          title="Total Change Requests"
          :value="totalChangeRequests"
          icon="add"
          color="warning"
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

    async function getMonthlyChangeRequests() {}

    async function getYearlyChangeRequests() {}

    async function getTotalApprovedChangeRequests() {
      try {
        const { data, error } = await supabase
          .from("change_requests")
          .select("id", { count: "exact" })
          .eq("status", "Approved");

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
          .eq("status", "Denied");

        if (error) throw error;
        totalDeniedChangeRequests.value = data ? data.length : 0;
      } catch (error) {
        logText(error.message);
      }
    }

    async function getAverageApprovalTime() {}

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
