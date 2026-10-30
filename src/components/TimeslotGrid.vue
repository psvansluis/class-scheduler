<template>
  <div class="timeslot-grid select-none space-y-2">
    <!-- Presets and counter -->
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <div class="flex items-center gap-1">
        <Button
          v-for="preset in Object.keys(PRESET_SLOTS)"
          :key="preset"
          type="button"
          size="sm"
          class="h-6 px-1.5"
          :disabled="disabled"
          @click="applyPreset(preset)"
        >
          {{ PRESET_SLOTS[preset].label }}
        </Button>
      </div>
    </div>

    <!-- 5x8 Matrix -->
    <div
      class="inline-block rounded-md border border-border/60 bg-muted/20 p-2"
    >
      <div class="grid grid-cols-[1.5rem_repeat(5,1.75rem)] gap-1 items-center">
        <!-- Top header row: empty corner + day labels -->
        <span
          class="text-center text-[10px] font-semibold text-muted-foreground"
        >
          P
        </span>
        <span
          v-for="day in DAYS"
          :key="day"
          class="text-center text-[10px] font-semibold text-muted-foreground"
        >
          {{ DAY_LABELS[day] }}
        </span>

        <!-- 8 Period rows -->
        <template v-for="period in PERIODS" :key="`row-${period}`">
          <!-- Row label (Period number) -->
          <span class="text-center text-[10px] font-mono text-muted-foreground">
            {{ period }}
          </span>

          <!-- 5 Day cells for this period -->
          <button
            v-for="day in DAYS"
            :key="formatSlotId(day, period)"
            type="button"
            role="checkbox"
            :aria-checked="isSelected(day, period)"
            :aria-label="`${DAY_LABELS[day]} Period ${period}`"
            :disabled="disabled"
            :class="[
              'h-7 w-7 rounded-sm border text-[10px] font-medium transition-colors cursor-pointer flex items-center justify-center outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              isSelected(day, period)
                ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-2xs'
                : 'bg-background hover:bg-muted text-muted-foreground/60 border-border/40',
            ]"
            @mousedown="onMouseDown(day, period, $event)"
            @mouseenter="onMouseEnter(day, period)"
            @keydown.space.prevent="toggleSlot(day, period)"
            @keydown.enter.prevent="toggleSlot(day, period)"
          >
            <span v-if="isSelected(day, period)" class="text-[9px]">✓</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Button } from "@/components/ui/button";
import {
  DAYS,
  PERIODS,
  DAY_LABELS,
  formatSlotId,
  type SlotPreset,
  type TimeslotId,
  type TimeslotDay,
  type TimeslotPeriod,
  PRESET_SLOTS,
} from "../functions/timeslots";

const props = withDefaults(
  defineProps<{
    modelValue: Set<TimeslotId>;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: Set<TimeslotId>): void;
}>();

const isDragging = ref(false);
const dragTargetValue = ref(false);

const isSelected = (day: TimeslotDay, period: TimeslotPeriod): boolean =>
  props.modelValue.has(formatSlotId(day, period));

const setSlotSelected = (
  day: TimeslotDay,
  period: TimeslotPeriod,
  selected: boolean,
) => {
  const next = new Set(props.modelValue);
  const slotId = formatSlotId(day, period);
  const action = selected ? "add" : "delete";
  next[action](slotId);
  emit("update:modelValue", next);
};

const toggleSlot = (day: TimeslotDay, period: TimeslotPeriod) => {
  if (props.disabled) return;
  setSlotSelected(day, period, !isSelected(day, period));
};

const onMouseDown = (
  day: TimeslotDay,
  period: TimeslotPeriod,
  event: MouseEvent,
) => {
  if (props.disabled || event.button !== 0) return;
  isDragging.value = true;
  dragTargetValue.value = !isSelected(day, period);
  setSlotSelected(day, period, dragTargetValue.value);
};

const onMouseEnter = (day: TimeslotDay, period: TimeslotPeriod) => {
  if (!isDragging.value || props.disabled) return;
  if (isSelected(day, period) === dragTargetValue.value) return;
  setSlotSelected(day, period, dragTargetValue.value);
};

const onGlobalMouseUp = () => (isDragging.value = false);

const applyPreset = (preset: SlotPreset) => {
  if (props.disabled) return;
  emit("update:modelValue", PRESET_SLOTS[preset].values);
};

onMounted(() => window.addEventListener("mouseup", onGlobalMouseUp));

onUnmounted(() => window.removeEventListener("mouseup", onGlobalMouseUp));
</script>
