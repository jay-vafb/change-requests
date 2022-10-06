<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animtaed fadeOut"
  >
    <q-card flat bordered>
      <q-card-section horizontal>
        <q-card-section class="flex flex-center items-center">
          <q-avatar :color="color" text-color="grey-1" :icon="icon" />
        </q-card-section>

        <q-card-section style="width: 100%">
          <div class="text-caption text-grey">{{ title.toUpperCase() }}</div>
          <div class="text-h4 q-pt-xs" v-text="value"></div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </transition>
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
