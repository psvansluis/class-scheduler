import { describe, it, expect } from "vitest";
import { encodeForm, decodeForm } from "../../src/functions/formCodec";
import type { Form } from "../../src/types/form";
import type { HumanLabel } from "../../src/types/slugLabel";
import type { TimeslotId } from "../../src/functions/timeslots";
import { labelToSlug } from "../../src/functions/slugify";

describe("formCodec", () => {
  it("encodes and decodes complete Form round-trip using generic Serializable", () => {
    const math = labelToSlug("math" as HumanLabel, "skill");
    const form: Form = {
      skills: new Set([math]),
      teachers: new Map([
        [
          labelToSlug("mr_jansen" as HumanLabel, "teacher"),
          {
            skills: new Set([math]),
            availableSlots: new Set<TimeslotId>(["mon-1", "mon-2", "tue-5"]),
          },
        ],
      ]),
      courses: new Map([
        [
          labelToSlug("algebra" as HumanLabel, "course"),
          {
            skills: new Set([math]),
            classCount: 3,
            constraints: [
              { type: "successive", blockLength: 3 },
              { type: "min_day_gap", gap: 1 },
            ],
          },
        ],
      ]),
    };

    const encoded = encodeForm(form);
    const decoded = decodeForm(encoded);

    expect(Array.from(decoded.skills)).toEqual([math]);

    const teacher = decoded.teachers.get(
      labelToSlug("mr_jansen" as HumanLabel, "teacher"),
    );
    expect(teacher).toBeDefined();
    expect(Array.from(teacher!.skills)).toEqual([math]);
    expect(teacher!.availableSlots).toEqual(
      new Set<TimeslotId>(["mon-1", "mon-2", "tue-5"]),
    );

    const course = decoded.courses.get(
      labelToSlug("algebra" as HumanLabel, "course"),
    );
    expect(course).toBeDefined();
    expect(Array.from(course!.skills)).toEqual([math]);
    expect(course!.classCount).toBe(3);
    expect(course!.constraints).toEqual([
      { type: "successive", blockLength: 3 },
      { type: "min_day_gap", gap: 1 },
    ]);
  });
});
