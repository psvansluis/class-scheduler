import { describe, it, expect } from "vitest";
import { formatSlotId, parseSlotId } from "../../src/functions/timeslots";

describe("timeslots", () => {
  it("formats and parses slot IDs symmetrically", () => {
    const slotId = formatSlotId("wed", 4);
    expect(slotId).toBe("wed-4");
    expect(parseSlotId(slotId)).toEqual({
      day: "wed",
      dayNumber: 3,
      period: 4,
    });
  });
});
