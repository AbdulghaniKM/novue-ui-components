<!-- File: novue-ui-components/components/button.vue -->
<template>
  <button
    :class="[buttonClasses, shapeClasses]"
    :disabled="disabled || loading"
    :style="colorStyles"
  >
    <div class="inline-flex items-center gap-2" :class="{ 'gap-0': iconOnly }">
      <div v-if="loading" class="animate-spin">
        <Icon icon="eos-icons:loading" :width="iconSize" />
      </div>
      <Icon
        v-else-if="startIcon"
        :icon="startIcon"
        :width="iconSize"
        :class="[{ 'opacity-50': disabled }, iconClass]"
      />
      <span v-if="!iconOnly" :class="{ 'opacity-0': loading }">
        <slot>{{ label }}</slot>
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
import { computed } from "vue";
import { Icon } from "@iconify/vue";

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
  shape?: "rounded" | "square" | "pill";
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  startIcon?: string;
  endIcon?: string;
  color?: string;
  secondaryColor?: string;
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
  iconSize?: number;
  iconClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "solid",
  size: "md",
  shape: "rounded",
  disabled: false,
  loading: false,
  label: "Nova Button",
  color: "#3B82F6",
  secondaryColor: "#10B981",
  gradientDir: "to-r",
  iconOnly: false,
});

// Computed icon size based on button size or custom size
const iconSize = computed(() => {
  if (props.iconSize) return props.iconSize;
  return {
    sm: props.iconOnly ? 18 : 16,
    md: props.iconOnly ? 22 : 18,
    lg: props.iconOnly ? 26 : 20,
  }[props.size];
});

// Computed color styles with gradient support
const colorStyles = computed(() => {
  if (props.variant === "gradient") {
    return {
      "--color-primary": `linear-gradient(${props.gradientDir}, ${props.color}, ${props.secondaryColor})`,
      "--color-hover": `linear-gradient(${props.gradientDir}, ${adjustColor(
        props.color,
        -20
      )}, ${adjustColor(props.secondaryColor, -20)})`,
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
    rounded: "rounded-md",
    square: "rounded-none",
    pill: "rounded-full",
  }[props.shape];

  return props.iconOnly ? `${baseShape} p-2 aspect-square` : baseShape;
});

// Computed classes using Tailwind CSS
const buttonClasses = computed(() => {
  const baseClasses = [
    "inline-flex items-center justify-center font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-opacity-50",
    props.iconOnly ? "!min-w-0" : "",
  ].join(" ");

  const variantClasses = {
    solid:
      "bg-[--color-primary] text-white hover:bg-[color-mix(in_srgb,var(--color-primary),#000_20%)] active:bg-[color-mix(in_srgb,var(--color-primary),#000_30%)]",
    outline:
      "border-2 border-[--color-primary] text-[--color-primary] hover:bg-[--color-primary] hover:text-white active:bg-[color-mix(in_srgb,var(--color-primary),#000_10%)]",
    ghost:
      "text-[--color-primary] hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_90%)] active:bg-[color-mix(in_srgb,var(--color-primary),#fff_80%)]",
    soft: "bg-[color-mix(in_srgb,var(--color-primary),#fff_85%)] text-[--color-primary] hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_75%)]",
    link: "text-[--color-primary] hover:underline decoration-2 underline-offset-2 p-0 min-w-0",
    text: "text-[--color-primary] hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_92%)] active:bg-[color-mix(in_srgb,var(--color-primary),#fff_85%)]",
    gradient:
      "bg-[image:var(--color-primary)] text-white hover:bg-[image:var(--color-hover)]",
  };

  const sizeClasses = props.iconOnly
    ? {
        sm: "p-1.5",
        md: "p-2",
        lg: "p-2.5",
      }
    : {
        sm: "px-3 py-1.5 text-sm min-w-[5rem]",
        md: "px-4 py-2 text-base min-w-[6rem]",
        lg: "px-6 py-2.5 text-lg min-w-[7rem]",
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
