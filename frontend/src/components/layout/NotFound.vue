<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-[60vh] text-center"
  >
    <div class="mb-8">
      <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p class="text-gray-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
    </div>

    <RouterLink
      to="/products"
      class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to Products
    </RouterLink>
  </div>
</template>
