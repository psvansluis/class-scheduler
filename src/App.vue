<template>
  <div
    id="app-container"
    class="max-w-6xl mx-auto px-4 py-8 md:px-8 min-h-screen"
  >
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground mb-4">
        Declarative Class Scheduler
      </h1>
      <nav class="flex items-center gap-2 border-b border-border pb-3">
        <AppLink
          v-for:="route in appLinks"
          :key="route.name"
          :name="route.name"
          class="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent [&.router-link-active]:bg-primary/10 [&.router-link-active]:text-primary [&.router-link-active]:font-semibold"
        >
          {{ route.label }}
        </AppLink>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
const appLinks = [
  { name: "form", label: "Setup Constraints" },
  { name: "result", label: "View Schedule" },
];
</script>
