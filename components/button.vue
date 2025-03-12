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
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hoverEffect?: "none" | "scale" | "lift" | "glow";
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
  shadow: "none",
  hoverEffect: "none",
});
const iconSize = computed(() => {
  if (props.iconSize) {
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
const colorStyles = computed(() => {
  if (props.variant === "gradient") {
    let startColor, endColor;
    switch (props.gradientType) {
      case "primary":
        startColor = "#ac80ee";
        endColor = "#6f33bd";
        break;
      case "secondary":
        startColor = "#728f8c";
        endColor = "#3a4b4b";
        break;
      case "mix":
        startColor = "#9b65e7";
        endColor = "#506a68";
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

const shapeClasses = computed(() => {
  const baseShape = {
    rounded: "rounded-2xl",
    "semi-rounded": "rounded-md",
    square: "rounded-none",
    pill: "rounded-full",
  }[props.shape];
  return props.iconOnly ? `${baseShape} p-2 aspect-square` : baseShape;
});
const buttonClasses = computed(() => {
  const baseClasses = [
    "inline-flex items-center justify-center font-medium transition-all duration-200 w-fit",
    "focus:outline-none",
    props.hoverEffect === "scale"
      ? "hover:scale-101 transform hover:transition-all"
      : "",
    props.hoverEffect === "lift"
      ? "hover:-translate-y-0.5 transform hover:transition-all"
      : "",
    props.hoverEffect === "glow"
      ? "hover:ring-2 hover:ring-opacity-50 hover:ring-[var(--color-primary)]"
      : "",
    props.shadow === "sm" ? "shadow-sm" : "",
    props.shadow === "md" ? "shadow" : "",
    props.shadow === "lg" ? "shadow-lg" : "",
    props.shadow === "xl" ? "shadow-xl" : "",
    props.iconOnly ? "!min-w-0" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const variantClasses = {
    solid:
      "bg-[var(--color-primary)] focus:ring-2 focus:ring-opacity-50 text-white hover:bg-[color-mix(in_srgb,var(--color-primary),#000_20%)] active:bg-[color-mix(in_srgb,var(--color-primary),#000_30%)]",
    outline:
      "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white active:bg-[var(--color-primary-600)]",
    ghost:
      "text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_90%)] active:bg-[color-mix(in_srgb,var(--color-primary),#fff_80%)]",
    soft: "bg-[color-mix(in_srgb,var(--color-primary),#fff_85%)] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_75%)]",
    link: "text-[var(--color-primary)] hover:underline decoration-2 underline-offset-2 p-0 min-w-0 cursor-pointer",
    text: "text-[var(--color-primary)] hover:text-[color-mix(in_srgb,var(--color-primary),#000_20%)] active:text-[color-mix(in_srgb,var(--color-primary),#000_30%)] p-0 min-w-0",
    gradient: "text-white bg-gradient-to-r ",
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
