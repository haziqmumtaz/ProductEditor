<script setup lang="ts">
import { ref, watch } from "vue";
const emit = defineEmits(["search"]);
const searchQuery = ref("");
let debounceTimeout: NodeJS.Timeout | undefined;

watch(searchQuery, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => emit("search", val), 500);
});
</script>

<template>
  <input
    v-model="searchQuery"
    placeholder="Search products..."
    class="border rounded px-3 py-2 w-full"
  />
</template>
