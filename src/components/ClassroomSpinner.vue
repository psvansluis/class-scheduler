<template>
  <div class="flex flex-col items-center justify-center p-8">
    <div
      class="book-page size-10 rounded-[4px] border-2 border-border bg-primary shadow-xs"
    ></div>
    <p class="mt-4 text-sm text-muted-foreground">
      <slot>{{ title }}.</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({ title: String });
</script>

<style scoped>
.book-page {
  animation: flip-page 1.2s infinite ease-in-out;
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
</style>
