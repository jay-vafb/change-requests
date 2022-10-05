<template>
  <q-card flat bordered style="min-width: 18rem">
    <q-card-section horizontal>
      <q-card-section style="width: 100%">
        <div class="text-caption text-grey">{{ title.toUpperCase() }}</div>
        <div class="text-h4 q-pt-xs" v-text="value"></div>
      </q-card-section>

      <q-card-section class="flex justify-right items-center">
        <q-avatar :color="color" text-color="grey-1" :icon="icon" />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "StatisticsCardComponent",
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "secondary",
    },
  },
};
</script>
