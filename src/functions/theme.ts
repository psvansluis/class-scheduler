import { colord } from "colord";
import type { SlugColourConfig } from "./useSlugColour";

export interface ThemeDefinition {
  label: string;
  value: string;
  /** Drives dark/light fallback selection when no theme is stored in the URL. */
  colorScheme: "light" | "dark";
  slugColours: {
    skill: SlugColourConfig;
    course: SlugColourConfig;
    teacher: SlugColourConfig;
  };
}

export const themes = [
  {
    label: "Corporate",
    value: "corporate",
    colorScheme: "light",
    slugColours: {
      skill: {
        hueMin: 135,
        hueMax: 195,
        satMin: 70,
        satMax: 85,
        lightnessMin: 70,
        lightnessMax: 80,
      },
      course: {
        hueMin: 240,
        hueMax: 290,
        satMin: 70,
        satMax: 85,
        lightnessMin: 85,
        lightnessMax: 95,
      },
      teacher: {
        hueMin: 15,
        hueMax: 30,
        satMin: 70,
        satMax: 85,
        lightnessMin: 85,
        lightnessMax: 95,
      },
    },
  },
  {
    label: "Gothic",
    value: "gothic",
    colorScheme: "dark",
    slugColours: {
      skill: {
        hueMin: 310,
        hueMax: 10,
        satMin: 70,
        satMax: 85,
        lightnessMin: 15,
        lightnessMax: 25,
        textOnDark: colord("#c0c0c0"),
      },
      course: {
        hueMin: 240,
        hueMax: 290,
        satMin: 20,
        satMax: 35,
        lightnessMin: 15,
        lightnessMax: 25,
        textOnDark: colord("#c0c0c0"),
      },
      teacher: {
        hueMin: 15,
        hueMax: 30,
        satMin: 20,
        satMax: 35,
        lightnessMin: 15,
        lightnessMax: 25,
        textOnDark: colord("#c0c0c0"),
      },
    },
  },
] as const satisfies ThemeDefinition[];

export type Theme = (typeof themes)[number]["value"];

/** Keyed lookup: `themeRegistry["gothic"].slugColours.skill` etc. */
export const themeRegistry = Object.fromEntries(
  themes.map((t) => [t.value, t]),
) as Record<Theme, ThemeDefinition>;

/**
 * Returns the theme value whose `colorScheme` matches the OS preference.
 * Falls back to the first theme if nothing matches.
 */
export const getFallbackTheme = (): Theme => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const target = prefersDark ? "dark" : "light";
  return themes.find((t) => t.colorScheme === target)?.value ?? themes[0].value;
};
