<!-- File: novue-ui-components/components/button.vue -->
<template>
  <button :class="buttonClasses" :disabled="disabled">
    <slot>{{ label }}</slot>
  </button>
</template>

<script lang="ts" setup>
import { computed } from "vue";

// Define props with TypeScript
defineProps<{
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
}>({
  variant: "solid",
  size: "md",
  disabled: false,
  label: "Nova Button",
});

// Computed classes using Tailwind CSS
const buttonClasses = computed(() => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-opacity-50";
  const variantClasses = {
    solid:
      "bg-[--color-primary] text-white hover:bg-[color-mix(in srgb, var(--color-primary), #000 20%)]",
    outline:
      "border border-[--color-primary] text-[--color-primary] hover:bg-[--color-primary] hover:text-white",
    ghost:
      "text-[--color-primary] hover:bg-[color-mix(in srgb, var(--color-primary), #fff 90%)]",
  };
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";

  return `${baseClasses} ${variantClasses[props.variant]} ${
    sizeClasses[props.size]
  } ${disabledClasses}`;
});
</script>
