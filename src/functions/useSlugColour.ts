import { hash } from "./hash";
import { Colord, colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
extend([a11yPlugin]);

export interface SlugColourConfig {
  /** Hue lower bound (0‑360). Default: 135 */
  hueMin?: number;
  /** Hue upper bound (0‑360). Can be < hueMin to enable wrapping. Default: 195 */
  hueMax?: number;
  /** Saturation lower bound (0‑100). Default: 70 */
  satMin?: number;
  /** Saturation upper bound (0‑100). Default: 85 */
  satMax?: number;
  /** Lightness lower bound (0‑100). Default: 70 */
  lightnessMin?: number;
  /** Lightness upper bound (0‑100). Default: 70 */
  lightnessMax?: number;
  /** Text colour for light backgrounds. Default: '#000000' */
  textOnLight?: Colord;
  /** Text colour for dark backgrounds. Default: '#ffffff' */
  textOnDark?: Colord;
}

/**
 * Pure function that returns background and text colours based on a slug.
 *
 * @param slug - The identifier string that will be hashed.
 * @param config - Optional overrides for colour ranges and text colours.
 * @returns An object containing `bgColour` (e.g. "hsl(150, 80%, 70%)") and `textColour` (hex string).
 */
export function useSlugColour(
  slug: string,
  config?: SlugColourConfig,
): { bgColour: Colord; textColour: Colord } {
  const cfg: Required<SlugColourConfig> = {
    hueMin: 135,
    hueMax: 195,
    satMin: 70,
    satMax: 85,
    lightnessMin: 70,
    lightnessMax: 70,
    textOnLight: colord("#000000"),
    textOnDark: colord("#ffffff"),
    ...(config ?? {}),
  };

  const hashed = Math.abs(hash(slug));

  const rangeValue = (min: number, max: number) => {
    const span = max - min;
    return min + (hashed % (span || 1));
  };

  // Hue with wrapping
  const hueSpan =
    cfg.hueMax >= cfg.hueMin
      ? cfg.hueMax - cfg.hueMin
      : 360 - cfg.hueMin + cfg.hueMax;
  const hue = (cfg.hueMin + (hashed % (hueSpan || 1))) % 360;

  const sat = rangeValue(cfg.satMin, cfg.satMax);
  const lightness = rangeValue(cfg.lightnessMin, cfg.lightnessMax);

  const bgColour = colord({ h: hue, s: sat, l: lightness });

  const contrastLight = bgColour.contrast(cfg.textOnLight);
  const contrastDark = bgColour.contrast(cfg.textOnDark);
  const textColour =
    contrastLight >= contrastDark ? cfg.textOnLight : cfg.textOnDark;

  return { bgColour, textColour };
}
