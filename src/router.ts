import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import SchedulerForm from "./components/SchedulerForm.vue";
import ScheduleResult from "./components/ScheduleResult.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "form",
    component: SchedulerForm,
  },
  {
    path: "/result",
    name: "result",
    component: ScheduleResult,
  },
];

const router = createRouter({
  // This ensures URLs look like: mysite.com/#/result?state=ey...
  history: createWebHashHistory(),
  routes,
});

export default router;
