<template>
  <Button
    :id="id"
    type="button"
    variant="ghost"
    size="sm"
    class="h-6 px-1.5 text-xs font-normal text-muted-foreground hover:text-foreground flex items-center gap-1"
    :aria-label="label"
    :aria-expanded="expanded"
    :aria-controls="ariaControls"
    @click="$emit('toggle')"
  >
    <slot />
    <PhCaretDown
      :size="12"
      class="shrink-0 transition-transform duration-200"
      :class="{ 'rotate-180': expanded }"
    />
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
