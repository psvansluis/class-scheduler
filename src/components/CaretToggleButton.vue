<template>
  <Button
    :id="id"
    type="button"
    variant="ghost"
    size="xs"
    class="group h-6 px-1.5 text-xs font-normal leading-none text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent inline-flex items-center gap-1"
    :aria-label="label"
    :aria-expanded="expanded"
    :aria-controls="ariaControls"
    @click="$emit('toggle')"
  >
    <slot />
    <span
      class="inline-flex shrink-0 rounded-md p-1.5 transition-colors group-hover:bg-accent group-focus-visible:bg-accent"
    >
      <PhCaretDown
        :size="12"
        class="transition-transform duration-200"
        :class="{ 'rotate-180': expanded }"
      />
    </span>
  </Button>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { PhCaretDown } from "@phosphor-icons/vue";

defineProps<{
  expanded: boolean;
  label: string;
  ariaControls?: string;
  id?: string;
}>();

defineEmits<{
  (event: "toggle"): void;
}>();
</script>
