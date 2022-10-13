<template>
  <div class="row">
    <div
      class="col-12 col-md-11 text-caption q-pa-sm"
      style="border: 1px solid lightgray"
    >
      {{ author + " - " + createdAt }}
      <div
        class="text-body2"
        style="overflow-wrap: break-word; white-space: pre-wrap"
      >
        {{ body }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentComponent",

  props: {
    author: {
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
};
</script>
