<!-- File: novue-ui-components/components/button.vue -->
<template>
  <button
    :class="[buttonClasses, shapeClasses]"
    :disabled="disabled || loading"
    :style="colorStyles"
  >
    <div class="flex items-center gap-2" :class="{ 'gap-0': iconOnly }">
      <div v-if="loading" class="animate-spin">
        <Icon icon="eos-icons:loading" :width="iconSize" />
      </div>
      <Icon
        v-else-if="startIcon"
        :icon="startIcon"
        :width="iconSize"
        :class="[{ 'opacity-50': disabled }, iconClass]"
      />
      <span v-if="!iconOnly">
        <slot v-if="!loading">{{ label }}</slot>
        <span v-else class="opacity-80"> {{ loadingLabel }}</span>
      </span>
      <Icon
        v-if="endIcon && !loading && !iconOnly"
        :icon="endIcon"
        :width="iconSize"
        :class="[{ 'opacity-50': disabled }, iconClass]"
      />
    </div>
  </button>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { computed } from "vue";

// Define props with TypeScript
interface Props {
  variant?:
    | "solid"
    | "outline"
    | "ghost"
    | "soft"
    | "link"
    | "text"
    | "gradient";
  size?: "sm" | "md" | "lg";
  shape?: "semi-rounded" | "rounded" | "square" | "pill";
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  startIcon?: string;
  endIcon?: string;
  color?: string;
  secondaryColor?: string;
  gradientType?: "primary" | "secondary" | "mix" | "custom";
  gradientDir?:
    | "to-r"
    | "to-l"
    | "to-t"
    | "to-b"
    | "to-tr"
    | "to-tl"
    | "to-br"
    | "to-bl";
  iconOnly?: boolean;
  iconSize?: string | number;
  iconClass?: string;
  loadingLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "solid",
  size: "md",
  shape: "semi-rounded",
  disabled: false,
  loading: false,
  label: "Novue Button",
  color: "var(--color-primary-600)",
  secondaryColor: "var(--color-primary-600)",
  gradientType: "primary",
  gradientDir: "to-r",
  iconOnly: false,
  loadingLabel: "Loading...",
});

// Computed icon size based on button size or custom size
const iconSize = computed(() => {
  if (props.iconSize) {
    // Convert string to number if needed
    return typeof props.iconSize === "string"
      ? parseInt(props.iconSize, 10)
      : props.iconSize;
  }
  const sizeMap: Record<string, number> = {
    sm: props.iconOnly ? 18 : 16,
    md: props.iconOnly ? 22 : 18,
    lg: props.iconOnly ? 26 : 20,
  };
  return sizeMap[props.size] || 20;
});

// Computed color styles with enhanced gradient support
const colorStyles = computed(() => {
  if (props.variant === "gradient") {
    let startColor, endColor;

    switch (props.gradientType) {
      case "primary":
        startColor = "#ac80ee"; // primary-400
        endColor = "#6f33bd"; // primary-700
        break;
      case "secondary":
        startColor = "#728f8c"; // secondary-400
        endColor = "#3a4b4b"; // secondary-700
        break;
      case "mix":
        startColor = "#9b65e7"; // primary-500
        endColor = "#506a68"; // secondary-500
        break;
      case "custom":
        startColor = props.color;
        endColor = props.secondaryColor;
        break;
      default:
        startColor = "#ac80ee";
        endColor = "#6f33bd";
    }

    return {
      backgroundImage: `linear-gradient(${
        props.gradientDir === "to-r"
          ? "90deg"
          : props.gradientDir === "to-l"
          ? "270deg"
          : props.gradientDir === "to-t"
          ? "0deg"
          : props.gradientDir === "to-b"
          ? "180deg"
          : props.gradientDir === "to-tr"
          ? "45deg"
          : props.gradientDir === "to-tl"
          ? "315deg"
          : props.gradientDir === "to-br"
          ? "135deg"
          : props.gradientDir === "to-bl"
          ? "225deg"
          : "90deg"
      }, ${startColor}, ${endColor})`,
      color: "white",
      border: "none",
      transition: "all 0.3s ease",
    };
  }

  return {
    "--color-primary": props.color,
  };
});

// Helper function to adjust color brightness
const adjustColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

// Computed shape classes with icon-only support
const shapeClasses = computed(() => {
  const baseShape = {
    rounded: "rounded-2xl",
    "semi-rounded": "rounded-md",
    square: "rounded-none",
    pill: "rounded-full",
  }[props.shape];

  return props.iconOnly ? `${baseShape} p-2 aspect-square` : baseShape;
});

// Computed classes using Tailwind CSS
const buttonClasses = computed(() => {
  const baseClasses = [
    "inline-flex items-center justify-center font-medium transition-all duration-200 w-fit",
    "focus:outline-none focus:ring-2 focus:ring-opacity-50",
    props.iconOnly ? "!min-w-0" : "",
  ].join(" ");

  const variantClasses = {
    solid:
      "bg-[var(--color-primary)] text-white hover:bg-[color-mix(in_srgb,var(--color-primary),#000_20%)] active:bg-[color-mix(in_srgb,var(--color-primary),#000_30%)]",
    outline:
      "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white active:bg-[var(--color-primary-600)]",
    ghost:
      "text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_90%)] active:bg-[color-mix(in_srgb,var(--color-primary),#fff_80%)]",
    soft: "bg-[color-mix(in_srgb,var(--color-primary),#fff_85%)] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_75%)]",
    link: "text-[var(--color-primary)] hover:underline decoration-2 underline-offset-2 p-0 min-w-0",
    text: "text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_92%)] active:bg-[color-mix(in_srgb,var(--color-primary),#fff_85%)]",
    gradient:
      "text-white bg-gradient-to-r hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
  };

  const sizeClasses = props.iconOnly
    ? {
        sm: "p-1.5",
        md: "p-2",
        lg: "p-2.5",
      }
    : {
        sm: "px-3 py-1.5 text-sm min-w-[1rem]",
        md: "px-4 py-2 text-base min-w-[1.5rem]",
        lg: "px-6 py-2.5 text-lg min-w-[2rem]",
      };

  const stateClasses = [
    props.disabled || props.loading ? "opacity-50 cursor-not-allowed" : "",
    props.loading ? "cursor-wait" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `${baseClasses} ${variantClasses[props.variant]} ${
    sizeClasses[props.size]
  } ${stateClasses}`;
});
</script>
