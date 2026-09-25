<template>
  <div class="flex items-center gap-2 w-full max-w-sm">
    <div class="relative flex-1">
      <Input
        v-bind="$attrs"
        v-model="modelValue"
        :placeholder="placeholder"
        :aria-invalid="isInvalid"
        class="pr-8"
        @input="reportValidity"
        @keyup.enter="$emit('enterPressed')"
      />
      <span
        v-if="modelValue.length > 0"
        class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
      >
        <PhCheckCircle
          v-if="isValid"
          :size="16"
          weight="bold"
          class="text-success"
        />
        <PhWarningCircle v-else :size="16" weight="bold" class="text-error" />
      </span>
    </div>

    <Button
      variant="ghost"
      size="icon"
      :disabled="!isValid"
      class="shrink-0 text-primary hover:bg-primary/10 disabled:opacity-40"
      @click="$emit('buttonPressed')"
    >
      <PhPlusCircle :size="22" weight="bold" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import {
  PhCheckCircle,
  PhWarningCircle,
  PhPlusCircle,
} from "@phosphor-icons/vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  placeholder?: string;
}
withDefaults(defineProps<Props>(), {
  placeholder: "Enter a name",
});

const emit = defineEmits<{
  (e: "enterPressed"): void;
  (e: "update:valid", isValid: boolean): void;
  (e: "buttonPressed"): void;
}>();

const modelValue = defineModel<string>({ default: "" });

const isValid = computed<boolean>(() => {
  const trimmed = modelValue.value.trim();
  return trimmed.length > 0 && trimmed === modelValue.value;
});

/** True only when the user has typed something that is not valid yet */
const isInvalid = computed(() => modelValue.value.length > 0 && !isValid.value);

const reportValidity = () => emit("update:valid", isValid.value);

watch(modelValue, () => reportValidity(), { immediate: true });
</script>
