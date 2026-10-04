import type { PrologSlug } from "@/types/slugLabel";
import type { Ref, StyleValue } from "vue";
import { themes, getFallbackTheme, type Theme } from "./theme";
import { useCurrentTheme } from "./useCurrentTheme";
import { useSlugColour } from "./useSlugColour";

type SlugColourKind = keyof (typeof themes)[number]["slugColours"];

const slugToStyle = (
  slug: PrologSlug<any>,
  configSelector: SlugColourKind,
  theme: Ref<Theme | undefined>,
): StyleValue => {
  const themeConfig = themes.find(
    (t) => t.value === (theme?.value ?? getFallbackTheme()),
  );
  const config = themeConfig?.slugColours[configSelector];
  const { bgColour, textColour } = useSlugColour(slug, config);
  return {
    backgroundColor: bgColour.toRgbString(),
    color: textColour.toRgbString(),
  };
};

export function useSlugStyle() {
  const theme = useCurrentTheme();

  return (slug: PrologSlug<any>, kind: SlugColourKind) =>
    slugToStyle(slug, kind, theme);
}
