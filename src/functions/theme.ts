export const themes = [
  { label: "Corporate", value: "corporate" },
  { label: "Gothic", value: "gothic" },
] as const;

export type Theme = (typeof themes)[number]["value"];
