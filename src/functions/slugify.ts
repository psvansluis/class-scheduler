import type { HumanLabel, PrologSlug, TypePrefix } from "../types/slugLabel";
import { Base64 } from "js-base64";

export function labelToSlug<T extends TypePrefix>(
  label: HumanLabel,
  typePrefix: T,
): PrologSlug<T> {
  const encoded = Base64.encode(label as string);
  return `${typePrefix}__${encoded}` as PrologSlug<T>;
}

export function slugToLabel<T extends TypePrefix>(
  slug: PrologSlug<T>,
): {
  label: HumanLabel;
  typePrefix: T;
} {
  const parts = (slug as string).split("__");
  const typePrefix = parts[0] as T;
  const encodedPayload = parts[1];

  if (!encodedPayload) {
    throw new Error(
      `❌ Parsing Error: Provided slug is not bijectively encoded: ${slug}`,
    );
  }
  const label = Base64.decode(encodedPayload) as HumanLabel;
  return { label, typePrefix };
}
