<template>
  <q-input
    outlined
    :label="commenter + ' - ' + created_at"
    stack-label
    readonly
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CommentComponent",
  props: {
    commenter: {
      type: String,
      required: true,
    },

    createdAt: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },
  },
});
</script>
