import SchedulerForm from "../components/SchedulerForm.vue";
import ScheduleResult from "../components/ScheduleResult.vue";

export const APP_ROUTES_CONFIG = {
  form: {
    path: "/",
    component: SchedulerForm,
  },
  result: {
    path: "/result",
    component: ScheduleResult,
  },
} as const;

export type RouteName = keyof typeof APP_ROUTES_CONFIG;
