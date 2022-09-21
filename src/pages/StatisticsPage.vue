<template>
  <q-page class="q-pa-lg q-gutter-sm">
    <div class="row justify-center q-gutter-x-md">
      <div class="col-12 col-md-5 q-mb-sm">
        <StatisticsCard
          title="Monthly Change Requests"
          :value="135"
          icon="calendar_month"
          color="positive"
        />
      </div>

      <div class="col-12 col-md-5">
        <StatisticsCard
          title="Yearly Change Requests"
          :value="235"
          icon="calendar_month"
          color="info"
        />
      </div>
    </div>

    <div class="row justify-center q-gutter-x-md">
      <div class="col-12 col-md-5 q-mb-sm">
        <StatisticsCard
          title="Total Approved"
          :value="932"
          icon="done"
          color="accent"
        />
      </div>

      <div class="col-12 col-md-5">
        <StatisticsCard title="Total Denied" :value="1235" icon="close" />
      </div>
    </div>

    <div class="row justify-center q-gutter-x-md">
      <div class="col-12 col-md-5 q-mb-sm">
        <StatisticsCard
          title="Average Approval Time"
          :value="15"
          icon="timer"
          color="negative"
        />
      </div>

      <div class="col-12 col-md-5">
        <StatisticsCard
          title="Total Change Requests"
          :value="2532"
          icon="add"
          color="warning"
        />
      </div>
    </div>
  </q-page>
</template>

<style lang="sass" scoped></style>

<script>
import StatisticsCard from "src/components/StatisticsCard.vue";
export default {
  components: { StatisticsCard },
};
</script>
