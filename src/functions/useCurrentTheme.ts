import { onMounted, onScopeDispose, ref, type Ref } from "vue";
import type { Theme } from "./theme";

const getThemeFromDocument = (): Theme | undefined => {
  const theme = document.documentElement.dataset.theme;
  return theme ? (theme as Theme) : undefined;
};

export function getCurrentTheme(): Ref<Theme | undefined> {
  const theme = ref<Theme | undefined>(getThemeFromDocument());
  let observer: MutationObserver | undefined;

  onMounted(() => {
    observer = new MutationObserver(() => {
      theme.value = getThemeFromDocument();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  });

  onScopeDispose(() => observer?.disconnect());
  return theme;
}
