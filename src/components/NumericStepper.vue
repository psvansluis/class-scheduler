<template>
  <NumberField
    :id="id"
    :model-value="modelValue"
    :min="min"
    :max="max"
    :step="1"
    :format-options="{ maximumFractionDigits: 0 }"
    class="w-[7.5rem]"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot name="label" />
    <NumberFieldContent>
      <NumberFieldDecrement
        :aria-label="`Decrease ${label}`"
        :disabled="disabled"
      >
        <PhMinus :size="12" />
      </NumberFieldDecrement>
      <NumberFieldInput
        :aria-label="label"
        :data-testid="testId"
        :disabled="disabled"
        class="h-7 border-0 px-7 font-mono shadow-none focus-visible:ring-0"
      />
      <NumberFieldIncrement
        :aria-label="`Increase ${label}`"
        :disabled="disabled"
      >
        <PhPlus :size="12" />
      </NumberFieldIncrement>
    </NumberFieldContent>
  </NumberField>
</template>

<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { PhPlus, PhMinus } from "@phosphor-icons/vue";

withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue: number;
    min: number;
    max: number;
    testId: string;
    disabled?: boolean;
  }>(),
  { disabled: false },
);

defineEmits<{
  (event: "update:modelValue", value: number | undefined): void;
}>();
</script>
