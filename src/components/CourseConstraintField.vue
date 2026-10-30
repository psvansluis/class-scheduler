<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex min-w-0 items-center gap-2">
      <Switch
        :id="`${id}-enabled`"
        :model-value="enabled"
        :disabled="disabled"
        :aria-label="`Enable ${label}`"
        @update:model-value="$emit('update:enabled', $event)"
      />
      <Label
        :for="`${id}-enabled`"
        class="cursor-pointer text-sm font-medium opacity-80"
      >
        {{ label }}
      </Label>
    </div>
    <NumericStepper
      :id="id"
      :label="label"
      :test-id="testId"
      :model-value="modelValue"
      :min="min"
      :max="max"
      :disabled="!enabled || disabled"
      class="w-[5.5rem] flex-shrink-0"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import NumericStepper from "./NumericStepper.vue";

defineProps<{
  id: string;
  label: string;
  testId: string;
  enabled: boolean;
  modelValue: number;
  min: number;
  max: number;
  disabled: boolean;
}>();

defineEmits<{
  (event: "update:enabled", value: boolean): void;
  (event: "update:modelValue", value: number | undefined): void;
}>();
</script>
