export const DAYS = ["mon", "tue", "wed", "thu", "fri"] as const;

export const DAY_LABELS: Record<TimeslotDay, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
};

export const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const formatSlotId = (
  day: TimeslotDay,
  period: TimeslotPeriod,
): TimeslotId => `${day}-${period}`;

export const PRESET_SLOTS: Record<
  string,
  { label: string; values: Set<TimeslotId> }
> = {
  all: {
    label: "All",
    values: new Set(
      DAYS.flatMap((day) => PERIODS.map((p) => formatSlotId(day, p))),
    ),
  },
  none: { label: "None", values: new Set() },
  mornings: {
    label: "Mornings",
    values: new Set(
      DAYS.flatMap((day) =>
        ([1, 2, 3, 4] as const).map((p) => formatSlotId(day, p)),
      ),
    ),
  },
  afternoons: {
    label: "Afternoons",
    values: new Set(
      DAYS.flatMap((day) =>
        ([5, 6, 7, 8] as const).map((p) => formatSlotId(day, p)),
      ),
    ),
  },
} as const;

export type TimeslotDay = (typeof DAYS)[number];
export type TimeslotPeriod = (typeof PERIODS)[number];
export type TimeslotId = `${TimeslotDay}-${TimeslotPeriod}`;
export type SlotPreset = keyof typeof PRESET_SLOTS;

export const parseSlotId = (
  slotId: TimeslotId,
): { day: TimeslotDay; dayNumber: number; period: TimeslotPeriod } => {
  const [dayStr, periodStr] = slotId.split("-");
  const day = dayStr as TimeslotDay;
  const dayNumber = DAYS.indexOf(day) + 1;
  return { day, dayNumber, period: Number(periodStr) as TimeslotPeriod };
};

export const getPresetSlots = (preset: SlotPreset): Set<TimeslotId> =>
  new Set(PRESET_SLOTS[preset].values);
