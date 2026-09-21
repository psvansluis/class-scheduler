import { describe, it, expect } from "vitest";
import { useSlugColour } from "../../src/functions/useSlugColour";
import { colord } from "colord";

describe("useSlugColour (pure)", () => {
  it("returns deterministic colours for the same slug", () => {
    const slug = "Ϝυψ";
    const result1 = useSlugColour(slug);
    const result2 = useSlugColour(slug);
    expect(result1).toStrictEqual(result2);
  });

  it("handles hue wrapping correctly", () => {
    const config = {
      hueMin: 350,
      hueMax: 20,
    };

    const hues = Array.from({ length: 100 }, (_, i) =>
      useSlugColour(`slug-${i}`, config).bgColour.hue(),
    );

    const allInRange = hues.every(
      (hue) => hue >= config.hueMin || hue <= config.hueMax,
    );

    expect(allInRange).toBe(true);
  });

  it("chooses high‑contrast text colour", () => {
    const { textColour } = useSlugColour("dark-bg", {
      lightnessMin: 10,
      lightnessMax: 10,
    });
    expect(textColour).toStrictEqual(colord("#ffffff"));
  });
});
