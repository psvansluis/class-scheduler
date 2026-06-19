<template>
  <div class="input-wrapper">
    <input
      v-model="modelValue"
      :placeholder="placeholder"
      :class="{ 'input-error': !isValid && modelValue.length > 0 }"
      @input="reportValidity"
      @keyup.enter="$emit('enterPressed')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

interface Props {
  placeholder?: string;
}
withDefaults(defineProps<Props>(), {
  placeholder: "Enter a name",
});

const emit = defineEmits<{
  (e: "enterPressed"): void;
  (e: "update:valid", isValid: boolean): void;
}>();
const modelValue = defineModel<string>({ default: "" });
const isValid = computed<boolean>(() => {
  const trimmed = modelValue.value.trim();
  return trimmed.length > 0 && trimmed === modelValue.value;
});
const reportValidity = () => emit("update:valid", isValid.value);

watch(modelValue, () => reportValidity(), { immediate: true });
</script>

<style lang="css">
.input-error {
  color: red;
}
</style>
