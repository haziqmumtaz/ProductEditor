<script setup lang="ts">
import { ref, watch } from "vue";
const emit = defineEmits(["search"]);
const searchQuery = ref("");
let debounceTimeout: NodeJS.Timeout | undefined;

watch(searchQuery, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => emit("search", val), 500);
});

function clearSearch() {
  searchQuery.value = "";
}
</script>

<template>
  <div class="relative">
    <input
      v-model="searchQuery"
      placeholder="Search products..."
      class="border rounded px-3 py-2 w-full pr-8"
    />
    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      type="button"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>
