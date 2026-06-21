import type { RouteLocationNormalizedLoadedGeneric, Router } from "vue-router";
import type { Form } from "../types/form";
import { decodeForm, encodeForm } from "./formCodec";
import type { RouteName } from "../routes/config";

export const stateQueryToForm = (
  route: RouteLocationNormalizedLoadedGeneric,
): Form | undefined => {
  const stateQuery = route.query.state;
  if (typeof stateQuery !== "string" || stateQuery.length === 0) {
    return undefined;
  }
  try {
    return decodeForm(stateQuery);
  } catch (e) {
    console.error("Failed to parse form state from URL payload", e);
    return undefined;
  }
};

export const formToStateQuery = (
  form: Form,
  router: Router,
  name?: RouteName,
) => {
  const state = encodeForm(form);
  const route = router.currentRoute.value;
  router.push({
    name: name ?? route.name,
    query: { ...route.query, state },
  });
};
