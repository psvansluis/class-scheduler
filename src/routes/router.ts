declare module "vue-router";
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { APP_ROUTES_CONFIG } from "./config.ts";

const routes: RouteRecordRaw[] = Object.entries(APP_ROUTES_CONFIG).map(
  ([name, config]) => ({
    ...config,
    name,
  }),
);

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
