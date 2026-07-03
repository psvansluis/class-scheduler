<template>
  <span class="add-name">
    <input
      v-bind="$attrs"
      v-model="modelValue"
      :placeholder="placeholder"
      :class="{ 'input-error': !isValid && modelValue.length > 0 }"
      @input="reportValidity"
      @keyup.enter="$emit('enterPressed')"
    />
    <button
      class="material-icons-outlined"
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

<style scoped lang="css">
.input-error {
  color: red;
  background-color: #ffdddd;
}

.add-name {
  font-weight: 500;
  white-space: nowrap;

  position: relative;
  display: inline-flex;
  align-items: center;
  color: black;
  border: 2px solid rgb(102, 102, 102);
  background-color: #ffffff7e;
  border-radius: 7px;
  margin: 5px;
  padding: 6px 10px;
  padding-right: 24px;
  box-sizing: border-box;
  transition: padding 0.2s ease;
}

.add-name button {
  position: absolute;
  right: -3px;
  font-size: 0.95rem;
  color: rgb(102, 102, 102);
  background-color: #ffffff7e;
  border: 1.5px solid rgb(102, 102, 102);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: scale(0.6);
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;
}

.add-name:hover button {
  background-color: #ffffff;
  transform: scale(1);
}

.add-name:hover button:disabled {
  transform: scale(0.8);
}

.add-name button:hover {
  background-color: #ddffdd;
  color: #00cc00;
  border-color: #00cc00;
}

.add-name button:hover:disabled {
  background-color: #dddddd;
  color: rgb(102, 102, 102);
  border-color: rgb(102, 102, 102);
}
</style>
