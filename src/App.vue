<template>
  <div
    id="app-container"
    class="max-w-6xl mx-auto px-4 py-8 md:px-8 min-h-screen"
  >
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground mb-4">
        Declarative Class Scheduler
      </h1>
      <nav class="flex items-center border-b border-border pb-3">
        <NavigationMenu :viewport="false" class="max-w-none flex-none">
          <NavigationMenuList class="justify-start">
            <NavigationMenuItem v-for="route in appLinks" :key="route.name">
              <NavigationMenuLink as-child>
                <AppLink
                  :name="route.name"
                  class="bg-background/40 [&.router-link-active]:bg-background/70 [&.router-link-active]:font-semibold"
                >
                  {{ route.label }}
                </AppLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ThemeSelector class="ml-auto" />
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import ThemeSelector from "@/components/ThemeSelector.vue";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const appLinks = [
  { name: "form", label: "Setup Constraints" },
  { name: "result", label: "View Schedule" },
];
</script>
