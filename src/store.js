import { reactive } from "vue";

export const store = reactive({
  isLeftDrawerOpen: true,
  setLeftDrawerState(state) {
    this.isLeftDrawerOpen = state;
  },
  user: {},
  verified: false,
  userRole: "",
});
