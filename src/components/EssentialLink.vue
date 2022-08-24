<template>
  <q-item clickable :to="link" @click="click">
    <q-item-section v-if="icon" avatar>
      <q-icon :color="color" :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "secondary",
    },

    click: {
      type: Function,
    },
  },
});
</script>
