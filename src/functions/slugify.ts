import type { HumanLabel, PrologSlug, TypePrefix } from "../types/slugLabel";
import { Base64 } from "js-base64";

export function labelToSlug(
  label: HumanLabel,
  typePrefix: TypePrefix,
): PrologSlug {
  const encoded = Base64.encode(label as string);
  return `${typePrefix}__${encoded}` as PrologSlug;
}

export function slugToLabel(slug: PrologSlug): {
  label: HumanLabel;
  typePrefix: TypePrefix;
} {
  const parts = (slug as string).split("__");
  const typePrefix = parts[0] as TypePrefix;
  const encodedPayload = parts[1];

  if (!encodedPayload) {
    throw new Error(
      `❌ Parsing Error: Provided slug is not bijectively encoded: ${slug}`,
    );
  }
  const label = Base64.decode(encodedPayload) as HumanLabel;
  return { label, typePrefix };
}
