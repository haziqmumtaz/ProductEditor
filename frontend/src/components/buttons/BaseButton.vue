<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "primary" | "secondary" | "danger" | "basic";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "auto";
  disabled?: boolean;
  title?: string;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
  loading: false,
  type: "button",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-primary border-black text-black hover:bg-gray-100 drop-shadow-sm",
    secondary: "bg-secondary border-gray-300 text-gray-700 hover:bg-gray-200",
    danger: "bg-danger border-red-300 text-white hover:bg-red-100",
    basic: "bg-basic border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  const sizes = {
    xs: "px-2 py-1 text-xs rounded-md min-h-[24px]",
    sm: "px-3 py-1.5 text-sm rounded-md min-h-[32px]",
    md: "px-4 py-2 text-sm rounded-lg min-h-[40px]",
    lg: "px-6 py-3 text-base rounded-lg min-h-[48px]",
    xl: "px-8 py-4 text-lg rounded-lg min-h-[56px]",
    auto: "px-4 py-2 text-sm rounded-lg w-auto",
  };

  const disabled =
    props.disabled || props.loading ? "opacity-50 cursor-not-allowed" : "";
  const loading = props.loading ? "cursor-wait" : "";

  return `${base} ${variants[props.variant]} ${
    sizes[props.size]
  } ${disabled} ${loading}`;
});

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :title="title"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Button Content -->
    <slot />
  </button>
</template>

<style scoped>
/* Button styles are handled by Tailwind classes */
button:disabled {
  pointer-events: none;
}

/* Ensure proper spacing for icons */
button svg:first-child:not(:last-child) {
  margin-right: 0.5rem;
}

button svg:last-child:not(:first-child) {
  margin-left: 0.5rem;
}

/* Loading state animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
