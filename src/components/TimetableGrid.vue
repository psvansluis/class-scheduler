<template>
  <div class="overflow-x-auto">
    <Table class="min-w-[640px]">
      <TableHeader>
        <TableRow>
          <TableHead
            class="w-12 text-center text-xs font-mono text-muted-foreground"
          />
          <TableHead
            v-for="day in DAYS"
            :key="day"
            class="text-center text-xs font-mono text-muted-foreground w-12"
          >
            {{ DAY_LABELS[day] }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="period in PERIODS" :key="period">
          <TableCell
            class="text-center text-xs font-mono text-muted-foreground w-12"
          >
            P{{ period }}
          </TableCell>
          <TableCell
            v-for="(day, dayIndex) in DAYS"
            :key="`${day}-${period}`"
            class="align-top p-1"
          >
            <TimetableCell :classes="classesAt(dayIndex + 1, period)" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DAYS, DAY_LABELS, PERIODS } from "@/functions/timeslots";
import type { ScheduledClass } from "@/types/schedule.js";
import TimetableCell from "./TimetableCell.vue";

const props = defineProps<{
  classes: ScheduledClass[];
}>();

const classesAt = (day: number, period: number): ScheduledClass[] =>
  props.classes.filter((c) => c.day === day && c.period === period);
</script>
