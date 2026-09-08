<template>
  <span class="add-name-container app-input-wrapper-hover">
    <input
      v-bind="$attrs"
      v-model="modelValue"
      :placeholder="placeholder"
      class="app-input-field"
      :class="{ 'input-error': !isValid && modelValue.length > 0 }"
      @input="reportValidity"
      @keyup.enter="$emit('enterPressed')"
    />
    <button
      class="material-icons-outlined app-action-badge app-action-badge-interactive"
      id="add-name-button"
      :disabled="!isValid"
      @click="$emit('buttonPressed')"
    >
      add
    </button>
  </span>
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
  (e: "buttonPressed"): void;
}>();

const modelValue = defineModel<string>({ default: "" });

const isValid = computed<boolean>(() => {
  const trimmed = modelValue.value.trim();
  return trimmed.length > 0 && trimmed === modelValue.value;
});

const reportValidity = () => emit("update:valid", isValid.value);

watch(modelValue, () => reportValidity(), { immediate: true });
</script>

<style scoped>
.add-name-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 350px;
  width: 100%;
  margin: 5px;
}

.input-error {
  color: red !important;
  background-color: #ffdddd !important;
  border-color: red !important;
}
</style>
