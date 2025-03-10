// File: novue-ui-components/components/button.ts
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "NovueButton",
  // Use <script setup> style with defineProps and defineSlots
  props: {
    variant: {
      type: String as PropType<"solid" | "outline" | "ghost">,
      default: "solid",
      validator: (value: string) =>
        ["solid", "outline", "ghost"].includes(value),
    },
    size: {
      type: String as PropType<"sm" | "md" | "lg">,
      default: "md",
      validator: (value: string) => ["sm", "md", "lg"].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "Button",
    },
  },
  setup(props) {
    // Computed class based on variant, size, and disabled state
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
      const disabledClasses = props.disabled
        ? "opacity-50 cursor-not-allowed"
        : "";

      return `${baseClasses} ${variantClasses[props.variant]} ${
        sizeClasses[props.size]
      } ${disabledClasses}`;
    });

    return { buttonClasses };
  },
  template: `
    <button
      :class="buttonClasses"
      :disabled="disabled"
    >
      <slot>{{ label }}</slot>
    </button>
  `,
});
