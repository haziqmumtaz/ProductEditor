<script setup lang="ts">
defineProps<{
  title: string;
  logo?: string;
}>();
</script>

<template>
  <header class="header">
    <div class="flex-1">
      <img v-if="logo" :src="logo" alt="Logo" class="header-logo" />
      <h1 class="header-title">{{ title }}</h1>
    </div>
    <slot />
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: rgba(60, 31, 66);
  color: #ffffff;
  padding: 1rem;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header .header-logo {
  width: 2rem;
  height: 2rem;
}

.header .header-title {
  margin: 0;
  align-items: start;
  font-size: 1.5rem;
}
</style>
