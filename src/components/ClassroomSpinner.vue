<template>
  <div class="spinner-container">
    <div class="book-page"></div>
    <p class="loading-text">
      <slot>{{ title }}.</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({ title: String });
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.book-page {
  width: 40px;
  height: 40px;
  background-color: var(--vt-c-text-dark-2, #42b883);
  border-color: #666;
  border-width: 2px;
  border-style: solid;
  animation: flip-page 1.2s infinite ease-in-out;
  border-radius: 4px;
}

@keyframes flip-page {
  0% {
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
  }
  50% {
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
  }
  100% {
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
}

.loading-text {
  margin-top: 1rem;
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
}
</style>
